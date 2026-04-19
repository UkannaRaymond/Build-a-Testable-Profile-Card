// profile-card.test.js
// Playwright test suite for the Testable Profile Card
//
// Run locally:
//   npx playwright test profile-card.test.js
//
// Run against the live Vercel URL:
//   BASE_URL=https://your-project.vercel.app npx playwright test profile-card.test.js

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Get an element by its data-testid */
const byTestId = (page, id) => page.locator(`[data-testid="${id}"]`);

// ── 1. Presence — all required elements exist ──────────────────────────────────

test.describe('Required elements — presence', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('card root container exists', async ({ page }) => {
    await expect(byTestId(page, 'test-profile-card')).toBeVisible();
  });

  test('user name exists and is not empty', async ({ page }) => {
    const el = byTestId(page, 'test-user-name');
    await expect(el).toBeVisible();
    const text = await el.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test('user bio exists and is not empty', async ({ page }) => {
    const el = byTestId(page, 'test-user-bio');
    await expect(el).toBeVisible();
    const text = await el.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test('avatar image exists', async ({ page }) => {
    await expect(byTestId(page, 'test-user-avatar')).toBeVisible();
  });

  test('epoch time element exists', async ({ page }) => {
    await expect(byTestId(page, 'test-user-time')).toBeVisible();
  });

  test('social links list exists', async ({ page }) => {
    await expect(byTestId(page, 'test-user-social-links')).toBeVisible();
  });

  test('hobbies list exists', async ({ page }) => {
    await expect(byTestId(page, 'test-user-hobbies')).toBeVisible();
  });

  test('dislikes list exists', async ({ page }) => {
    await expect(byTestId(page, 'test-user-dislikes')).toBeVisible();
  });

});

// ── 2. Social links — individual testids and behaviour ────────────────────────

test.describe('Social links', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Twitter link exists inside social links list', async ({ page }) => {
    const list = byTestId(page, 'test-user-social-links');
    await expect(list.locator('[data-testid="test-user-social-twitter"]')).toBeVisible();
  });

  test('GitHub link exists inside social links list', async ({ page }) => {
    const list = byTestId(page, 'test-user-social-links');
    await expect(list.locator('[data-testid="test-user-social-github"]')).toBeVisible();
  });

  test('LinkedIn link exists inside social links list', async ({ page }) => {
    const list = byTestId(page, 'test-user-social-links');
    await expect(list.locator('[data-testid="test-user-social-linkedin"]')).toBeVisible();
  });

  test('all social links open in a new tab', async ({ page }) => {
    const links = byTestId(page, 'test-user-social-links').locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('all social links have an href', async ({ page }) => {
    const links = byTestId(page, 'test-user-social-links').locator('a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

});

// ── 3. Avatar ─────────────────────────────────────────────────────────────────

test.describe('Avatar', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('avatar has a non-empty alt attribute', async ({ page }) => {
    const alt = await byTestId(page, 'test-user-avatar').getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt.trim().length).toBeGreaterThan(0);
  });

  test('avatar image loads successfully (no broken image)', async ({ page }) => {
    const img = byTestId(page, 'test-user-avatar');
    const naturalWidth = await img.evaluate(el => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test('avatar is inside a <figure> element', async ({ page }) => {
    const tagName = await byTestId(page, 'test-user-avatar')
      .evaluate(el => el.closest('figure') !== null);
    expect(tagName).toBe(true);
  });

});

// ── 4. Epoch time ─────────────────────────────────────────────────────────────

test.describe('Epoch time', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('time element displays a numeric value', async ({ page }) => {
    const timeEl = byTestId(page, 'test-user-time');
    const text = await timeEl.innerText();
    // strip locale formatting commas and spaces
    const numeric = parseInt(text.replace(/[^0-9]/g, ''), 10);
    expect(isNaN(numeric)).toBe(false);
  });

  test('displayed time is within 5 seconds of Date.now()', async ({ page }) => {
    const timeEl = byTestId(page, 'test-user-time');
    const browserNow = await page.evaluate(() => Date.now());
    const text = await timeEl.innerText();
    const displayed = parseInt(text.replace(/[^0-9]/g, ''), 10);

    const delta = Math.abs(browserNow - displayed);
    expect(delta).toBeLessThan(5000); // within 5 seconds
  });

  test('time value updates after 2 seconds', async ({ page }) => {
    const timeEl = byTestId(page, 'test-user-time');
    const before = await timeEl.innerText();
    await page.waitForTimeout(2000);
    const after = await timeEl.innerText();
    expect(before).not.toBe(after);
  });

  test('time element has aria-live="polite"', async ({ page }) => {
    await expect(byTestId(page, 'test-user-time')).toHaveAttribute('aria-live', 'polite');
  });

});

// ── 5. Lists — hobbies and dislikes ───────────────────────────────────────────

test.describe('Hobbies and dislikes lists', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('hobbies list has at least one item', async ({ page }) => {
    const items = byTestId(page, 'test-user-hobbies').locator('li');
    await expect(items.first()).toBeVisible();
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('dislikes list has at least one item', async ({ page }) => {
    const items = byTestId(page, 'test-user-dislikes').locator('li');
    await expect(items.first()).toBeVisible();
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('hobbies and dislikes are distinct lists', async ({ page }) => {
    const hobbiesText = await byTestId(page, 'test-user-hobbies').innerText();
    const dislikesText = await byTestId(page, 'test-user-dislikes').innerText();
    expect(hobbiesText).not.toBe(dislikesText);
  });

});

// ── 6. Semantic HTML structure ────────────────────────────────────────────────

test.describe('Semantic structure', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('card root is an <article> element', async ({ page }) => {
    const tag = await byTestId(page, 'test-profile-card').evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('article');
  });

  test('user name is inside a heading element (h1–h3)', async ({ page }) => {
    const tag = await byTestId(page, 'test-user-name').evaluate(el => el.tagName.toLowerCase());
    expect(['h1', 'h2', 'h3']).toContain(tag);
  });

  test('user bio is a <p> element', async ({ page }) => {
    const tag = await byTestId(page, 'test-user-bio').evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('p');
  });

  test('avatar is an <img> element', async ({ page }) => {
    const tag = await byTestId(page, 'test-user-avatar').evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('img');
  });

  test('social links is a <ul> element', async ({ page }) => {
    const tag = await byTestId(page, 'test-user-social-links').evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('ul');
  });

  test('hobbies is a <ul> element', async ({ page }) => {
    const tag = await byTestId(page, 'test-user-hobbies').evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('ul');
  });

  test('dislikes is a <ul> element', async ({ page }) => {
    const tag = await byTestId(page, 'test-user-dislikes').evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('ul');
  });

});

// ── 7. Accessibility ──────────────────────────────────────────────────────────

test.describe('Accessibility', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('card has an aria-label', async ({ page }) => {
    const label = await byTestId(page, 'test-profile-card').getAttribute('aria-label');
    expect(label).toBeTruthy();
  });

  test('all social links have an aria-label', async ({ page }) => {
    const links = byTestId(page, 'test-user-social-links').locator('a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const label = await links.nth(i).getAttribute('aria-label');
      expect(label).toBeTruthy();
    }
  });

  test('epoch time has aria-atomic="true"', async ({ page }) => {
    await expect(byTestId(page, 'test-user-time')).toHaveAttribute('aria-atomic', 'true');
  });

});

// ── 8. Keyboard navigation ────────────────────────────────────────────────────

test.describe('Keyboard navigation', () => {

  test('social links are reachable via Tab key', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.keyboard.press('Tab');

    const links = byTestId(page, 'test-user-social-links').locator('a');
    const count = await links.count();

    let anyFocused = false;
    for (let i = 0; i < count + 5; i++) {
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.getAttribute('data-testid') : null;
      });
      if (
        focused === 'test-user-social-twitter' ||
        focused === 'test-user-social-github' ||
        focused === 'test-user-social-linkedin'
      ) {
        anyFocused = true;
        break;
      }
      await page.keyboard.press('Tab');
    }

    expect(anyFocused).toBe(true);
  });

});
