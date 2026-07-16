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

  var aboutLink = page === 'index'
    ? { href: 'about.html', label: '회사 소개' }
    : { href: 'about.html', label: '회사 소개', active: page === 'about' };

  var aboutLi = '<li><a href="' + aboutLink.href + '"' + (aboutLink.active ? ' class="active"' : '') + '>' + aboutLink.label + '</a></li>';

  var contactLi = '<li><a href="#" id="nav-contact-trigger">문의하기</a></li>';

  document.write(
    '<nav>\n' +
    '  <div id="nav-inner">\n' +
    '    <a href="' + logoHref + '" class="nav-logo">FinSide</a>\n' +
    '    <button type="button" id="nav-toggle" aria-label="메뉴 열기" aria-expanded="false">\n' +
    '      <span></span><span></span><span></span>\n' +
    '    </button>\n' +
    '    <ul class="nav-links">\n' +
    '      ' + aboutLi + '\n' +
    '      ' + dropdownLi + '\n' +
    '      ' + contactLi + '\n' +
    '    </ul>\n' +
    '  </div>\n' +
    '  <div id="nav-scrim"></div>\n' +
    '</nav>'
  );

  document.write(
    '<div id="contact-modal-overlay">\n' +
    '  <div id="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">\n' +
    '    <button type="button" id="contact-modal-close" aria-label="닫기">&times;</button>\n' +
    '    <h2 id="contact-modal-title">문의하기</h2>\n' +
    '    <p id="contact-modal-sub">아래 내용을 남겨주시면 확인 후 연락드리겠습니다.</p>\n' +
    '    <form id="contact-form" novalidate>\n' +
    '      <div class="contact-field">\n' +
    '        <label for="contact-name">이름 <span class="req">*</span></label>\n' +
    '        <input type="text" id="contact-name" name="name" required>\n' +
    '      </div>\n' +
    '      <div class="contact-field">\n' +
    '        <label for="contact-company">회사명 <span class="opt">(선택)</span></label>\n' +
    '        <input type="text" id="contact-company" name="company">\n' +
    '      </div>\n' +
    '      <div class="contact-field">\n' +
    '        <label for="contact-contact">연락처(이메일 또는 전화) <span class="req">*</span></label>\n' +
    '        <input type="text" id="contact-contact" name="contact" required>\n' +
    '      </div>\n' +
    '      <div class="contact-field">\n' +
    '        <label for="contact-message">문의내용 <span class="req">*</span></label>\n' +
    '        <textarea id="contact-message" name="message" rows="5" required></textarea>\n' +
    '      </div>\n' +
    '      <p id="contact-form-status" role="status"></p>\n' +
    '      <button type="submit" class="btn-primary-blue" id="contact-submit">문의 보내기</button>\n' +
    '    </form>\n' +
    '  </div>\n' +
    '</div>'
  );

  var nav = document.querySelector('nav');
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  var navToggle = document.getElementById('nav-toggle');
  var navScrim = document.getElementById('nav-scrim');
  var navDropdown = document.querySelector('.nav-dropdown');
  var navDropdownTrigger = navDropdown.querySelector('a');

  function openDrawer() {
    nav.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
  }

  function closeDrawer() {
    nav.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navDropdown.classList.remove('open');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
  }

  navToggle.addEventListener('click', function() {
    if (nav.classList.contains('nav-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  navScrim.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeDrawer();
  });

  navDropdownTrigger.addEventListener('click', function(e) {
    if (window.matchMedia('(max-width: 900px)').matches) {
      e.preventDefault();
      navDropdown.classList.toggle('open');
    }
  });

  document.querySelectorAll('.nav-links a:not(.nav-dropdown > a)').forEach(function(link) {
    link.addEventListener('click', closeDrawer);
  });

  var contactTrigger = document.getElementById('nav-contact-trigger');
  var overlay = document.getElementById('contact-modal-overlay');
  var modal = document.getElementById('contact-modal');
  var closeBtn = document.getElementById('contact-modal-close');
  var form = document.getElementById('contact-form');
  var statusEl = document.getElementById('contact-form-status');

  function openModal(e) {
    if (e) e.preventDefault();
    overlay.classList.add('open');
    document.body.classList.add('modal-open');
    var nameInput = document.getElementById('contact-name');
    if (nameInput) nameInput.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  contactTrigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = document.getElementById('contact-name').value.trim();
    var contact = document.getElementById('contact-contact').value.trim();
    var message = document.getElementById('contact-message').value.trim();

    if (!name || !contact || !message) {
      statusEl.textContent = '이름, 연락처, 문의내용을 모두 입력해 주세요.';
      statusEl.className = 'error';
      return;
    }

    var payload = {
      name: name,
      company: document.getElementById('contact-company').value.trim(),
      contact: contact,
      message: message
    };
    console.log('[contact-form submission]', payload);

    statusEl.textContent = '문의가 접수되었습니다. 빠르게 연락드리겠습니다.';
    statusEl.className = 'success';
    form.reset();
    window.setTimeout(closeModal, 1200);
  });
})();
