import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('Renders the blogs title and author.', () => {
  const blog = {
    title: 'TestBlog',
    author: 'Sir/Maam',
    url: 'hehehe',
  };

  const mockLike = vi.fn();
  const mockDelete = vi.fn();
  const mockUser = {};

  const { container } = render(
    <Blog
      blog={blog}
      likeBlog={mockLike}
      deleteBlog={mockDelete}
      user={mockUser}
    />
  );

  const hideDetails = container.querySelector('#hide-details');
  screen.debug(hideDetails);

  expect(hideDetails.textContent).toContain(blog.title);
  expect(hideDetails.textContent).toContain(blog.author);
  expect(hideDetails.textContent).not.toContain(blog.url);
  expect(hideDetails.textContent).not.toContain('Likes:');
});
