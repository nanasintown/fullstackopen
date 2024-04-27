import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageStyle, setMessageStyle] = useState('');
  const [loginVisible, setLoginVisible] = useState(false);
  const blogFormRef = useRef();

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

  const handleRemoveBlog = async (blogToDelete) => {
    try {
      if (
        window.confirm(
          `Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`
        )
      ) {
        await blogService.removeBlog(blogToDelete.id);
        setBlogs(blogToDelete);
      }
    } catch (exception) {
      showMessage('error', 'Cannot delete the blog.');
      setTimeout(() => {
        clearMessage();
      }, 5000);
    }
  };

  const addBlog = async (blogObject) => {
    console.log('creating a new blog..');
    blogFormRef.current.toggleVisibility();

    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs([...blogs, returnedBlog]);
      console.log('..new blog created!');
      showMessage('correct', 'Successfully created!');
    } catch (exception) {
      console.log('..blog creation failed!');
      showMessage('error', "Can't create new blog!");
    }
  };

  const likeBlog = async (blogObject) => {
    try {
      await blogService.update(blogObject);
      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
      console.log('..blog liked!');
      showMessage('correct', 'Liked!');
    } catch (exception) {
      console.log('..failed!');
      showMessage('error', 'Cannot like blog');
    }
  };

  useEffect(() => {
    if (user !== null) {
      blogService
        .getAll()
        .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
    }
  }, [user, newBlog]);

  const sortBlogs = blogs.sort((a, b) => b.likes - a.likes);

  if (user === null) {
    return (
      <div>
        <button onClick={() => setLoginVisible(true)}>log in</button>

        <button onClick={() => setLoginVisible(false)}>cancel</button>
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
        {sortBlogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <h3>All blogs</h3>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          handleRemoveBlog={handleRemoveBlog}
        />
      ))}
      {/* <h3>Create new blog</h3>
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
      </form> */}
    </div>
  );
};

export default App;
