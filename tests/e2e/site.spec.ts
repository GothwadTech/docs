import { test, expect } from '@playwright/test';
import { docs } from '../../src/data';

test('home, category filters, product directory and reset', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Big ideas. Build them here.' }),
  ).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(6);
  await page.getByRole('tab', { name: 'Communication', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(3);
  await page.getByRole('tab', { name: 'Developer tools', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(2);
  await page.getByRole('link', { name: 'View all products' }).click();
  await expect(page.locator('.product-card')).toHaveCount(12);
  await page.getByRole('textbox', { name: 'Filter products' }).fill('launcher');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page
    .getByRole('textbox', { name: 'Filter products' })
    .fill('does-not-exist');
  await expect(page.getByText('No products found')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.product-card')).toHaveCount(12);
});

test('full-text search, keyboard selection, empty state and dismissal', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  const input = page.getByRole('combobox');
  await input.fill('PKCE');
  await expect(page.getByRole('option').first()).toContainText(
    'Integrate Sign in with Gothwad',
  );
  await input.press('Enter');
  await expect(page).toHaveURL(/\/docs\/oauth$/);
  await expect(
    page.getByRole('heading', {
      name: '1. Register your application',
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('zxqvnonexistent');
  await expect(page.getByText('No results for')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('every MDX guide renders directly without runtime errors or missing content', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const doc of docs) {
    await page.goto(`/docs/${doc.slug}`);
    await expect(page.locator('article h1')).toHaveText(doc.title);
    await expect(page.locator('.prose h2').first()).toBeVisible();
    await expect(page.locator('.prose')).not.toContainText('Loading guide...');
  }
  expect(errors).toEqual([]);
});

test('anchors, copy controls, feedback and theme persistence', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/oauth');
  await page
    .locator('.page-outline')
    .getByRole('link', { name: '3. Generate PKCE and redirect' })
    .click();
  await expect(page).toHaveURL(/#3-generate-pkce-and-redirect$/);
  await page.getByRole('button', { name: 'Copy code' }).first().click();
  await expect(page.getByText('Copied!', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'code_challenge_method',
  );
  await page.getByRole('button', { name: 'Not quite', exact: true }).click();
  await expect(
    page.getByText('Your feedback is saved', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Tell us what could be clearer/ }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('repository search and unknown routes', async ({ page }) => {
  await page.goto('/repositories');
  await page
    .getByRole('textbox', { name: 'Search repositories' })
    .fill('tubeweb');
  await expect(page.locator('.repository-row')).toHaveCount(1);
  await page
    .locator('.repository-row')
    .getByRole('link', { name: 'Read docs' })
    .click();
  await expect(page).toHaveURL(/\/docs\/tube$/);
  await page.goto('/missing-page');
  await expect(
    page.getByRole('heading', { name: 'This page is off the map.' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Back to documentation' }).click();
  await expect(page).toHaveURL('/');
});

test('mobile navigation, guides and no viewport overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('link', { name: 'Quickstart', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/quickstart$/);
  await expect(page.locator('.sidebar')).not.toHaveClass(/is-open/);
  await expect(page.locator('.prose h2').first()).toBeVisible();
  for (const path of ['/', '/products', '/docs/oauth', '/repositories']) {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
