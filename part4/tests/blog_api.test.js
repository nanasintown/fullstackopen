const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('GET /api/blogs', () => {
  test('returns JSON content', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('returns the correct number of blogs', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });
  test('returns blogs with an id field', async () => {
    const response = await api.get('/api/blogs');
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
  test('increases the number of returned blogs by one', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
  });

  test('adds the proper content to the database', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const blogTitles = response.body.map((r) => r.title);
    assert(blogTitles.includes('Test post blog'));

    const blogAuthor = response.body.map((r) => r.author);
    assert(blogAuthor.includes('Author'));
  });

  test('sets likes to 0 if undefined', async () => {
    const undefinedLikesBlog = {
      title: 'Check likes',
      author: 'Another Author',
      url: 'aalto.fi',
    };
    await api
      .post('/api/blogs')
      .send(undefinedLikesBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const savedBlog = response.body.find((b) => b.title === 'Check likes');
    assert.strictEqual(savedBlog.likes, 0);
  });

  test('returns 400 if title or url is undefined', async () => {
    const blogWithOnlyAuthor = {
      author: 'Unique author',
    };
    await api.post('/api/blogs').send(blogWithOnlyAuthor).expect(400);
  });
});

describe('DELETE /api/blogs/:id', () => {
  test('succesfully deletes existing blog', async () => {
    const blogList = await helper.blogsInDB();
    const blogToDelete = blogList[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDB();

    const contents = blogsAtEnd.map((r) => r.title);
    assert(!contents.includes(blogToDelete.title));

    assert.strictEqual(blogsAtEnd.length, blogList.length - 1);
  });
  test('returns 400 if blog to delete does not exist', async () => {
    const nonExistingId =
      'ItIsHighlyUnlikelyThatAnIdLikeThisGotGeneratedByMongo';
    await api.delete(`/api/blogs/${nonExistingId}`).expect(400);
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
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const updatedBlog = response.body.find((b) => b.id === blogToUpdate.id);
    assert.strictEqual(updatedBlog.likes, likesInStart);
  });
  test('Invalid ID, code 400', async () => {
    const nonExistingId = 'weirdoIDnoEveryonecanimagineDragon';
    await api.put(`/api/blogs/${nonExistingId}`).expect(400);
  });
});
after(async () => {
  await mongoose.connection.close();
});
