# TITANS Lab 

## Structure

```
├── index.html          Home
├── team.html           Group members
├── openings.html       Open positions
├── publications.html   Highlights + patents + under-review + full list
├── research.html       Research themes
├── allnews.html        Full news archive
├── 404.html            Page not found
│
├── assets/
│   ├── style.css       ← Site-wide CSS (edit once, affects all pages)
│   └── site.js         ← Render engine (inserts partials + data)
│
├── partials/
│   ├── nav.js          ← Navbar HTML (edit once, appears on every page)
│   └── footer.js       ← Footer HTML (edit once, appears on every page)
│
├── data/               ← Data files (edit these, don't touch HTML)
│   ├── director.js     ← Lab director
│   ├── phd_students.js
│   ├── students.js     ← MS/BS students
│   ├── mentees_msc.js  ← Past MS mentees
│   ├── mentees_bsc.js  ← Past BS mentees
│   ├── visitors.js     ← Lab visitors
│   ├── news.js         ← News items (used by home sidebar + allnews)
│   └── publist.js      ← Publications
│
├── images/             All site imagery
├── favicon.ico, favicon.png
└── README.md
```

## What each page loads

| Page               | Data files loaded                                                     |
|--------------------|-----------------------------------------------------------------------|
| `index.html`       | `news.js`                                                             |
| `team.html`        | `director.js`, `phd_students.js`, `students.js`, `mentees_*.js`, `visitors.js` |
| `publications.html`| `publist.js`                                                          |
| `allnews.html`     | `news.js`                                                             |
| `openings.html`    | (none — all static content)                                           |
| `research.html`    | (none — all static content)                                           |
| `404.html`         | (none — all static content)                                           |

## Design notes

- **Bootstrap 3.3.7, Font Awesome, jQuery, Google Fonts** all load from
  CDN. If you need to work offline, download them and link locally.
- **Data files are `.js`, not `.json`**, because JSON files require
  `fetch()`, which browsers block on `file://` (CORS). Using `<script src>`
  works everywhere. The trade-off is a tiny wrapper: each data file is just
  `window.NAME = [ … ];` around your data.
- **The rendering runs on the client** — if a user has JavaScript disabled,
  they'll see the raw placeholders. For a research group site, that's fine.
  If it matters, use the Jekyll version instead, which pre-renders on the
  server.
