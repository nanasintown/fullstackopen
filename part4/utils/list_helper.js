const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, b) => (sum += b.likes), 0);
};

const favoriteBlog = (blogs = []) => {
  const pick = ({ __v, _id, url, ...rest }) => rest;
  return blogs.reduce((f, b) => {
    if (!f || f.likes < b.likes) {
      f = pick(b);
    }
    return f;
  }, null);
};

const mostBlogs = (blogs = []) => {
  const topBlogers = blogs.reduce(
    (acc, book) => {
      if (!acc[book.author]) {
        acc[book.author] = { blogs: 0 };
      }
      acc[book.author].blogs++;
      if (acc.blogs < acc[book.author].blogs) {
        acc.author = book.author;
        acc.blogs = acc[book.author].blogs;
      }
      return acc;
    },
    { blogs: 0 }
  );

  return { author: topBlogers.author, blogs: topBlogers.blogs };
};

const mostLikes = (blogs = []) => {
  const topLikes = blogs.reduce(
    (acc, b) => {
      if (!acc[b.author]) {
        acc[b.author] = { likes: 0 };
      }
      acc[b.author].likes += b.likes;
      if (acc.likes < acc[b.author].likes) {
        acc.author = b.author;
        acc.likes = acc[b.author].likes;
      }
      return acc;
    },
    { likes: 0 }
  );

  return { author: topLikes.author, likes: topLikes.likes };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
