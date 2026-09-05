const navScript=document.createElement('script');navScript.src='nav.js';document.head.append(navScript);
const galleryStyles=document.createElement('link');galleryStyles.rel='stylesheet';galleryStyles.href='gallery.css';document.head.append(galleryStyles);
const driveUploadEndpoint = '';
const picker = document.getElementById('photoUpload');
const message = document.getElementById('photoMessage');
document.querySelector('.upload-card .eyebrow').textContent = 'Share the memories';
document.querySelector('.upload-card h1').innerHTML = 'Help us make Mariane\'s<br><em>8th birthday</em> special!';
document.querySelector('.upload-card>p:not(.eyebrow)').textContent = 'Capture your favorite moments and share your photos with us. Your memories will become part of Mariane\'s special birthday album.';
const premiumStyles = document.createElement('link');premiumStyles.rel='stylesheet';premiumStyles.href='premium-upload.css';document.head.append(premiumStyles);
const finalUploadStyles=document.createElement('link');finalUploadStyles.rel='stylesheet';finalUploadStyles.href='upload-final.css';document.head.append(finalUploadStyles);
picker.multiple = true;
const premiumPicker = document.createElement('label');
premiumPicker.className = 'photo-picker';
premiumPicker.innerHTML = '📸 Upload Photos<input id="photoUpload" type="file" accept="image/jpeg,image/png,image/webp" multiple>';
picker.closest('label').replaceWith(premiumPicker);
const premiumInput = premiumPicker.querySelector('input');
const gallery = document.createElement('section');
gallery.className = 'photo-gallery';
gallery.innerHTML = '<p class="eyebrow">Memories shared by guests</p><h2>Event photo gallery</h2><p class="gallery-subtitle">Click any photo to view it in full size.</p><div id="photo-gallery" class="gallery-grid"></div>';
document.querySelector('.upload-card').after(gallery);
let galleryGrid = gallery.querySelector('#photo-gallery');
const galleryEndpoint = '';
gallery.classList.add('premium-gallery');
gallery.innerHTML = '<p class="eyebrow">Memories shared by guests</p><h2>Uploaded Photos</h2><p class="gallery-subtitle">Your selected memories will appear here. Click any photo to view it larger.</p><div id="photo-gallery" class="premium-gallery-grid"></div><button class="primary-button share-photos-button" id="sharePhotos" type="button" hidden>💗 Share My Photos</button><p id="shareMessage" class="photo-success" role="status"></p>';
galleryGrid = gallery.querySelector('#photo-gallery');
document.getElementById('sharePhotos').hidden = true;
const selectedPhotos = [];

function renderGallery(urls) {
  galleryGrid.innerHTML = urls.map((url) => `<button class="gallery-item" type="button"><img src="${url}" alt="Shared event photo"></button>`).join('');
  galleryGrid.querySelectorAll('.gallery-item').forEach((item) => item.addEventListener('click', () => window.open(item.querySelector('img').src, '_blank', 'noopener')));
}

async function loadDriveGallery() {
  const savedPhotos = JSON.parse(localStorage.getItem('butterflyUploadedPhotos') || '[]');
  if (!galleryEndpoint) {
    renderGallery([...savedPhotos.map((photo) => photo.url), 'assets/Pink and White Watercolor Butterflies Birthday Party Invitation.png', 'assets/secondary-invitation.jpg', 'assets/program-feature.jpg']);
    return;
  }
  try {
    const response = await fetch(galleryEndpoint);
    if (!response.ok) throw new Error('Gallery unavailable');
    renderGallery(await response.json());
  } catch (error) {
    galleryGrid.innerHTML = '<p class="empty-gallery">The event gallery will appear here after Drive is connected.</p>';
  }
}

loadDriveGallery();
premiumInput.addEventListener('change', async () => {
  const files = [...premiumInput.files];
  if (!files.length) return;
  files.forEach((file) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => { selectedPhotos.push({ file, url: reader.result }); renderSelectedPhotos(); });
    reader.readAsDataURL(file);
  });
  message.textContent = `${files.length} photo${files.length === 1 ? '' : 's'} selected.`;
});

function renderSelectedPhotos() {
  galleryGrid.querySelectorAll('.local-photo').forEach((item) => item.remove());
  const localMarkup = selectedPhotos.map((photo, index) => `<button class="premium-photo local-photo" type="button"><img src="${photo.url}" alt="Selected event photo"><span class="premium-photo-remove" data-index="${index}" title="Remove photo">×</span></button>`).join('');
  galleryGrid.insertAdjacentHTML('afterbegin', localMarkup);
  const localItems = [...galleryGrid.querySelectorAll('.local-photo')];
  localItems.forEach((item) => { item.addEventListener('click', (event) => { if (event.target.classList.contains('premium-photo-remove')) { selectedPhotos.splice(Number(event.target.dataset.index), 1); renderSelectedPhotos(); return; } openLightbox(item.querySelector('img').src); }); });
  document.getElementById('sharePhotos').hidden = selectedPhotos.length === 0;
}

function openLightbox(source) { const lightbox = document.createElement('div'); lightbox.className = 'lightbox'; lightbox.innerHTML = `<button class="lightbox-close" aria-label="Close">×</button><img src="${source}" alt="Full-size event photo">`; lightbox.addEventListener('click', (event) => { if (event.target === lightbox || event.target.classList.contains('lightbox-close')) lightbox.remove(); }); document.body.append(lightbox); }

document.getElementById('sharePhotos').addEventListener('click', async () => {
  const shareMessage = document.getElementById('shareMessage');
  shareMessage.textContent = 'Preparing your photos...';
  if (!driveUploadEndpoint) {
    const savedPhotos = JSON.parse(localStorage.getItem('butterflyUploadedPhotos') || '[]');
    localStorage.setItem('butterflyUploadedPhotos', JSON.stringify([...savedPhotos, ...selectedPhotos.map((photo) => ({ name: photo.file.name, url: photo.url }))]));
    shareMessage.textContent = '💖 Thank you! Your memories are ready. Connect the Drive endpoint to save them online.';
    selectedPhotos.length = 0;
    renderSelectedPhotos();
    return;
  }
  for (const photo of selectedPhotos) {
    const data = await fileToDataUrl(photo.file);
    await fetch(driveUploadEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ name: photo.file.name, mimeType: photo.file.type, data: data.split(',')[1] }) });
  }
  shareMessage.textContent = '💖 Thank you! Your memories have been added to Mariane\'s birthday album!';
});

function fileToDataUrl(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.addEventListener('load', () => resolve(reader.result)); reader.addEventListener('error', reject); reader.readAsDataURL(file); }); }

picker.addEventListener('change', async () => {
  const file = picker.files[0];
  if (!file) return;
  if (!driveUploadEndpoint) {
    message.textContent = 'Photo selected. Connect the Google Apps Script URL in upload.js to save it to Drive.';
    return;
  }
  message.textContent = 'Uploading photo...';
  const reader = new FileReader();
  reader.addEventListener('load', async () => {
    try {
      const response = await fetch(driveUploadEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ name: file.name, mimeType: file.type, data: reader.result.split(',')[1] }) });
      if (!response.ok) throw new Error('Upload failed');
      message.textContent = 'Photo uploaded to the garden album.';
    } catch (error) {
      message.textContent = 'Upload could not be completed. Please try again.';
    }
  });
  reader.readAsDataURL(file);
});
