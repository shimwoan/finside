(function() {
  var page = (window.NAV_PAGE || 'index');

  var logoHref = page === 'index' ? '/' : 'index.html';
  var links = page === 'index'
    ? [
        { href: 'about.html', label: 'About Us' },
        { href: '#domains', label: 'Technology' },
        { href: '#', label: 'Product' },
        { href: '#', label: 'Company' }
      ]
    : [
        { href: 'about.html', label: 'About Us', active: true },
        { href: 'index.html#domains', label: 'Technology' },
        { href: 'index.html', label: 'Product' },
        { href: 'index.html', label: 'Company' }
      ];

  var linksHtml = links.map(function(l) {
    return '<li><a href="' + l.href + '"' + (l.active ? ' class="active"' : '') + '>' + l.label + '</a></li>';
  }).join('\n      ');

  document.write(
    '<nav>\n' +
    '  <div id="nav-inner">\n' +
    '    <a href="' + logoHref + '" class="nav-logo">FinSide</a>\n' +
    '    <ul class="nav-links">\n' +
    '      ' + linksHtml + '\n' +
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
