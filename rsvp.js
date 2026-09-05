const attendeeKey = 'butterflyAttendees';
const form = document.getElementById('rsvpForm');
const list = document.getElementById('attendeeList');
const count = document.getElementById('rsvpCount');
const profile = document.createElement('img');
profile.className = 'rsvp-profile';
profile.src = 'assets/Pink and White Watercolor Butterflies Birthday Party Invitation.png';
profile.alt = 'Mariane';
document.querySelector('.rsvp-heading').prepend(profile);
document.querySelector('.rsvp-heading>p:last-of-type').textContent = 'Tell us if you can come celebrate with Mariane on September 12 at S and R Private Inland Resort.';
document.querySelector('.rsvp-heading h1').innerHTML = 'RSVP';
document.title = "RSVP | Mariane's 8th Birthday";
document.querySelector('.list-header h2').textContent = "Who's Fluttering In?";
const navigation = document.createElement('nav');
navigation.className = 'site-nav';
navigation.innerHTML = '<a class="nav-tab" href="invite.html"><span class="nav-icon">🏠</span><span>Invitation</span></a><a class="nav-tab" href="program.html"><span class="nav-icon">📜</span><span>Program &amp; Games</span></a><a class="nav-tab active" href="rsvp.html"><span class="nav-icon">🦋</span><span>RSVP</span></a><a class="nav-tab" href="upload.html"><span class="nav-icon">📷</span><span>Upload Photos</span></a>';
const topbar = document.querySelector('.topbar');
topbar.querySelector('.brand span:last-child').textContent = "Mariane's 8th Birthday";
topbar.lastElementChild.outerHTML = '<a class="profile-button" href="admin.html" title="Open admin view" aria-label="Open admin view">👤</a>';
const search = document.createElement('label');
search.className = 'nav-search';
search.innerHTML = '<span>🔍</span><input type="search" placeholder="Search event details..." aria-label="Search event details">';
topbar.insertBefore(search, topbar.lastElementChild);
topbar.insertBefore(navigation, topbar.lastElementChild);
const navigationStyles = document.createElement('style');
navigationStyles.textContent = '.nav-search{display:flex;align-items:center;gap:7px;width:230px;padding:9px 13px;background:#eef0f4;border-radius:999px;color:#687080}.nav-search input{width:100%;border:0;outline:0;background:transparent;color:var(--ink);font:inherit;font-size:11px}.site-nav{display:flex;gap:8px;align-items:stretch;align-self:stretch;margin:auto}.nav-tab{display:flex!important;flex-direction:column;justify-content:center;align-items:center;gap:2px;min-width:100px;padding:7px 10px;color:#727887!important;text-decoration:none;font-size:10px;font-weight:700;position:relative}.nav-tab.active,.nav-tab:hover{color:#2777cf!important}.nav-tab.active:after{content:"";position:absolute;bottom:0;left:18px;right:18px;height:3px;background:#2777cf;border-radius:3px 3px 0 0}.nav-icon{font-size:20px;line-height:1.1}@media(max-width:650px){.site-nav{display:none}.nav-search{width:180px}}';
document.head.append(navigationStyles);
const premiumRsvpStyles = document.createElement('link');
premiumRsvpStyles.rel = 'stylesheet';
premiumRsvpStyles.href = 'rsvp-premium.css';
document.head.append(premiumRsvpStyles);
const profileStyles = document.createElement('link');
profileStyles.rel = 'stylesheet';
profileStyles.href = 'rsvp-profile.css';
document.head.append(profileStyles);

function renderAttendees() {
  const attendees = JSON.parse(localStorage.getItem(attendeeKey) || '[]');
  const attending = attendees.filter((attendee) => attendee.attendance === 'attending');
  count.textContent = attending.reduce((total, attendee) => total + Number(attendee.count || 1), 0);
  list.innerHTML = attendees.length
    ? attendees.map((attendee) => `<div class="attendee"><div><strong>${escapeHtml(attendee.name)}</strong><small>${attendee.attendance === 'attending' ? `${attendee.count} guest${Number(attendee.count) === 1 ? '' : 's'}` : 'Sent birthday wishes'}</small></div><span class="attendee-status ${attendee.attendance === 'declined' ? 'declined' : ''}">${attendee.attendance === 'attending' ? 'Coming' : 'Not attending'}</span></div>`).join('')
    : '<p class="empty-list">Be the first butterfly to RSVP.</p>';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const attendees = JSON.parse(localStorage.getItem(attendeeKey) || '[]');
  attendees.push({ name: data.get('name'), attendance: data.get('attendance'), count: data.get('count'), note: data.get('note'), submittedAt: new Date().toISOString() });
  localStorage.setItem(attendeeKey, JSON.stringify(attendees));
  document.getElementById('formMessage').textContent = 'Thank you! Your RSVP is recorded.';
  form.reset();
  renderAttendees();
});

renderAttendees();
