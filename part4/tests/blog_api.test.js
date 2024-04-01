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
    assert.strictEqual(response.body.length, 6);
  });
});

after(async () => {
  await mongoose.connection.close();
});
