# Testing Notes — Profile Card

This document covers the test suite, how to run it locally, how to run it against the live URL, and manual checks that complement the automated tests.

---

## Test file

```
profile-card.test.js   — Playwright end-to-end test suite
```

---

## Setup

The tests use [Playwright](https://playwright.dev). Install it once:

```bash
npm init -y
npm install --save-dev @playwright/test
npx playwright install chromium
```

No other dependencies are needed.

---

## Running the tests

### Against the local dev server

Start a local server in one terminal:

```bash
npx serve .
# serving at http://localhost:3000
```

Run the tests in another terminal:

```bash
npx playwright test profile-card.test.js
```

### Against the live Vercel URL

```bash
BASE_URL=https://your-project.vercel.app npx playwright test profile-card.test.js
```

### With a visible browser (headed mode — useful for debugging)

```bash
npx playwright test profile-card.test.js --headed
```

### One test group only

```bash
npx playwright test profile-card.test.js --grep "Epoch time"
```

---

## What the tests cover

### 1. Presence
Verifies every required `data-testid` element exists in the DOM and is visible:
`test-profile-card`, `test-user-name`, `test-user-bio`, `test-user-avatar`, `test-user-time`, `test-user-social-links`, `test-user-hobbies`, `test-user-dislikes`.

### 2. Social links
- All three individual link testids exist inside `test-user-social-links`
- All links have `target="_blank"` and `rel` containing `noopener`
- All links have a non-empty `href`

### 3. Avatar
- Has a non-empty `alt` attribute
- Image loads without error (`naturalWidth > 0`)
- Element is nested inside a `<figure>`

### 4. Epoch time
- Displays a numeric value
- Value is within 5 seconds of `Date.now()` at the time the test runs
- Value changes after 2 seconds (confirms the live update tick is working)
- Element has `aria-live="polite"`

### 5. Lists
- Hobbies list has at least one `<li>`
- Dislikes list has at least one `<li>`
- The two lists contain different content

### 6. Semantic structure
Confirms element types match the spec:
`article`, `h1–h3`, `p`, `img`, `ul` × 3.

### 7. Accessibility
- Card root has `aria-label`
- Every social link has `aria-label`
- Epoch time element has `aria-atomic="true"`

### 8. Keyboard navigation
Tabs through the page and confirms at least one social link receives focus.

---

## Manual checks

The following are best verified by hand rather than automated tests.

### Visual / layout
- [ ] Card looks correct on mobile (< 520px) — content stacks vertically
- [ ] Card looks correct on tablet (520–720px) — narrower aside, single-column lists
- [ ] Card looks correct on desktop (> 720px) — two-column layout, aside on the left
- [ ] Dark mode renders correctly when OS preference is set to dark

### Focus styles
- [ ] Tab through the card — every link shows a visible focus ring
- [ ] Focus ring color is distinct and meets contrast requirements

### Epoch time
- [ ] Time value is displayed in milliseconds (13 digits as of 2024)
- [ ] Value visibly increments every second

### Avatar
- [ ] Real photo loads and is not broken (`YOUR_IMAGE_URL_HERE` has been replaced)
- [ ] Photo is not distorted — fills the circular container cleanly

### Screen reader (optional but recommended)
- [ ] Enable VoiceOver (macOS) or NVDA (Windows)
- [ ] Navigate to the card — name, bio, and role are announced
- [ ] Epoch time update is announced periodically without interrupting other content
- [ ] Social links announce their destination and "opens in new tab"
- [ ] Hobbies and Dislikes sections are announced with their heading labels

---

## Known limitations

- **Epoch time delta tolerance is 5 seconds.** On slow networks or CI environments the page may take longer to load. If the test flakes, increase the delta in the assertion.
- **Avatar broken-image test requires a real URL.** Replace `YOUR_IMAGE_URL_HERE` with your actual image URL before running — the `naturalWidth` check will fail on the placeholder string.
- **Keyboard test uses a tab-loop limit of count + 5.** If there are many focusable elements before the social links, increase this limit.
- **No visual regression tests.** Layout and color correctness are verified manually (see Manual Checks above).
- **Dark mode is not tested programmatically.** Playwright can emulate `prefers-color-scheme: dark` if needed — add `colorScheme: 'dark'` to the browser context config.

---

## Adding dark mode automated tests (optional)

To add a dark mode context to any test:

```javascript
test('dark mode renders card', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto(BASE_URL);
  await expect(page.locator('[data-testid="test-profile-card"]')).toBeVisible();
  await context.close();
});
```
