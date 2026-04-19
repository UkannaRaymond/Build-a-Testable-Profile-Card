# Testable Profile Card

A self-contained, accessible, responsive Profile Card component built with vanilla HTML, CSS, and JavaScript. No dependencies, no build step, no framework.

---

## Live Demo

🔗 [View on Vercel](https://your-project.vercel.app)

---

## How to Run Locally

### Option 1 — Clone the repo

```bash
git clone https://github.com/UkannaRaymond/Build--Testble-Todo-Item-Card.git
cd your-profile-card-repo
```

Then open the file directly in your browser:

```
open profile-card.html        # macOS
start profile-card.html       # Windows
xdg-open profile-card.html    # Linux
```

Or serve it locally to avoid any file-protocol quirks (e.g. font loading):

```bash
npx serve .
# then visit http://localhost:3000
```

### Option 2 — Download manually

Download both files into the same folder:

- `profile-card.html`
- `profile-card.css`

Open `profile-card.html` in any modern browser. That's it.

---

## Project Structure

```
profile-card.html   — markup, semantic structure, inline script
profile-card.css    — all styles, responsive breakpoints, dark mode
README.md           — this file
```

---

## Features

| Feature                | Detail                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- |
| **Live epoch time**    | Displays `Date.now()` in milliseconds, updates every second                  |
| **Avatar**             | Rendered via `<figure>` + `<img>` with meaningful `alt` text                 |
| **Social links**       | GitHub, LinkedIn, Twitter — open in new tab with `rel="noopener noreferrer"` |
| **Hobbies & Dislikes** | Two distinct semantic lists with color-coded pill tags                       |
| **Dark mode**          | Automatic via `prefers-color-scheme: dark`, no toggle needed                 |
| **Responsive layout**  | Stacks vertically on mobile, side-by-side on tablet and desktop              |

---

## `data-testid` Reference

Every visible element carries a `data-testid` attribute for stable automated testing. The full map:

| Element                    | `data-testid`               |
| -------------------------- | --------------------------- |
| Card root (`<article>`)    | `test-profile-card`         |
| Name (`<h2>`)              | `test-user-name`            |
| Bio (`<p>`)                | `test-user-bio`             |
| Epoch time (`<time>`)      | `test-user-time`            |
| Avatar (`<img>`)           | `test-user-avatar`          |
| Social links list (`<ul>`) | `test-user-social-links`    |
| Twitter link               | `test-user-social-twitter`  |
| GitHub link                | `test-user-social-github`   |
| LinkedIn link              | `test-user-social-linkedin` |
| Hobbies list (`<ul>`)      | `test-user-hobbies`         |
| Dislikes list (`<ul>`)     | `test-user-dislikes`        |

---

## Semantic HTML Structure

```
<article>                         test-profile-card
  <aside>
    <figure>
      <img>                       test-user-avatar
    </figure>
    <nav>
      <ul>                        test-user-social-links
        <li><a>                   test-user-social-twitter
        <li><a>                   test-user-social-github
        <li><a>                   test-user-social-linkedin
    </nav>
  </aside>
  <div>
    <header>
      <h2>                        test-user-name
      <p>                         test-user-bio
    </header>
    <time>                        test-user-time
    <section>
      <ul>                        test-user-hobbies
    </section>
    <section>
      <ul>                        test-user-dislikes
    </section>
  </div>
</article>
```

---

## Accessibility

- Avatar has a descriptive `alt` attribute and an `.sr-only` `<figcaption>`
- `<time data-testid="test-user-time">` has `aria-live="polite"` and `aria-atomic="true"` so screen readers are notified when the epoch time updates
- Social `<nav>` has `aria-label="Social media links"`
- Each social link has an `aria-label` noting it opens in a new tab
- Both list sections use `aria-labelledby` pointing to their respective headings
- All interactive elements (links) are keyboard-focusable with visible `:focus-visible` outlines
- Color contrast meets WCAG AA for all text across both light and dark themes
- Decorative icons marked `aria-hidden="true"`

---

## Responsiveness

| Breakpoint               | Layout                                                                  |
| ------------------------ | ----------------------------------------------------------------------- |
| `> 720px` (desktop)      | Two-column: avatar + socials on the left, content on the right          |
| `520px – 720px` (tablet) | Narrower aside column, lists collapse to single column                  |
| `< 520px` (mobile)       | Fully stacked, aside becomes a horizontal row with compact social links |

---

## Design Decisions

**Editorial aesthetic.** Playfair Display (serif display) paired with DM Sans (clean body text) and DM Mono (timestamps) creates a typographic hierarchy that feels considered rather than generic.

**CSS-only dark mode.** Dark theme is handled entirely via `prefers-color-scheme: dark` — no JavaScript, no localStorage, no flash of the wrong theme on load.

**`data-testid` decoupled from styling.** Test hooks live on their own attributes so visual refactors never break test selectors.

**Grain texture via inline SVG.** A subtle noise layer is applied to the background using an embedded SVG data URI — no external image request needed.

**Social links in `<nav>`.** Wrapping the social list in a named `<nav>` landmark makes it discoverable by screen reader users navigating by landmarks.

---

## Browser Support

Works in all modern browsers — Chrome, Firefox, Safari, Edge. No polyfills required.

---

👤 **Author**

Ukanna Raymond | Frontend | Backend

This project is part of my portfolio, showcasing frontend skills for a fullstack role. If you have questions, feedback, or would like to collaborate, feel free to get in touch!
