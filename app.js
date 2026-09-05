const defaultEvent = {
  title: 'Mariane',
  description: 'is turning 8',
  date: 'September 12 at 3pm Saturday',
  time: '',
  venue: 'S and R Private Inland Resort',
  address: 'Prk. 20-A Nordida, Sto. Tomas',
  color: '#ec5ca4'
};
const adminPasscode = 'mariane8';

const schedule = [
  ['3:00 – 3:15 PM', 'Guest arrival & registration', 'Welcome dance music + photo wall'],
  ['3:15 – 3:25 PM', 'Opening prayer & welcome remarks', 'A gentle start to our afternoon'],
  ['3:25 – 3:35 PM', 'Entrance of the celebrant', 'Mariane'],
  ['3:35 – 4:20 PM', 'Parlor games time!', 'Hosted by: __________________'],
  ['4:20 – 4:30 PM', 'Food time & snack break', 'Little bites for hungry butterflies'],
  ['4:30 – 4:40 PM', 'Birthday message, wish & cake cutting', 'Make a wish, Mariane!'],
  ['4:40 – 5:00 PM', 'Giveaways & thank you message', 'A little thank-you for every guest'],
  ['5:00 – 5:30 PM', 'Free play, bubbles & photo booth', 'The garden stays open for play']
];

const games = [
  ['01', 'Patintero relay', 'Cross the lines without being tagged. Two teams, two rounds, and a team prize.', '2 teams of 5–6 kids'],
  ['02', 'Pinoy Henyo', 'Guess the word on your head using YES/NO clues only. One minute per turn.', 'Pairs'],
  ['03', 'Sack race', '“Fly to the garden!” Hop to the cone and back, then tag the next teammate.', '4–5 kids per heat'],
  ['04', 'Musical chairs', 'Walk while the music plays. When it stops, sit fast. Last kid sitting wins.', 'All kids'],
  ['05', 'Bring me', 'Bring something blue, something with wings, or two girls with hair ties.', 'All kids']
];

const get = (id) => document.getElementById(id);
const adminStyles = document.createElement('link');
adminStyles.rel = 'stylesheet';
adminStyles.href = 'admin-management.css';
document.head.append(adminStyles);
const navigationStyles = document.createElement('link');
navigationStyles.rel = 'stylesheet';
navigationStyles.href = 'shared-nav.css';
document.head.append(navigationStyles);
const loadEvent = () => {
  const savedEvent = JSON.parse(localStorage.getItem('butterflyEvent') || '{}');
  if (savedEvent.title === "Mariane's Butterfly Garden Party" || savedEvent.title === "Mariane's Butterfly Garden Party - 8th Birthday" || savedEvent.title === "Mariane's 8th Birthday") savedEvent.title = defaultEvent.title;
  if (savedEvent.description === 'A sunny afternoon of fluttering fun, garden games, and birthday wishes.' || savedEvent.description === 'Join us as we celebrate this special day.') savedEvent.description = defaultEvent.description;
  if (savedEvent.date === 'September 12, Saturday') savedEvent.date = defaultEvent.date;
  if (savedEvent.venue === 'S&R Private Resort') savedEvent.venue = defaultEvent.venue;
  if (savedEvent.time === '3:00 PM – 5:30 PM') savedEvent.time = defaultEvent.time;
  if (savedEvent.color === '#ed765c') savedEvent.color = defaultEvent.color;
  return { ...defaultEvent, ...savedEvent };
};
const saveEvent = (event) => localStorage.setItem('butterflyEvent', JSON.stringify(event));

function renderEvent() {
  const event = loadEvent();
  get('eventTitle').textContent = event.title;
  get('eventDescription').textContent = event.description;
  get('eventDate').textContent = event.date;
  get('eventTime').textContent = event.time;
  get('eventVenue').textContent = event.venue;
  get('eventAddress').textContent = event.address;
  document.documentElement.style.setProperty('--coral', event.color);
  renderInviteImage();
}

function renderInviteImage() {
  const gardenArt = document.querySelector('.garden-art');
  let image = document.getElementById('invitePhoto');
  const source = 'assets/invitation.png';
  if (!image) {
    image = document.createElement('img');
    image.id = 'invitePhoto';
    image.className = 'invite-photo';
    image.alt = 'Mariane birthday invitation artwork';
    gardenArt.prepend(image);
  }
  image.src = source || '';
  image.onclick = () => window.open(source, '_blank', 'noopener');
  gardenArt.classList.toggle('has-invite-photo', Boolean(source));
}

