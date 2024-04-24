const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const User = require('../models/user');

let authToken = '';

beforeEach(async () => {
  await User.deleteMany({});
  const pwHash = await bcrypt.hash('testing123', 10);
  const user = new User({ username: 'blogTest', pwHash });
  await user.save();

  const loggedIn = await api.post('/api/login').send({
    username: 'blogTest',
    password: 'testing123',
  });

  authToken = `Bearer ${loggedIn.body.token}`;
  await Blog.deleteMany({});
  // await Blog.insertMany(helper.initialBlogs);
  for (const blog of helper.initialBlogs) {
    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(blog)
      .expect(201);
  }
});

describe('GET /api/blogs', () => {
  test('Return JSON content', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .set('Authentication', authToken)
      .expect('Content-Type', /application\/json/);
  });
  test('returns the correct number of blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authentication', authToken);
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });
  test('Blogs with ID', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authentication', authToken);
    const blogs = response.body;

    blogs.forEach((blog) => {
      assert.notStrictEqual(blog.id, undefined);
    });
  });
});

describe('POST /api/blogs', () => {
  const newBlog = {
    title: 'Test post blog',
    author: 'Author',
    url: 'aalto.fi',
    likes: 0,
  };
  test('Increase number of blogs', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authentication', authToken)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set('Authentication', authToken);
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
  });

  test('Add blogs', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authentication', authToken)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set('Authentication', authToken);

    const blogTitles = response.body.map((r) => r.title);
    assert(blogTitles.includes('Test post blog'));

    const blogAuthor = response.body.map((r) => r.author);
    assert(blogAuthor.includes('Author'));
  });

  test('Initilize like to 0 if not specified', async () => {
    const undefinedLikesBlog = {
      title: 'Check likes',
      author: 'Another Author',
      url: 'aalto.fi',
    };
    await api
      .post('/api/blogs')
      .send(undefinedLikesBlog)
      .set('Authentication', authToken)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set('Authentication', authToken);
    const savedBlog = response.body.find((b) => b.title === 'Check likes');
    assert.strictEqual(savedBlog.likes, 0);
  });

  test('Code 400 undefine title or url', async () => {
    const blogWithOnlyAuthor = {
      author: 'Unique author',
    };
    await api
      .post('/api/blogs')
      .send(blogWithOnlyAuthor)
      .set('Authentication', authToken)
      .expect(400);
  });
});

describe('DELETE /api/blogs/:id', () => {
  test('Delete blog with ID', async () => {
    const blogList = await helper.blogsInDB();
    const blogToDelete = blogList[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authentication', authToken)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDB();

    const contents = blogsAtEnd.map((r) => r.title);
    assert(!contents.includes(blogToDelete.title));

    assert.strictEqual(blogsAtEnd.length, blogList.length - 1);
  });
  test('Code 400 for blog not exist', async () => {
    const nonExistingId = 'weirdoIDnoEveryonecanimagineDragonComingback';
    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authentication', authToken)
      .expect(400);
  });
});

describe('PUT /api/blogs/:id', () => {
  test('Update blog OK!', async () => {
    const blogList = await helper.blogsInDB();
    const blogToUpdate = blogList[0];
    const likesInStart = blogToUpdate.likes;
    blogToUpdate.likes += 1;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ blogToUpdate })
      .set('Authentication', authToken)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set('Authentication', authToken);
    const updatedBlog = response.body.find((b) => b.id === blogToUpdate.id);
    assert.strictEqual(updatedBlog.likes, likesInStart);
  });
  test('Invalid ID, code 400', async () => {
    const nonExistingId = 'weirdoIDnoEveryonecanimagineDragon';
    await api
      .put(`/api/blogs/${nonExistingId}`)
      .set('Authentication', authToken)
      .expect(400);
  });
});
after(async () => {
  await mongoose.connection.close();
});
