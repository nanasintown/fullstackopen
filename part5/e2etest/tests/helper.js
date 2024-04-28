const loginWith = async (page, username, password) => {
  await page.locator('input[name="Username"]').fill(username);
  await page.locator('input[name="Password"]').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new' }).click();
  await page.locator('#title-input').fill(title);
  await page.locator('#author-input').fill(author);
  await page.locator('#url-input').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
};

export { loginWith, createBlog };