function renderProgram() {
  const event = loadEvent();
  const currentSchedule = Array.isArray(event.schedule) ? event.schedule : schedule;
  const currentGames = Array.isArray(event.games) ? event.games : games;
  get('timeline').innerHTML = currentSchedule.map(([time, title, note]) => `<div class="timeline-item"><time class="schedule-time">${time}</time><div><strong class="schedule-title">${title}</strong><p class="schedule-description">${note}</p></div></div>`).join('');
  get('gameGrid').innerHTML = currentGames.map(([number, title, description, players]) => `<article class="game-card"><span class="game-number">GAME ${number}</span><h3>${title}</h3><p>${description}</p><small>PLAYERS · ${players}</small></article>`).join('');
}

function openAdmin() {
  get('adminPasscode').value = '';
  get('loginMessage').textContent = '';
  get('loginDialog').showModal();
}

function showAdminEditor() {
  const event = loadEvent();
  get('adminTitle').value = event.title;
  get('adminDescription').value = event.description;
  get('adminDate').value = event.date;
  get('adminTime').value = event.time;
  get('adminVenue').value = event.venue;
  get('adminAddress').value = event.address;
  get('adminColor').value = event.color;
  get('adminSchedule').value = JSON.stringify(event.schedule || schedule, null, 2);
  get('adminGames').value = JSON.stringify(event.games || games, null, 2);
  const attendees = JSON.parse(localStorage.getItem('butterflyAttendees') || '[]');
  get('adminForm').querySelector('.dialog-note').textContent = attendees.length
    ? `${attendees.length} RSVP${attendees.length === 1 ? '' : 's'} recorded: ${attendees.map((attendee) => `${attendee.name} (${attendee.attendance})`).join(', ')}`
    : 'No RSVPs yet. Guest replies will appear here.';
  renderAdminManagement();
  get('adminDialog').showModal();
}

function renderAdminManagement() {
  let panel = document.getElementById('adminManagement');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'adminManagement';
    panel.className = 'admin-management';
    get('adminForm').querySelector('.admin-fields').after(panel);
  }
  const attendees = JSON.parse(localStorage.getItem('butterflyAttendees') || '[]');
  const photos = JSON.parse(localStorage.getItem('butterflyUploadedPhotos') || '[]');
  panel.innerHTML = `<h3>Guest responses</h3><div class="admin-records">${attendees.length ? attendees.map((attendee, index) => `<div class="admin-record"><div><strong>${escapeAdmin(attendee.name)}</strong><small>${attendee.attendance === 'attending' ? `${attendee.count} guest(s) · Coming` : 'Not attending'}</small><em>${escapeAdmin(attendee.note || 'No message')}</em></div><button class="admin-delete" data-guest-index="${index}" type="button">Delete Guest</button></div>`).join('') : '<p class="admin-empty">No RSVP responses yet.</p>'}</div><h3>Uploaded photos</h3><div class="admin-photo-grid">${photos.length ? photos.map((photo, index) => `<div class="admin-photo"><img src="${photo.url}" alt="Uploaded event photo"><button class="admin-delete" data-photo-index="${index}" type="button" aria-label="Delete photo">×</button></div>`).join('') : '<p class="admin-empty">No locally saved uploads yet.</p>'}</div>`;
  panel.querySelectorAll('[data-guest-index]').forEach((button) => button.addEventListener('click', () => confirmAdminDelete('guest', Number(button.dataset.guestIndex))));
  panel.querySelectorAll('[data-photo-index]').forEach((button) => button.addEventListener('click', () => confirmAdminDelete('photo', Number(button.dataset.photoIndex))));
}

function escapeAdmin(value) { return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]); }

