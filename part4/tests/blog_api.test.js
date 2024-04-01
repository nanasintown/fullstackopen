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
});

after(async () => {
  await mongoose.connection.close();
});
