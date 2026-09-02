# TITANS Lab — Hybrid (Plain HTML + Shared Partials + Data Files)

Static HTML with **no build step**, but with the tedious parts (navbar,
footer, team members, publications, news) extracted into shared files. Edit
one file, every page updates.

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

## How it works

1. Each `.html` page has **placeholder divs**:
   `<div data-include="nav"></div>` and `<div data-include="footer"></div>`,
   plus empty containers like `<div id="director-list"></div>` where team
   members should appear.
2. Small JS files (`partials/nav.js`, `partials/footer.js`, `data/*.js`)
   define **global variables** (`window.NAV_HTML`, `window.DIRECTOR`, etc.).
3. `assets/site.js` **runs on page load**, swaps in the partials, and fills
   the data placeholders.

Everything uses ordinary `<script src="…">` tags, so the whole thing works
when opened directly from disk (`file://`), or served from any static host.

## How to run

**Simplest — just open a file.** Double-click `index.html`. It opens in your
browser and everything works.

**A little cleaner — run a tiny local server.** If you have Python installed:

```
cd path/to/this/folder
python -m http.server 8000
```

Then open http://localhost:8000 in your browser. Cleaner URLs and no `file://`
quirks in the address bar.

**To publish.** Upload the whole folder to any static host (GitHub Pages,
Netlify, Cloudflare Pages, or plain shared hosting via FTP). Zero
configuration needed. It's just files.

## How to edit things

### Change the navbar
Edit `partials/nav.js`. There's a `NAV_ITEMS` array at the top —
add, remove, or rename items there. All 7 pages update on refresh.

### Change the footer
Edit `partials/footer.js`. It's just HTML inside a template string.

### Change site-wide styles
Edit `assets/style.css`.

### Add a new team member
Open the right file in `data/`:
- New PhD student → `data/phd_students.js`
- New MS/BS student → `data/students.js`
- Lab visitor → `data/visitors.js`
- Past mentee → `data/mentees_msc.js` or `data/mentees_bsc.js`

Copy an existing entry (everything between two `{ … }` blocks), paste it
below, and fill in the new person's fields. Put their photo file in
`images/teampic/` and set `"photo": "filename.jpg"`.

**Fields for a PhD/MS/BS student:**
```js
{
  "name": "Full Name",
  "photo": "photo-filename.jpg",
  "info": "PhD Student",              // or "MS Student", etc.
  "start": "Fall 2026",
  "office": "EGRA 409X",
  "email": "person@siu.edu",
  "website": "https://…",             // optional — omit if none
  "number_educ": 2,                   // how many education entries below
  "education1": "B.Sc. in …, University, 2020",
  "education2": "M.Sc. in …, University, 2022",
  "number_rec": 3,                    // how many research interests
  "interest1": "Blockchain security",
  "interest2": "Trustworthy AI",
  "interest3": "Formal methods"
}
```

### Add a new publication
Edit `data/publist.js`. Copy an existing entry and modify:

```js
{
  "title": "Paper title",
  "image": "paper-thumb.jpg",     // in images/pubpic/  — optional
  "description": "Abstract text…",
  "authors": "<b>Alvi Ataur Khalil</b> and Co-Author",
  "year": 2025,
  "link": {
    "url": "https://…",
    "display": "Venue name (2025)"
  },
  "highlight": 1,       // 1 = show in top "Group Highlights" section
  "long": 0,            // 1 = wide layout in highlights, 0 = narrow
  "published": 1        // 1 = show in "Full List", 0 = show in "Under Review"
}
```

### Add a news item
Edit `data/news.js`. Add an entry at the **top** of the array (newest
first). The most recent 4 appear on the home sidebar; all appear on
`allnews.html`.

```js
{
  "date": "December 2025",
  "headline": "Something great happened! ![image](/images/newspic/photo.jpg){:class=\"img-responsive\"}"
}
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