function confirmAdminDelete(type, index) {
  const dialog = document.createElement('dialog');
  dialog.className = 'confirm-dialog';
  const attendees = JSON.parse(localStorage.getItem('butterflyAttendees') || '[]');
  const name = type === 'guest' ? escapeAdmin(attendees[index]?.name || 'this guest') : 'this photo';
  dialog.innerHTML = `<form method="dialog"><h3>${type === 'guest' ? 'Delete Guest?' : 'Delete Photo?'}</h3><p>${type === 'guest' ? `Are you sure you want to remove ${name} from the guest list?` : 'Are you sure you want to remove this photo?'}</p><div class="confirm-actions"><button class="confirm-cancel" value="cancel">Cancel</button><button class="confirm-delete" value="confirm">Delete</button></div></form>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => { if (dialog.returnValue === 'confirm') { const key = type === 'guest' ? 'butterflyAttendees' : 'butterflyUploadedPhotos'; const records = JSON.parse(localStorage.getItem(key) || '[]'); records.splice(index, 1); localStorage.setItem(key, JSON.stringify(records)); renderAdminManagement(); } dialog.remove(); });
  dialog.showModal();
}

const imageField = document.createElement('label');
imageField.className = 'admin-image-field';
imageField.innerHTML = 'Invitation image<input id="adminImage" type="file" accept="image/png,image/jpeg,image/webp" />';
document.querySelector('.admin-fields').append(imageField);
imageField.querySelector('input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    localStorage.setItem('butterflyInviteImage', reader.result);
    renderInviteImage();
  });
  reader.readAsDataURL(file);
});

const contentFields = document.querySelector('.admin-fields');
contentFields.insertAdjacentHTML('beforeend', '<label class="admin-content-field">Program JSON<textarea id="adminSchedule" spellcheck="false"></textarea><span class="admin-note">Edit each item as [time, title, note].</span></label><label class="admin-content-field">Game cards JSON<textarea id="adminGames" spellcheck="false"></textarea><span class="admin-note">Edit each item as [number, title, description, players].</span></label>');
const dangerButton = document.createElement('button');
dangerButton.type = 'button';
dangerButton.className = 'admin-danger';
dangerButton.textContent = 'Delete saved event, image & RSVPs';
document.querySelector('.dialog-actions').before(dangerButton);
let deleteArmed = false;
dangerButton.addEventListener('click', () => {
  if (!deleteArmed) {
    deleteArmed = true;
    dangerButton.classList.add('armed');
    dangerButton.textContent = 'Click again to permanently delete';
    return;
  }
  localStorage.removeItem('butterflyEvent');
  localStorage.removeItem('butterflyInviteImage');
  localStorage.removeItem('butterflyAttendees');
  window.location.reload();
});

get('roleToggle').addEventListener('click', openAdmin);
get('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  if (get('adminPasscode').value !== adminPasscode) {
    get('loginMessage').textContent = 'That passcode is not correct.';
    return;
  }
  get('loginDialog').close();
  showAdminEditor();
});
get('adminForm').addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const updatedEvent = {
      title: get('adminTitle').value.trim() || defaultEvent.title,
      description: get('adminDescription').value.trim() || defaultEvent.description,
      date: get('adminDate').value.trim() || defaultEvent.date,
      time: get('adminTime').value.trim() || defaultEvent.time,
      venue: get('adminVenue').value.trim() || defaultEvent.venue,
      address: get('adminAddress').value.trim() || defaultEvent.address,
      color: get('adminColor').value,
      schedule: JSON.parse(get('adminSchedule').value),
      games: JSON.parse(get('adminGames').value)
    };
    if (!Array.isArray(updatedEvent.schedule) || !Array.isArray(updatedEvent.games)) throw new Error('Content must be a JSON array.');
    saveEvent(updatedEvent);
  } catch (error) {
    get('adminForm').querySelector('.dialog-note').textContent = 'Please check the Program JSON and Game cards JSON arrays before saving.';
    return;
  }
  renderEvent();
  get('adminDialog').close();
  get('roleBadge').textContent = 'Admin mode';
  get('roleToggle').title = 'Edit invitation';
});

get('rsvpForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const attendee = { name: form.get('name'), attendance: form.get('attendance'), count: form.get('count'), note: form.get('note'), submittedAt: new Date().toISOString() };
  const attendees = JSON.parse(localStorage.getItem('butterflyAttendees') || '[]');
  attendees.push(attendee);
  localStorage.setItem('butterflyAttendees', JSON.stringify(attendees));
  get('formMessage').textContent = attendee.attendance === 'attending' ? 'Thank you! Your spot in the garden is saved.' : 'Thank you for letting us know. We will send Mariane your wishes.';
  event.currentTarget.reset();
});

async function downloadSection(element, filename) {
  if (!window.html2canvas) {
    get('formMessage').textContent = 'Image tool is still loading. Please try again in a moment.';
    return;
  }
  const canvas = await window.html2canvas(element, { backgroundColor: '#fffdf5', scale: 2, useCORS: true });
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

get('downloadInvite').addEventListener('click', () => downloadSection(document.querySelector('.hero-section'), 'mariane-butterfly-invitation.png'));
get('downloadProgram').addEventListener('click', () => downloadSection(document.querySelector('.program-band'), 'mariane-party-program.png'));

renderEvent();
renderProgram();
const locationCard = document.createElement('section');
locationCard.className = 'location-card';
locationCard.innerHTML = '<span class="location-pin">📍</span><div><h2>Event Location</h2><p><strong>S and R Private Inland Resort</strong></p><p>Prk. 20-A Nordida, Sto. Tomas</p></div><a class="primary-button" href="https://maps.app.goo.gl/j7fzzky6fZZc6Q4T8" target="_blank" rel="noopener">📍 View Location on Google Maps</a>';
document.querySelector('.hero-section').after(locationCard);

if (new URLSearchParams(window.location.search).get('view') === 'invite') {
  document.body.classList.add('invite-mode');
}

if (new URLSearchParams(window.location.search).get('admin') === '1') {
  openAdmin();
}
