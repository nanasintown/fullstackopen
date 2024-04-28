import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('Render blogs', () => {
  const mockUser = { id: '123344569704' };
  const blog = {
    title: 'TestBlog',
    author: 'Sir/Maam',
    url: 'hehehe',
    user: mockUser,
  };

  const mockLike = vi.fn();
  const mockDelete = vi.fn();

  test('Render only title and author.', () => {
    const { container } = render(
      <Blog
        blog={blog}
        likeBlog={mockLike}
        deleteBlog={mockDelete}
        user={mockUser}
      />
    );

    const hideDetails = container.querySelector('#hide-details');
    expect(hideDetails.textContent).toContain(blog.title);
    expect(hideDetails.textContent).toContain(blog.author);
    expect(hideDetails.textContent).not.toContain(blog.url);
    expect(hideDetails.textContent).not.toContain('Likes:');
  });
  test('Renders url, likes and user when click view', () => {
    const { container } = render(
      <Blog
        blog={blog}
        likeBlog={mockLike}
        deleteBlog={mockDelete}
        user={mockUser}
      />
    );

    const showDetails = container.querySelector('#show-details');
    expect(showDetails.textContent).toContain(blog.title);
    expect(showDetails.textContent).toContain(blog.author);
    expect(showDetails.textContent).toContain(blog.url);
    expect(showDetails.textContent).toContain('Likes:');
  });
  test('Check "hide" button when click view.', async () => {
    render(
      <Blog
        blog={blog}
        likeBlog={mockLike}
        deleteBlog={mockDelete}
        user={mockUser}
      />
    );
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);
    screen.getByText('hide');
  });
});

describe('Calls event handlers:', () => {
  const mockUser = { id: '123344569704' };

  const blog = {
    title: 'TestBlog',
    author: 'Mr/Ms',
    url: 'hihihi',
    user: mockUser,
  };
  const mockLike = vi.fn();
  const mockDelete = vi.fn();

  test('Check if the like button is clicked twice, the event handler is called twice', async () => {
    render(
      <Blog
        blog={blog}
        likeBlog={mockLike}
        deleteBlog={mockDelete}
        user={mockUser}
      />
    );
    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockLike.mock.calls).toHaveLength(2);
  });
});
