const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');

const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middlewares');

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
