import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState(null);
  const [messageStyle, setMessageStyle] = useState('');

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const showMessage = (style, content) => {
    setMessageStyle(style);
    setMessage(content);
  };

  const hideMessage = () => {
    setMessage(null);
    setMessageStyle('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in as', username);
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      console.log(`user token ${user.token}`);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log('login failed');
      console.log(username, password);
      console.log('user: ', user);
      showMessage('error', 'Wrong credentials!');
      setTimeout(() => {
        hideMessage();
      }, 5000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedUser');
    window.location.reload();
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    console.log('creating a new blog..');

    try {
      const newBlog = await blogService.create({ title, author, url });
      setTitle('');
      setAuthor('');
      setUrl('');
      setBlogs([...blogs, newBlog]);
      showMessage('correct', 'Blog successfully created!');
      console.log('..new blog created!');
    } catch (exception) {
      console.log('..blog creation failed!');
      showMessage('error', 'Can not create new blog');
      setTimeout(() => {
        hideMessage();
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} type="error" />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div className={messageStyle}>{message}</div>
          <div>
            username
            <input
              style={{ marginLeft: '20px' }}
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              style={{ marginLeft: '20px' }}
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button style={{ marginTop: '20px' }} type="submit">
            login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>It's Blog app</h2>
      <div>
        Logged in as {user.username}
        <button onClick={handleLogout} style={{ marginLeft: '25px' }}>
          logout
        </button>
      </div>
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
      <h3>Create new blog</h3>
      <div className={messageStyle}>{message}</div>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            style={{ marginLeft: '37px' }}
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            style={{ marginLeft: '20px' }}
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            style={{ marginLeft: '42px' }}
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button
          type="submit"
          style={{ marginTop: '14px', marginBottom: '30px', radius: '2px' }}
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default App;
