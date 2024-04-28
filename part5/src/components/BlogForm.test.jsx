import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('Calls event handlers:', () => {
  const mockCreateBlog = vi.fn();

  test('Test form with data', async () => {
    const { container } = render(<BlogForm createBlog={mockCreateBlog} />);
    const user = userEvent.setup();

    const title = container.querySelector('#title-input');
    const author = container.querySelector('#author-input');
    const url = container.querySelector('#url-input');
    await user.type(title, 'Title1');
    await user.type(author, 'NoAuthor');
    await user.type(url, 'haha');

    const createButton = screen.getByText('create');
    await user.click(createButton);
    expect(mockCreateBlog.mock.calls).toHaveLength(1);
    expect(mockCreateBlog.mock.calls[0][0].title).toBe('Title1');
    expect(mockCreateBlog.mock.calls[0][0].author).toBe('NoAuthor');
    expect(mockCreateBlog.mock.calls[0][0].url).toBe('haha');
  });
});
