const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');

const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const middlewares = require('./utils/middlewares');
const testingRouter = require('./controllers/test');
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middlewares');

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/blogs', middlewares.userExtractor, blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use(middlewares.tokenExtractor);
app.use(middlewares.userExtractor);
app.use(unknownEndpoint);
app.use(errorHandler);
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}
module.exports = app;
