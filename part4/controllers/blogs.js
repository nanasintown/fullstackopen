const Blog = require('../models/blogs');

const blogRouter = require('express').Router();

blogRouter.get('/', (req, res, next) => {
  Blog.find({})
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((err) => next(err));
});

blogRouter.post('/', (req, res, next) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => next(err));
});

module.exports = blogRouter;
