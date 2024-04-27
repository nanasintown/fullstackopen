import { useState } from 'react';

const Blog = ({ blog, likeBlog }) => {
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
    });
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
        </div>
      </div>
    </div>
  );
};

export default Blog;
