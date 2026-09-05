const pageLinks = [
  ['🏠', 'Invitation', 'invite.html', 'invite'],
  ['📜', 'Program & Games', 'program.html', 'program'],
  ['🦋', 'RSVP', 'rsvp.html', 'rsvp'],
  ['📷', 'Upload Photos', 'upload.html', 'upload']
];

const currentPage = location.pathname.toLowerCase().includes('program') ? 'program' : location.pathname.toLowerCase().includes('rsvp') ? 'rsvp' : location.pathname.toLowerCase().includes('upload') ? 'upload' : 'invite';
const header = document.querySelector('.topbar');
if (header) {
  const existingAdmin = header.querySelector('#roleToggle, a[href="admin.html"]');
  header.innerHTML = `<a class="brand" href="invite.html"><span class="brand-mark">✿</span><span>Mariane's 8th Birthday</span></a><label class="nav-search"><span>🔍</span><input id="eventSearch" type="search" placeholder="Search event details..." aria-label="Search event details"></label><nav class="site-nav">${pageLinks.map(([icon, label, href, key]) => `<a class="nav-tab ${currentPage === key ? 'active' : ''}" href="${href}"><span class="nav-icon">${icon}</span><span>${label}</span></a>`).join('')}</nav><div class="nav-right">${existingAdmin && existingAdmin.id === 'roleToggle' ? '<span id="roleBadge" class="role-badge">Guest view</span><button class="icon-button" id="roleToggle" type="button" title="Switch to admin mode" aria-label="Switch to admin mode">👤</button>' : '<a class="profile-button" href="admin.html" title="Open admin view" aria-label="Open admin view">👤</a>'}</div>`;
}

const style = document.createElement('style');
style.textContent = `.topbar{height:82px;gap:22px}.nav-search{display:flex;align-items:center;gap:7px;width:230px;padding:9px 13px;background:#eef0f4;border-radius:999px;color:#687080}.nav-search input{width:100%;border:0;outline:0;background:transparent;color:var(--ink);font:inherit;font-size:11px}.site-nav{display:flex;align-items:stretch;align-self:stretch;gap:8px;margin:auto}.nav-tab{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:2px;min-width:100px;padding:7px 10px;color:#727887;text-decoration:none;font-size:10px;font-weight:700;position:relative}.nav-tab:hover,.nav-tab.active{color:#2777cf}.nav-tab.active:after{content:'';position:absolute;bottom:0;left:18px;right:18px;height:3px;background:#2777cf;border-radius:3px 3px 0 0}.nav-icon{font-size:20px;line-height:1.1}.nav-right{display:flex;align-items:center;gap:9px}.profile-button{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#eef0f4;color:#536071;text-decoration:none;font-size:18px}.nav-search.match-found{outline:2px solid #2777cf}@media(max-width:1050px){.nav-search{width:190px}.nav-tab{min-width:80px}.nav-tab span:last-child{font-size:9px}}@media(max-width:760px){.topbar{height:auto;min-height:72px;flex-wrap:wrap;padding-top:12px;padding-bottom:12px;gap:10px}.brand{font-size:12px}.nav-search{order:3;width:100%}.site-nav{order:4;width:100%;height:64px;justify-content:space-between}.nav-tab{min-width:0;flex:1}.nav-right{margin-left:auto}}`;
document.head.append(style);

const search = document.getElementById('eventSearch');
if (search) {
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll('main section, .program-sheet, .upload-card, .rsvp-panel').forEach((section) => {
      const match = !query || section.textContent.toLowerCase().includes(query);
      section.classList.toggle('search-match', Boolean(query && match));
    });
    search.classList.toggle('match-found', Boolean(query && document.querySelector('.search-match')));
  });
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') document.querySelector('.search-match')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
