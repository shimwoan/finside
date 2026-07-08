(function() {
  var page = (window.NAV_PAGE || 'index');

  var logoHref = page === 'index' ? '/' : 'index.html';
  var domainsPrefix = page === 'index' ? '' : 'index.html';

  var domainLinks = [
    { key: 'domains-beauty', href: 'domains-beauty.html', label: '뷰티' },
    { key: 'domains-agriculture', href: 'domains-agriculture.html', label: '농산물' },
    { key: 'domains-bio', href: 'domains-bio.html', label: '바이오공정' },
    { key: 'domains-resource', href: 'domains-resource.html', label: '자원순환' }
  ];
  var domainsActive = domainLinks.some(function(d) { return d.key === page; });

  var domainsMenuHtml = domainLinks.map(function(d) {
    var isActive = d.key === page;
    return '<li><a href="' + d.href + '"' + (isActive ? ' class="active"' : '') + '>' + d.label + '</a></li>';
  }).join('\n            ');

  var dropdownLi =
    '<li class="nav-dropdown">\n' +
    '        <a href="' + domainsPrefix + '#domains"' + (domainsActive ? ' class="active"' : '') + '>사업 분야</a>\n' +
    '        <ul class="nav-dropdown-menu">\n' +
    '            ' + domainsMenuHtml + '\n' +
    '        </ul>\n' +
    '      </li>';

  var otherLinks = page === 'index'
    ? [
        { href: 'about.html', label: 'About Us' },
        { href: '#', label: 'Product' },
        { href: '#', label: 'Company' }
      ]
    : [
        { href: 'about.html', label: 'About Us', active: page === 'about' },
        { href: 'index.html', label: 'Product' },
        { href: 'index.html', label: 'Company' }
      ];

  var aboutLi = '<li><a href="' + otherLinks[0].href + '"' + (otherLinks[0].active ? ' class="active"' : '') + '>' + otherLinks[0].label + '</a></li>';
  var restLiHtml = otherLinks.slice(1).map(function(l) {
    return '<li><a href="' + l.href + '"' + (l.active ? ' class="active"' : '') + '>' + l.label + '</a></li>';
  }).join('\n      ');

  document.write(
    '<nav>\n' +
    '  <div id="nav-inner">\n' +
    '    <a href="' + logoHref + '" class="nav-logo">FinSide</a>\n' +
    '    <ul class="nav-links">\n' +
    '      ' + aboutLi + '\n' +
    '      ' + dropdownLi + '\n' +
    '      ' + restLiHtml + '\n' +
    '    </ul>\n' +
    '  </div>\n' +
    '</nav>'
  );

  var nav = document.querySelector('nav');
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();
