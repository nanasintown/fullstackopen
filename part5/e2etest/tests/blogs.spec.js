const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, logOut, createBlog, likeBlog } = require('./helper');

describe('Bloglist app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Test name',
        username: 'namemean',
        password: 'pupupu',
      },
    });
    await request.post('/api/users', {
      data: {
        name: 'Testing new',
        username: 'nanana',
        password: 'pipipi',
      },
    });
    await page.goto('/');
  });

  test('login form is visible', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Log in to BlogList App' })
    ).toBeVisible();

    await expect(page.getByText('username')).toBeVisible();
    await expect(page.locator('input[name="Username"]')).toBeVisible();

    await expect(page.getByText('password')).toBeVisible();
    await expect(page.locator('input[name="Password"]')).toBeVisible();

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });
});

describe('Login', () => {
  test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'namemean', 'pupupu');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Logged in as namemean')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'All blogs' })
    ).toBeVisible();
  });

  test('fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'nememn', 'ppopopop');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Logged in as namemean')).not.toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'All blogs' })
    ).not.toBeVisible();
    await expect(page.getByText('Wrong username or password')).toBeVisible();
  });
});

describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, 'namemean', 'pupupu');
    await expect(page.getByText('Logged in as namemean')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'All blogs' })
    ).toBeVisible();
  });

  test('a new blog can be created', async ({ page }) => {
    await createBlog(page, 'newTitle', 'newAuthor', 'newURL');
    await expect(
      page.getByText('Succesfully added new blog information')
    ).toBeVisible();
    await expect(
      page.getByText('viewTestTitle (newAuthor)').toBeVisible()
    ).toBeVisible();
  });
  ///////////////
  describe('and having created a blog', () => {
    beforeEach(async ({ page }) => {
      await createBlog(page, 'TestTitle', 'TestAuthor', 'TestUrl');
      await expect(page.getByText('viewTestTitle (TestAuthor)')).toBeVisible();
    });
    test('Like existed blog', async ({ page }) => {
      await createBlog(page, 'Title2', 'AuthorB', 'urlsth2');
      const blog2hidden = page.getByText('viewTestTitle2 (AuthorB)');
      await expect(blog2hidden).toBeVisible();
      await blog2hidden.getByRole('button', { name: 'view' }).click();

      const blog2detailed = page.getByText('hideTestTitle2 (AuthorB)');
      await expect(blog2detailed.getByText('Likes: 0 like')).toBeVisible();
      await expect(blog2detailed.getByText('Added by namemean')).toBeVisible();
      await blog2detailed.getByRole('button', { name: 'like' }).click();
      await expect(blog2detailed.getByText('Likes: 1 like')).toBeVisible();

      test('Only creater can remove', async ({ page }) => {
        // await createBlog(page, 'Blog1', 'author1', 'url1');
        // await expect(page.getByText('Successfully created!')).toBeVisible();
        // await expect(page.getByText('viewTestTitle (author1)')).toBeVisible();
        const blogHidden = page.getByText('viewTestTitle (TestAuthor)');
        await expect(blogHidden).toBeVisible();
        await blogHidden.getByRole('button', { name: 'view' }).click();

        const blogDetailed = page.getByText('hideTestTitle (TestAuthor)');
        await expect(blogDetailed.getByText('Added by nanana')).toBeVisible();
        await expect(
          blogDetailed.getByRole('button', { name: 'remove' })
        ).toBeVisible();

        await logOut(page);
        await loginWith(page, 'tytyty', 'hehett');
        await expect(page.getByText('Logged in as tytyty')).toBeVisible();

        await expect(page.getByText('viewTestTitle (author1)')).toBeVisible();
        await blogHidden.getByRole('button', { name: 'view' }).click();
        await expect(blogDetailed.getByText('Added by tytyty')).toBeVisible();
        await expect(
          blogDetailed.getByRole('button', { name: 'remove' })
        ).not.toBeVisible();
      });
      test('Only creater can delete', async ({ page }) => {
        const blogHidden = page.getByText('viewTestTitle (TestAuthor)');
        await blogHidden.getByRole('button', { name: 'view' }).click();

        const blogDetailed = page.getByText('hideTestTitle (TestAuthor)');
        page.on('dialog', (dialog) => dialog.accept());
        await blogDetailed.getByRole('button', { name: 'remove' }).click();
        await expect(
          page.getByText('viewTestTitle (TestAuthor)')
        ).not.toBeVisible();
      });
      test('blogs are arranged in the order according to the likes, the blog with the most likes first', async ({
        page,
      }) => {
        // Creating blogs with single-word titles and shorter URLs
        await createBlog(page, {
          title: 'Technology',
          author: 'John Doe',
          url: 'https://ex1.com',
        });
        await createBlog(page, {
          title: 'Science',
          author: 'Jane Smith',
          url: 'https://ex2.com',
        });
        await createBlog(page, {
          title: 'Food',
          author: 'Chef Gordon',
          url: 'https://ex3.com',
        });
        await createBlog(page, {
          title: 'Travel',
          author: 'Wanderlust Explorer',
          url: 'https://ex4.com',
        });

        // Checking if all blogs are displayed
        const blogListStart = await page
          .getByTestId('blogList')
          .locator('span.blogTitle');
        await expect(blogListStart).toHaveCount(4);

        // Liking blogs to change the order
        await likeBlog(page, 'Technology', 'https://ex1.com', 'likes 1');

        await likeBlog(page, 'Food', 'https://ex3.com', 'likes 1');
        await likeBlog(page, 'Food', 'https://ex3.com', 'likes 2');
        await likeBlog(page, 'Food', 'https://ex3.com', 'likes 3');
        await likeBlog(page, 'Food', 'https://ex3.com', 'likes 4');
        await likeBlog(page, 'Food', 'https://ex3.com', 'likes 5');

        await likeBlog(page, 'Travel', 'https://ex4.com', 'likes 1');
        await likeBlog(page, 'Travel', 'https://ex4.com', 'likes 2');
        await likeBlog(page, 'Travel', 'https://ex4.com', 'likes 3');

        // Verifying the order of blogs after likes
        const firstBlogEnd = await page
          .getByTestId('blogList')
          .locator('span.blogTitle')
          .nth(0);
        const secondBlogEnd = await page
          .getByTestId('blogList')
          .locator('span.blogTitle')
          .nth(1);
        const thirdBlogEnd = await page
          .getByTestId('blogList')
          .locator('span.blogTitle')
          .nth(2);
        const fourthBlogEnd = await page
          .getByTestId('blogList')
          .locator('span.blogTitle')
          .nth(3);

        // Verifying the order of blogs after likes
        await expect(firstBlogEnd).toHaveText('Food Chef Gordon');
        await expect(secondBlogEnd).toHaveText('Travel Wanderlust Explorer');
        await expect(thirdBlogEnd).toHaveText('Technology John Doe');
        await expect(fourthBlogEnd).toHaveText('Science Jane Smith');
      });
    });
  });
});
