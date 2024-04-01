const Blog = require('../models/blogs');

const blogRouter = require('express').Router();

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();

  response.status(201).json(result);
  // const blog = new Blog(req.body);
  // blog
  //   .save()
  //   .then((result) => {
  //     res.status(201).json(result);
  //   })
  //   .catch((err) => next(err));
});
blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = blogRouter;
