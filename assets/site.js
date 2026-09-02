// TITANS Lab — page renderer
// -----------------------------------------------------------------------------
// This script does three things:
//   1. Swaps <div data-include="nav"> / <div data-include="footer"> for the
//      real HTML defined in partials/nav.js and partials/footer.js.
//   2. Highlights the current page's link in the navbar.
//   3. Populates data-driven regions (identified by their id) from the globals
//      exposed by data/*.js — team members, publications, news, etc.
//
// If a placeholder isn't present on the current page, the corresponding
// renderer is a no-op, so you can drop the same script into every HTML file.

(function () {

  // ---- tiny helpers --------------------------------------------------------
  const $ = (sel) => document.querySelector(sel);

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  // Rewrite Jekyll-absolute /images/… paths to relative paths so the pages
  // work when opened as file:// or served from any subdirectory.
  const fixPaths = (s) => {
    if (!s) return "";
    return s.replace(/src=(['"])\/images\//g, "src=$1images/");
  };

  // Very small markdown shim for the ![alt](path){:class="..."} syntax used
  // inside the news headlines and for **bold**.
  const mdImg = (s) => {
    if (!s) return "";
    return s.replace(
      /!\[[^\]]*\]\(([^)]+?)\)(?:\{:?([^}]*)\})?/g,
      (_, src, attrs) => {
        const clean = src.startsWith("/") ? src.slice(1) : src;
        let attrStr = "";
        if (attrs) {
          for (const m of attrs.matchAll(/(\w+)="([^"]*)"/g)) {
            attrStr += ` ${m[1]}="${m[2]}"`;
          }
        }
        return `<img src="${clean}"${attrStr}>`;
      }
    ).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  };

  // Render up to 5 numbered fields (education1..N or interest1..N).
  const renderNumbered = (m, prefix, countKey, marginLeft) => {
    const count = m[countKey] || 0;
    if (count < 1) return "";
    const items = [];
    for (let i = 1; i <= 5 && i <= count; i++) {
      const v = m[prefix + i];
      if (v) items.push(`<li>${fixPaths(v)}</li>`);
    }
    if (!items.length) return "";
    return `<ul style="margin-left:${marginLeft}; overflow:hidden; font-size:0.8em">${items.join("")}</ul>`;
  };

  // Render numbered fields as chips instead of a <ul>.
  const renderChips = (m, prefix, countKey) => {
    const n = m[countKey] || 0;
    if (!n) return "";
    const chips = [];
    for (let i = 1; i <= n; i++) {
      const v = m[prefix + i];
      if (v) chips.push(`<span class="tag-chip">${fixPaths(v)}</span>`);
    }
    return `<div class="tag-chip-list">${chips.join("")}</div>`;
  };

  // Collaborators (dev-note: this runs at parse-time before init(), which is
  // fine — the placeholder is looked up when the block runs).
  const collabEl = $("#collab-list");
  if (collabEl && window.COLLABORATORS) {
    collabEl.innerHTML =
      `<div class="collab-grid">${window.COLLABORATORS.map((c) => `
        <a class="collab-card" href="${esc(c.website || "#")}" target="_blank" rel="noopener">
          <div class="collab-photo-frame">
            <img src="images/teampic/${esc(c.photo || "placeholder.png")}" alt="${esc(c.name || "")}">
          </div>
          <h4 class="collab-name">${esc(c.name || "")}</h4>
          <p class="collab-affil">${fixPaths(c.affiliation || "")}</p>
        </a>`).join("")}</div>`;
  }

  // ---- card templates ------------------------------------------------------
  const directorCard = (m) => {
    const website = m.website
      ? `<a class="btn-teal person-btn" href="${m.website}" target="_blank" rel="noopener"><i class="fa fa-external-link"></i> Personal Website</a>`
      : "";
    return `
  <div class="person-card person-card-director">
    <div class="person-photo-col">
      <div class="photo-frame"><img src="images/teampic/${m.photo}" alt="${esc(m.name)}"></div>
    </div>
    <div class="person-info-col">
      <h3 class="person-name">${esc(m.name)}</h3>
      <p class="person-role">${fixPaths(m.info || "")}</p>
      <div class="person-meta">
        <span><i class="fa fa-envelope"></i> <a href="mailto:${esc(m.email || "")}">${esc(m.email || "")}</a></span>
        <span><i class="fa fa-map-marker"></i> ${esc(m.office || "")}</span>
      </div>
      <p class="person-bio">${fixPaths(m.short_bio || "")}</p>
      <div class="person-actions">${website}</div>
    </div>
  </div>`;
  };

  const studentCard = (m, kind) => {
    const verb = kind === "phd" ? "Started" : "Starting";
    const startedBadge = m.start ? `<span class="person-badge">${verb} ${esc(m.start)}</span>` : "";
    const website = m.website
      ? `<a class="btn-outline-teal person-btn" href="${m.website}" target="_blank" rel="noopener"><i class="fa fa-external-link"></i> Personal Website</a>`
      : "";
    const recBlock = (m.number_rec || 0) > 0 ? `
      <p class="person-section-label">Research Areas</p>
      ${renderChips(m, "interest", "number_rec")}` : "";
    const eduBlock = (m.number_educ || 0) > 0 ? `
      <p class="person-section-label">Education</p>
      ${renderNumbered(m, "education", "number_educ", "0")}` : "";
    return `
  <div class="person-card person-card-student">
    <div class="person-photo-col">
      <div class="photo-frame"><img src="images/teampic/${m.photo}" alt="${esc(m.name)}"></div>
    </div>
    <div class="person-info-col">
      <div class="person-name-row">
        <h4 class="person-name">${esc(m.name)}</h4>
        ${startedBadge}
      </div>
      <p class="person-role">${fixPaths(m.info || "")}</p>
      <div class="person-meta">
        <span><i class="fa fa-envelope"></i> <a href="mailto:${esc(m.email || "")}">${esc(m.email || "")}</a></span>
        <span><i class="fa fa-map-marker"></i> ${esc(m.office || "")}</span>
      </div>
      ${recBlock}
      ${eduBlock}
      <div class="person-actions">${website}</div>
    </div>
  </div>`;
  };

  const menteeCard = (m) => {
    const current = m.current
      ? `<p class="mentee-current-line"><span class="person-badge mentee-current"><i class="fa fa-briefcase"></i> ${fixPaths(m.current)}</span></p>`
      : "";
    return `
  <div class="person-card person-card-mentee">
    <div class="person-photo-col">
      <div class="photo-frame photo-frame-round"><img src="images/teampic/${m.photo}" alt="${esc(m.name)}"></div>
    </div>
    <div class="person-info-col">
      <h4 class="person-name">${esc(m.name)}</h4>
      <p class="person-role">${fixPaths(m.info || "")}</p>
      ${current}
      <p class="person-bio">${fixPaths(m.short_bio || "")}</p>
    </div>
  </div>`;
  };

  // ---- run on DOMContentLoaded (or immediately if already loaded) ---------
  function init() {

    // Press page
    const pressEl = $("#press-list");
    if (pressEl && window.PRESS) {
      pressEl.innerHTML = window.PRESS.map((p) => {
        const thumb = p.thumbnail
          ? `<img src="images/presspic/${esc(p.thumbnail)}" alt="">`
          : `<div class="press-thumb-placeholder"><i class="fa fa-newspaper-o"></i></div>`;
        const tag    = p.tag    ? `<span class="press-tag">${esc(p.tag)}</span>` : "";
        const outlet = p.outlet ? `<span class="press-outlet">${esc(p.outlet)}</span>` : "";
        const dot    = p.outlet && p.date ? `<span class="press-dot">&bull;</span>` : "";
        return `
          <a class="press-card" href="${esc(p.url || "#")}" target="_blank" rel="noopener">
            <div class="press-thumb">${thumb}${tag}</div>
            <div class="press-body">
              <div class="press-meta">
                ${outlet}${dot}<span class="press-date">${esc(p.date || "")}</span>
              </div>
              <h4 class="press-title">${esc(p.title || "")}</h4>
              <span class="press-cta">Read article <i class="fa fa-arrow-right"></i></span>
            </div>
          </a>`;
      }).join("");
    }

    // Home page — recent press strip (top 3)
    const homePressEl = $("#home-press-list");
    if (homePressEl && window.PRESS) {
      homePressEl.innerHTML = window.PRESS.slice(0, 3).map((p) => {
        const thumb = p.thumbnail
          ? `<img src="images/presspic/${esc(p.thumbnail)}" alt="">`
          : `<div class="press-thumb-placeholder"><i class="fa fa-newspaper-o"></i></div>`;
        const tag    = p.tag    ? `<span class="press-tag">${esc(p.tag)}</span>` : "";
        const outlet = p.outlet ? `<span class="press-outlet">${esc(p.outlet)}</span>` : "";
        const dot    = p.outlet && p.date ? `<span class="press-dot">&bull;</span>` : "";
        return `
          <a class="press-card press-card-sq" href="${esc(p.url || "#")}" target="_blank" rel="noopener">
            <div class="press-thumb press-thumb-sq">${thumb}${tag}</div>
            <div class="press-body">
              <div class="press-meta">
                ${outlet}${dot}<span class="press-date">${esc(p.date || "")}</span>
              </div>
              <h4 class="press-title">${esc(p.title || "")}</h4>
            </div>
          </a>`;
      }).join("");
    }

    // ---- Publication / Abstract / BibTeX modals (shared shell) ------------
    window.openPubModal = function (idx) {
      const p = (window.__PUB_HIGHLIGHTS__ || [])[idx];
      if (!p) return;
      const modal = document.getElementById("pub-modal");
      if (!modal) return;

      const link = p.link || {};
      const venueHtml = link.url
        ? `<a href="${link.url}" target="_blank" rel="noopener">${(link.display || "").replace(/</g,"&lt;")} <i class="fa fa-external-link"></i></a>`
        : (link.display || "");
      const imgHtml = p.image
        ? `<div class="pub-modal-img"><img src="images/pubpic/${p.image}" alt=""></div>`
        : "";
      const news1 = p.news1 ? `<p class="pub-modal-news"><i class="fa fa-bullhorn"></i> ${p.news1}</p>` : "";
      const news2 = p.news2 ? `<p class="pub-modal-news2">${p.news2}</p>` : "";

      modal.querySelector(".pub-modal-content").innerHTML = `
        <button type="button" class="pub-modal-close" onclick="closePubModal()" aria-label="Close">&times;</button>
        <h3 class="pub-modal-title">${(p.title || "").replace(/</g,"&lt;")}</h3>
        <p class="pub-modal-authors"><em>${p.authors || ""}</em></p>
        <p class="pub-modal-venue">${venueHtml}</p>
        ${imgHtml}
        <div class="pub-modal-abstract"><p>${p.description || ""}</p></div>
        ${news1}${news2}
      `;
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    window.closePubModal = function () {
      const modal = document.getElementById("pub-modal");
      if (!modal) return;
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    // Abstract-only modal — used by per-paper Abstract buttons
    window.openAbstractModal = function (key) {
      const [kind, idxRaw] = String(key).split(":");
      const idx = parseInt(idxRaw, 10);
      const registry = kind === "patent" ? window.__PATENT_REGISTRY__ : window.__PUB_REGISTRY__;
      const p = registry && registry[idx];
      if (!p) return;
      const modal = document.getElementById("pub-modal");
      if (!modal) return;
      const text = p.abstract || p.description || "No abstract available.";
      modal.querySelector(".pub-modal-content").innerHTML = `
        <button type="button" class="pub-modal-close" onclick="closePubModal()" aria-label="Close">&times;</button>
        <h3 class="pub-modal-title">${(p.title || "").replace(/</g,"&lt;")}</h3>
        <p class="pub-modal-authors"><em>${p.authors || ""}</em></p>
        <div class="pub-modal-abstract"><p>${text}</p></div>
      `;
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    // BibTeX modal with a copy button
    window.openBibtexModal = function (key) {
      const [kind, idxRaw] = String(key).split(":");
      const idx = parseInt(idxRaw, 10);
      const registry = kind === "patent" ? window.__PATENT_REGISTRY__ : window.__PUB_REGISTRY__;
      const p = registry && registry[idx];
      if (!p || !p.bibtex) return;
      const modal = document.getElementById("pub-modal");
      if (!modal) return;
      const disp = p.bibtex.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      modal.querySelector(".pub-modal-content").innerHTML = `
        <button type="button" class="pub-modal-close" onclick="closePubModal()" aria-label="Close">&times;</button>
        <h3 class="pub-modal-title">BibTeX &mdash; ${(p.title || "").replace(/</g,"&lt;")}</h3>
        <div class="bibtex-wrap">
          <button type="button" class="bibtex-copy" onclick="copyBibtex(this)"><i class="fa fa-copy"></i> Copy</button>
          <pre class="bibtex-pre" id="bibtex-text">${disp}</pre>
        </div>
      `;
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    
    // DOI modal with a copy button
window.openDoiModal = function (key) {
  const [kind, idxRaw] = String(key).split(":");
  const idx = parseInt(idxRaw, 10);
  const registry = kind === "patent" ? window.__PATENT_REGISTRY__ : window.__PUB_REGISTRY__;
  const p = registry && registry[idx];
  if (!p || !p.doi) return;
  const modal = document.getElementById("pub-modal");
  if (!modal) return;
  const doi = p.doi;
  const doiUrl = doi.startsWith("http") ? doi : `https://doi.org/${doi}`;
  modal.querySelector(".pub-modal-content").innerHTML = `
    <button type="button" class="pub-modal-close" onclick="closePubModal()" aria-label="Close">&times;</button>
    <h3 class="pub-modal-title">DOI &mdash; ${(p.title || "").replace(/</g,"&lt;")}</h3>
    <div class="bibtex-wrap">
      <button type="button" class="bibtex-copy" onclick="copyDoi(this)"><i class="fa fa-copy"></i> Copy</button>
      <pre class="bibtex-pre" id="doi-text">${doi.replace(/</g,"&lt;")}</pre>
    </div>
    <p class="doi-link">
      <a href="${doiUrl}" target="_blank" rel="noopener">
        <i class="fa fa-external-link"></i> Open ${doiUrl.replace(/</g,"&lt;")}
      </a>
    </p>
  `;
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

window.copyDoi = function (btn) {
  const pre = document.getElementById("doi-text");
  if (!pre) return;
  const text = pre.textContent;
  const done = () => {
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-check"></i> Copied!';
    btn.classList.add("is-copied");
    setTimeout(() => { btn.innerHTML = original; btn.classList.remove("is-copied"); }, 1600);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, () => {
      const r = document.createRange(); r.selectNodeContents(pre);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      try { document.execCommand("copy"); done(); } catch (e) {}
    });
  } else {
    const r = document.createRange(); r.selectNodeContents(pre);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    try { document.execCommand("copy"); done(); } catch (e) {}
  }
};

    window.copyBibtex = function (btn) {
      const pre = document.getElementById("bibtex-text");
      if (!pre) return;
      const text = pre.textContent;
      const done = () => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa fa-check"></i> Copied!';
        btn.classList.add("is-copied");
        setTimeout(() => { btn.innerHTML = original; btn.classList.remove("is-copied"); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, () => {
          const r = document.createRange(); r.selectNodeContents(pre);
          const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
          try { document.execCommand("copy"); done(); } catch (e) {}
        });
      } else {
        const r = document.createRange(); r.selectNodeContents(pre);
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        try { document.execCommand("copy"); done(); } catch (e) {}
      }
    };

    // Close on backdrop click / Esc
    document.addEventListener("click", function (e) {
      const modal = document.getElementById("pub-modal");
      if (modal && e.target === modal) closePubModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePubModal();
    });

    // Insert navbar
    const navEl = $('[data-include="nav"]');
    if (navEl && window.NAV_HTML) {
      navEl.outerHTML = window.NAV_HTML;
      const page = (location.pathname.split("/").pop() || "index.html").split("?")[0];
      const link = document.querySelector(`nav.navbar a[href="${page}"]`);
      if (link && link.parentElement.tagName === "LI") {
        link.parentElement.classList.add("active");
      }
    }

    // Grants
    // Grants
const grantsEl = $("#grants-list");
if (grantsEl && window.GRANTS) {
  grantsEl.innerHTML = window.GRANTS.map((g) => {
    const link = g.link
      ? `<a href="${esc(g.link.url)}" target="_blank" rel="noopener"><i class="fa fa-external-link"></i> ${esc(g.link.display)}</a>`
      : "";
    let amount = "";
    if (g.amount) {
      // Resource grants (GPU hours, compute credits, etc.) get their own chip style + icon
      const isResource = g.type === "resource";
      const icon = isResource ? "fa-microchip" : "fa-dollar";
      const chipClass = isResource ? "grant-chip-resource" : "grant-chip-amount";
      amount = `<span class="grant-chip ${chipClass}"><i class="fa ${icon}"></i> ${esc(g.amount)}</span>`;
    }
    const role = g.role ? `<span class="grant-chip"><i class="fa fa-user"></i> ${esc(g.role)}</span>` : "";
    const year = g.year ? `<span class="grant-chip"><i class="fa fa-calendar"></i> ${esc(g.year)}</span>` : "";
    return `
      <div class="grant-card">
        <div class="grant-body">
          <h4 class="grant-title">${esc(g.title)}</h4>
          <p class="grant-agency">${esc(g.agency)}</p>
          <div class="grant-chips">${amount}${role}${year}</div>
          <p class="grant-desc">${fixPaths(g.description || "")}</p>
          ${link ? `<p class="grant-link">${link}</p>` : ""}
        </div>
      </div>`;
  }).join("");
}

    // Research themes
    const themesEl = $("#themes-list");
    if (themesEl && window.RESEARCH_THEMES) {
      const renderThemeImg = (img) => {
        const pos = img.position || "top";
        const style = img.width ? ` style="width:${esc(img.width)}"` : "";
        const cap = img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : "";
        return `<figure class="theme-fig theme-fig-${esc(pos)}"${style}>
                  <img src="images/researchpic/${esc(img.src)}" alt="">${cap}
                </figure>`;
      };
      themesEl.innerHTML = window.RESEARCH_THEMES.map((t) => {
        const imgs = t.images || (t.image ? [t.image] : []);
        const before = imgs.filter((i) => ["top", "left", "right"].includes(i.position || "top"));
        const after  = imgs.filter((i) => ["bottom", "full"].includes(i.position));
        const body = (t.paragraphs || []).map((p) => `<p>${fixPaths(p)}</p>`).join("");
        return `
          <article class="research-theme" id="${esc(t.id)}">
            <h3 class="theme-title">${fixPaths(t.title)}</h3>
            <div class="theme-body">
              ${before.map(renderThemeImg).join("")}
              <div class="theme-text">${body}</div>
              <div class="theme-clear"></div>
              ${after.map(renderThemeImg).join("")}
            </div>
          </article>`;
      }).join("");
    }

    // Research jump strip (built from the themes)
    const jumpEl = $("#research-jump");
    if (jumpEl && window.RESEARCH_THEMES) {
      const grantsLink = `<a href="#grants">Grants</a>`;
      const themeLinks = window.RESEARCH_THEMES
        .map((t) => `<a href="#${esc(t.id)}">${fixPaths(t.title)}</a>`).join("");
      jumpEl.innerHTML = grantsLink + themeLinks;
    }

    // Insert footer
    const footEl = $('[data-include="footer"]');
    if (footEl && window.FOOTER_HTML) footEl.outerHTML = window.FOOTER_HTML;

    // ---- data-driven regions ---------------------------------------------
    // Team page — director
    const dirEl = $("#director-list");
    if (dirEl && window.DIRECTOR) {
      dirEl.innerHTML = window.DIRECTOR.map(directorCard).join("");
    }
    // PhD students
    const phdEl = $("#phd-list");
    if (phdEl && window.PHD_STUDENTS) {
      phdEl.innerHTML = window.PHD_STUDENTS.map((m) => studentCard(m, "phd")).join("");
    }
    // MS/BS students
    const stuEl = $("#students-list");
    if (stuEl && window.STUDENTS) {
      stuEl.innerHTML = window.STUDENTS.length
        ? window.STUDENTS.map((m) => studentCard(m, "ms_bs")).join("")
        : "<p><em>No current MS/BS students listed. Check back soon!</em></p>";
    }
    // Past mentees — MSc
    const menteesMscEl = $("#mentees-msc-list");
    if (menteesMscEl && window.MENTEES_MSC) {
      menteesMscEl.innerHTML =
        `<div class="mentee-grid">${window.MENTEES_MSC.map(menteeCard).join("")}</div>`;
    }
    // Past mentees — BSc
    const menteesBscEl = $("#mentees-bsc-list");
    if (menteesBscEl && window.MENTEES_BSC) {
      menteesBscEl.innerHTML =
        `<div class="mentee-grid">${window.MENTEES_BSC.map(menteeCard).join("")}</div>`;
    }
    // Visitors
    const visitorsEl = $("#visitors-list");
    if (visitorsEl && window.VISITORS) {
      visitorsEl.innerHTML =
        `<div class="mentee-grid">${window.VISITORS.map(menteeCard).join("")}</div>`;
    }

    // News sidebar (home) — most recent 7, only shows thumbnail if explicitly set
    const newsSideEl = $("#news-sidebar-list");
    if (newsSideEl && window.NEWS) {
      newsSideEl.innerHTML = window.NEWS.slice(0, 7).map((a) => {
        const thumb = a.thumbnail
          ? `<br><img src="images/newspic/${esc(a.thumbnail)}" class="img-responsive">`
          : "";
        return `<p><i><b>${esc((a.date || "").trim())}</b></i><br>${mdImg(a.headline || "")}${thumb}</p>`;
      }).join("");
    }

    // Home page — recent publications preview (top 3 highlighted, published)
    const pubPrevEl = $("#pub-preview");
    if (pubPrevEl && window.PUBLIST) {
      pubPrevEl.innerHTML = window.PUBLIST
        .filter((p) => p.highlight === 1 && p.published === 1)
        .slice(0, 3)
        .map((p) => {
          const link = p.link || {};
          const venue = link.url
            ? `<a href="${link.url}" target="_blank" rel="noopener">${esc(link.display || "")}</a>`
            : esc(link.display || "");
          const thumb = p.image
            ? `<div class="pub-thumb"><img src="images/pubpic/${esc(p.image)}" alt=""></div>`
            : `<div class="pub-thumb pub-thumb-placeholder"><i class="fa fa-file-text-o"></i></div>`;
          return `
            <div class="col-sm-4">
              <div class="pub-card">
                ${thumb}
                <div class="pub-body">
                  <h4 class="pub-title">${esc(p.title || "")}</h4>
                  <p class="pub-venue">${venue}</p>
                </div>
              </div>
            </div>`;
        }).join("");
    }

    // All news page — grouped by year, timeline layout, per-image positions
    const allNewsEl = $("#all-news-list");
    if (allNewsEl && window.NEWS) {
      const groups = {};
      window.NEWS.forEach((item) => {
        const m = (item.date || "").match(/(\d{4})/);
        const y = m ? m[1] : "Other";
        (groups[y] = groups[y] || []).push(item);
      });
      const years = Object.keys(groups).sort((a, b) => b.localeCompare(a));

      const renderImg = (img) => {
        const pos = img.position || "top";
        const cap = img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : "";
        const style = img.width ? ` style="width:${esc(img.width)}"` : "";
        return `<figure class="news-img news-img-${esc(pos)}"${style}>
                  <img src="images/newspic/${esc(img.src)}" alt="">${cap}
                </figure>`;
      };

      const renderBody = (item) => {
        const text = item.body || item.headline || "";
        if (Array.isArray(item.images) && item.images.length) {
          const before = item.images.filter(i => ["top","left","right"].includes(i.position || "top"));
          const after  = item.images.filter(i => ["bottom","full"].includes(i.position));
          return `${before.map(renderImg).join("")}
                  <div class="news-text">${mdImg(text)}</div>
                  <div class="news-clear"></div>
                  ${after.map(renderImg).join("")}`;
        }
        return `<div class="news-text">${mdImg(text)}</div>`;
      };

      allNewsEl.innerHTML = years.map((year) => {
        const items = groups[year].map((a) => {
          const raw = (a.date || "").trim();
          const shortDate = esc(raw.replace(year, "").trim()) || esc(raw);
          return `<div class="news-item">
                    <div class="news-date">${shortDate}</div>
                    <div class="news-content">${renderBody(a)}</div>
                  </div>`;
        }).join("");
        return `<section class="news-year-group">
                  <h2 class="news-year">${year}</h2>
                  <div class="news-timeline">${items}</div>
                </section>`;
      }).join("");
    }

    // -------- Publications page --------
    if (window.PUBLIST || window.PATENTS) {

      const CATEGORY_LABELS = {
        blockchain: { label: "Blockchain Layer-2 Security",   icon: "fa-cubes" },
        llm:        { label: "Trustworthy AI &amp; LLM",      icon: "fa-check-circle" },
        privacy:    { label: "Privacy &amp; Federated Learning", icon: "fa-lock" },
        uav:        { label: "UAV Autonomy &amp; Security",   icon: "fa-plane" },
        cps:        { label: "Cyber-Physical Systems",        icon: "fa-shield" },
        other:      { label: "Other",                         icon: "fa-file-text-o" }
      };
      const CATEGORY_ORDER = ["blockchain", "llm", "privacy", "uav", "cps", "other"];

      const getYear = (p) => {
        if (p.year) return String(p.year);
        const m = (p.link && p.link.display || "").match(/(19|20)\d{2}/);
        return m ? m[0] : "";
      };
      const venueLink = (link) => {
        if (!link) return "";
        return link.url
          ? `<a href="${link.url}" target="_blank" rel="noopener">${esc(link.display || "")} <i class="fa fa-external-link"></i></a>`
          : esc(link.display || "");
      };

      // Per-paper action buttons — only render if the corresponding field exists
      const buildActions = (p, kind) => {
        const key = `${kind}:${p._id}`;
        const btns = [];
        const abs = p.abstract || p.description;
        if (abs) btns.push(
          `<button type="button" class="pub-btn pub-btn-abstract" onclick="openAbstractModal('${key}')"><i class="fa fa-file-text-o"></i> Abstract</button>`);
        if (p.pdf) btns.push(
          `<a class="pub-btn pub-btn-pdf" href="${esc(p.pdf)}" target="_blank" rel="noopener"><i class="fa fa-file-pdf-o"></i> PDF</a>`);
          const paperHref = p.paper_url || (p.link && p.link.url);
        if (p.paper_url) btns.push(
            `<a class="pub-btn pub-btn-paper" href="${esc(p.paper_url)}" target="_blank" rel="noopener"><i class="fa fa-external-link"></i> Paper</a>`);
        if (p.arxiv) btns.push(
          `<a class="pub-btn pub-btn-arxiv" href="${esc(p.arxiv)}" target="_blank" rel="noopener"><i class="fa fa-book"></i> arXiv</a>`);
        if (p.doi) btns.push(
            `<button type="button" class="pub-btn pub-btn-doi" onclick="openDoiModal('${key}')"><i class="fa fa-hashtag"></i> DOI</button>`);        
        if (p.bibtex) btns.push(
          `<button type="button" class="pub-btn pub-btn-bibtex" onclick="openBibtexModal('${key}')"><i class="fa fa-quote-right"></i> BibTeX</button>`);
        return btns.length ? `<div class="pub-actions">${btns.join("")}</div>` : "";
      };

      // Assign stable IDs so modal openers can find each paper by index
      if (window.PUBLIST) {
        window.PUBLIST.forEach((p, i) => { p._id = i; });
        window.__PUB_REGISTRY__ = window.PUBLIST;
      }
      if (window.PATENTS) {
        window.PATENTS.forEach((p, i) => { p._id = i; });
        window.__PATENT_REGISTRY__ = window.PATENTS;
      }

      // -------- Highlights (uniform grid; abstract in modal) --------
      const hlEl = $("#pub-highlights");
      if (hlEl && window.PUBLIST) {
        window.__PUB_HIGHLIGHTS__ = window.PUBLIST
          .filter((p) => p.highlight === 1 && p.published === 1);

        hlEl.innerHTML = window.__PUB_HIGHLIGHTS__.map((p, i) => {
  const thumb = p.image
    ? `<img src="images/pubpic/${esc(p.image)}" alt="">`
    : `<div class="pub-hl-placeholder"><i class="fa fa-file-text-o"></i></div>`;
  const shortTag = p.short_venue
    ? `<span class="pub-hl-tag">${esc(p.short_venue)}</span>`
    : "";
  return `
<div class="pub-hl-card">
  <div class="pub-hl-thumb">
    ${thumb}
    ${shortTag}
  </div>
  <div class="pub-hl-body">
    <h5 class="pub-hl-title">${esc(p.title || "")}</h5>
    <p class="pub-hl-venue">${venueLink(p.link)}</p>
    <div class="pub-hl-actions">
      <button type="button" class="btn-see-more" onclick="openPubModal(${i})">
        See more <i class="fa fa-arrow-right"></i>
      </button>
    </div>
  </div>
</div>`;
}).join("");
      }

      // -------- Patents (own list) --------
      const patEl = $("#patents-list");
      if (patEl && window.PATENTS) {
        patEl.innerHTML = window.PATENTS.map((p) => {
          const status = p.status ? `<span class="pub-inline-badge">${esc(p.status)}</span>` : "";
          const idLine = p.url
            ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.id || "")} <i class="fa fa-external-link"></i></a>`
            : esc(p.id || "");
          const year = p.year ? `<span class="pub-year-chip">${esc(String(p.year))}</span>` : "";
          return `
            <div class="pub-list-item">
              <h4><i class="fa fa-certificate pub-type-icon"></i> ${esc(p.title)} ${status}</h4>
              <p class="pub-authors"><em>${fixPaths(p.authors || "")}</em></p>
              <p class="pub-venue">${idLine} ${year}</p>
              ${buildActions(p, "patent")}
            </div>`;
        }).join("");
      }

// -------- Full list — grouped by year, newest first --------
const flEl = $("#pub-full-list");
if (flEl && window.PUBLIST) {
  const published = window.PUBLIST.filter((p) => p.published === 1);

  // group by year (fallback to "Other" if year is missing)
  const groups = {};
  published.forEach((p) => {
    const y = getYear(p) || "Other";
    (groups[y] = groups[y] || []).push(p);
  });

  const years = Object.keys(groups).sort((a, b) => {
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return parseInt(b, 10) - parseInt(a, 10);
  });

  flEl.innerHTML = years.map((yr) => {
    const items = groups[yr].map((p) => `
      <div class="pub-list-item">
        <h4>${esc(p.title || "")}</h4>
        <p class="pub-authors"><em>${fixPaths(p.authors || "")}</em></p>
        <p class="pub-venue">${venueLink(p.link)}</p>
        ${buildActions(p, "pub")}
      </div>`).join("");
    return `
      <div class="pub-year-group" id="year-${esc(yr)}">
        <h3 class="pub-year-heading">
          <span class="pub-year-label">${esc(yr)}</span>
          <span class="pub-year-count">${groups[yr].length} paper${groups[yr].length > 1 ? "s" : ""}</span>
        </h3>
        ${items}
      </div>`;
  }).join("");
}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();