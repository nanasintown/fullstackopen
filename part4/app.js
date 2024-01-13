const express = require('express');
const app = express();
const cors = require('cors');

const blogRouter = require('./controllers/blogs');
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middlewares');

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/blogs', blogRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
