import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const hideWhenVisible = { display: detailsVisible ? 'none' : '' };
  const showWhenVisible = { display: detailsVisible ? '' : 'none' };

  const blogStyle = {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 6,
    marginBottom: 5,
    radius: 3,
    border: 'solid',
    borderWidth: 1,
  };

  const like = (event) => {
    event.preventDefault();
    likeBlog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id,
      addedBy: blog.user.id,
    });
  };
  const remove = (userNameLoggedIn, blog) => {
    if (userNameLoggedIn === blog.user.username) {
      return (
        <div>
          <button onClick={() => removeBlog(blog)}>Remove</button>
        </div>
      );
    }
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <div style={blogStyle}>
          <button
            style={{ marginRight: '14px' }}
            onClick={() => setDetailsVisible(true)}
          >
            view
          </button>
          <b>{blog.title}</b> ({blog.author})
        </div>
      </div>

      <div style={showWhenVisible}>
        <div style={blogStyle}>
          <button
            style={{ marginRight: '15px' }}
            onClick={() => setDetailsVisible(false)}
          >
            hide
          </button>
          <b>{blog.title}</b> ({blog.author})
          <p>
            Likes: {blog.likes}{' '}
            <button
              onClick={like}
              style={{ marginLeft: '15px', radius: '3px' }}
            >
              like
            </button>
          </p>
          <p>{blog.url}</p>
          {blog.user && blog.user.username && (
            <p>Added by {blog.user.username}</p>
          )}
          {blog.user &&
            blog.user.username &&
            blog.user.username === user.username && (
              <button onClick={remove(user.username, blog)}>remove</button>
            )}
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Blog;
