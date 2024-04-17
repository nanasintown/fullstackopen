const logger = require('./logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'token invalid' });
  } else if (error.message.includes('jwt must be provided')) {
    return response.status(401).json({ error: 'token missing' });
  }
  next(error);
};

const tokenExtractor = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  request.user = await User.findById(decodedToken.id);
  next();
};

module.exports = {
  errorHandler,
  userExtractor,
  tokenExtractor,
};
