const Blog = require('../models/blogs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
// const middlewares = require('../utils/middlewares');

const blogRouter = require('express').Router();

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const body = request.body;
  // const user = await User.findById(body.user);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    url: body.url,
    title: body.url,
    author: body.author,
    user: user.id,
    likes: body.likes,
  });
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogRouter.delete('/:id', async (request, response) => {
  // await Blog.findByIdAndDelete(request.params.id);
  // response.status(204).end();

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);
  const chosenBlog = await Blog.findById(request.params.id);

  if (chosenBlog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    response
      .status(403)
      .json({ error: 'Only user who created this blog can delete.' });
  }
});

blogRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.status(200).json(updatedBlog);
});

module.exports = blogRouter;
