const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

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

  test('Like existed blog', async ({ page }) => {
    await createBlog(page, 'Title1', 'AuthorA', 'urlsth');
    await expect(page.getByText('viewTestTitle (AuthorA)')).toBeVisible();

    await createBlog(page, 'Title2', 'AuthorB', 'urlsth2');
    const blog2hidden = page.getByText('viewTestTitle2 (AuthorB)');
    await expect(blog2hidden).toBeVisible();
    await blog2hidden.getByRole('button', { name: 'view' }).click();

    const blog2detailed = page.getByText('hideTestTitle2 (AuthorB)');
    await expect(blog2detailed.getByText('Likes: 0 like')).toBeVisible();
    await expect(blog2detailed.getByText('Added by namemean')).toBeVisible();
    await blog2detailed.getByRole('button', { name: 'like' }).click();
    await expect(blog2detailed.getByText('Likes: 1 like')).toBeVisible();

    await createBlog(page, 'Title3', 'AuthorC', 'urlsth3');
    await expect(page.getByText('viewTestTitle3 (AuthorB)')).toBeVisible();
  });
});
