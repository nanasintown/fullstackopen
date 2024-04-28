import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('Render blogs', () => {
  const blog = {
    title: 'TestBlog',
    author: 'Sir/Maam',
    url: 'hehehe',
  };

  const mockLike = vi.fn();
  const mockDelete = vi.fn();
  const mockUser = {};

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
