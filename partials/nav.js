// Shared site navigation — dark teal nav with white text.
// Edit NAV_ITEMS to add, remove, or rename menu items.

(function () {
  const NAV_ITEMS = [
  { href: "index.html",        label: "Home" },
  { href: "team.html",         label: "Team" },
  { href: "research.html",     label: "Research & Grants" },
  { href: "publications.html", label: "Publications" },
  { href: "openings.html",     label: "Openings" },
  { href: "press.html",        label: "Press" }
];

  const EXTERNAL_ITEMS = [
    { href: "https://alvi-ataur-khalil.github.io/", label: "Director's Portfolio" }
  ];

  const items = NAV_ITEMS
    .map(i => `        <li><a href="${i.href}">${i.label}</a></li>`)
    .concat(EXTERNAL_ITEMS.map(
      i => `        <li><a href="${i.href}" target="_blank" rel="noopener">${i.label} <i class="fa fa-external-link" style="font-size:0.8em; opacity:0.7;"></i></a></li>`
    ))
    .join("\n");

  window.NAV_HTML = `
<nav class="navbar navbar-titans navbar-fixed-top">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-menu">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="index.html">
        <img src="images/logopic/logo_medium.png" alt="TITANS Lab">
        <span class="brand-text">
          <span class="brand-primary">TITANS Lab</span>
          <span class="brand-sub">SIU Carbondale</span>
        </span>
      </a>
    </div>
    <div class="collapse navbar-collapse" id="nav-menu">
      <ul class="nav navbar-nav navbar-right">
${items}
      </ul>
    </div>
  </div>
</nav>`.trim();
})();