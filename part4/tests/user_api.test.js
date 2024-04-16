const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');

beforeEach(async () => {
  await User.deleteMany({});
  const pw = await bcrypt.hash('firstPW', 10);
  const user = new User({ username: 'first user', password: pw });
  await user.save();
});

describe('GET /api/users', () => {
  test('Get all users OK', async () => {
    const userAtFirst = await helper.usersInDB();
    const res = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.stricEqual(res.body.length, userAtFirst.length);
  });
});
describe('POST /api/users', () => {
  test('Create new user OK', async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: 'happy',
      name: 'Happy Tran',
      password: 'happy2017',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
  test('Check unique username with at least 3 chars', async () => {
    const usersAtStart = await helper.usersInDB();

    const validUser = {
      username: 'happypy',
      name: 'Happypy',
      password: 'huhuhhu23',
    };
    const duplicate = {
      username: 'heehee',
      name: 'Dee Dee',
      password: 'doodoo',
    };
    const notValidUsername = {
      username: 'h',
      name: 'Happy',
      password: 'hhthththt',
    };

    await api.post('/api/users').send(validUser).expect(201);
    await api.post('/api/users').send(duplicate).expect(400);
    await api.post('/api/users').send(notValidUsername).expect(400);

    const usersAtEnd = await helper.usersInDB();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(validUser.username));
    assert.strictEqual(
      usernames.filter((u) => u === duplicate.username).length,
      1
    );
    assert.strictEqual(
      usernames.filter((u) => u === notValidUsername.username).length,
      0
    );
  });
  test('Check password length', async () => {
    const usersAtStart = await helper.usersInDB();

    const validUser = {
      username: 'happy',
      name: 'Happy',
      password: 'happy2017',
    };
    const emptyPW = {
      username: 'happypy',
      name: 'Happy',
      password: '',
    };
    const invalidPW = {
      username: 'hhaha',
      name: 'Hehee',
      password: 'hh',
    };

    await api.post('/api/users').send(validUser).expect(201);
    await api.post('/api/users').send(emptyPW).expect(400);
    await api.post('/api/users').send(invalidPW).expect(400);

    const usersAtEnd = await helper.usersInDB();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(validUser.username));
    assert.strictEqual(usernames.includes(emptyPW.username), false);
    assert.strictEqual(usernames.includes(invalidPW.username), false);
  });
});

after(async () => {
  await mongoose.connection.close();
});
