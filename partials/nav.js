// Shared site navigation — dark teal nav with white text.
// Edit NAV_ITEMS to add, remove, or rename menu items.

(function () {
  const NAV_ITEMS = [
    { href: "index.html",        label: "Home" },
    {
      label: "Team & Openings",
      children: [
        { href: "team.html",     label: "Team",     icon: "fa-users" },
        { href: "openings.html", label: "Openings", icon: "fa-briefcase" }
      ]
    },
    { href: "research.html",     label: "Research & Grants" },
    { href: "publications.html", label: "Publications" },
    // { href: "equipment.html",    label: "Lab & Equipment" },
    {
      label: "News & Press",
      children: [
        { href: "allnews.html", label: "News",  icon: "fa-newspaper-o" },
        { href: "press.html",   label: "Press", icon: "fa-star" }
      ]
    }
  ];

  const EXTERNAL_ITEMS = [
    { href: "https://alvi-ataur-khalil.github.io/", label: "Director's Portfolio" }
  ];

  const navItemsHtml = NAV_ITEMS.map((item) => {
    if (item.children && item.children.length) {
      const kids = item.children.map((c) =>
        `<li><a href="${c.href}">${c.icon ? `<i class="fa ${c.icon}"></i> ` : ""}${c.label}</a></li>`
      ).join("");
      return `
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
            ${item.label} <i class="fa fa-caret-down"></i>
          </a>
          <ul class="dropdown-menu">${kids}</ul>
        </li>`;
    }
    return `<li><a href="${item.href}">${item.label}</a></li>`;
  }).join("");

  const externalItemsHtml = EXTERNAL_ITEMS.map((item) =>
    `<li class="nav-external">
       <a href="${item.href}" target="_blank" rel="noopener">
         ${item.label} <i class="fa fa-external-link"></i>
       </a>
     </li>`
  ).join("");

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
${navItemsHtml}
${externalItemsHtml}
      </ul>
    </div>
  </div>
</nav>`.trim();
})();