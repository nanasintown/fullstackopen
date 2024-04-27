import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            style={{ marginLeft: '20px' }}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          author
          <input
            style={{ marginLeft: '20px' }}
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>
        <div>
          url
          <input
            style={{ marginLeft: '20px' }}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <button
          type="submit"
          style={{ marginTop: '14px', marginBottom: '30px', radius: '2px' }}
        >
          create
        </button>
      </form>
    </div>
  );
};

BlogForm.proptypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
