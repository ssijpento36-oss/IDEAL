const targetDate = new Date(2026, 1, 14, 0, 0, 0);
const statusText = document.getElementById('statusText');

function getDurationParts(startDate, endDate) {
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();
  let hours = endDate.getHours() - startDate.getHours();
  let minutes = endDate.getMinutes() - startDate.getMinutes();
  let seconds = endDate.getSeconds() - startDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    const previousMonthLastDay = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    days += previousMonthLastDay;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

function updateCounter() {
  const now = new Date();
  const isFuture = now < targetDate;
  const startDate = isFuture ? now : targetDate;
  const endDate = isFuture ? targetDate : now;
  const parts = getDurationParts(startDate, endDate);

  document.getElementById('years').textContent = String(parts.years).padStart(2, '0');
  document.getElementById('months').textContent = String(parts.months).padStart(2, '0');
  document.getElementById('days').textContent = String(parts.days).padStart(2, '0');
  document.getElementById('hours').textContent = String(parts.hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(parts.minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(parts.seconds).padStart(2, '0');

  statusText.textContent = isFuture
    ? 'Pozostało do 14.02.2026'
    : 'Minęło od 14.02.2026';
}

updateCounter();
setInterval(updateCounter, 1000);

const photoModal = document.getElementById('photoModal');
const photoModalImg = document.getElementById('photoModalImg');
const photoModalClose = document.getElementById('photoModalClose');
const photoModalBackdrop = document.getElementById('photoModalBackdrop');

const photoModalDownload = document.getElementById('photoModalDownload');

function updateDownloadLink(src) {
  photoModalDownload.href = src;
  const fileName = src.split('/').pop();
  photoModalDownload.download = fileName || 'zdjecie';
}

function openPhotoModal(src, alt) {
  photoModalImg.src = src;
  photoModalImg.alt = alt || '';
  updateDownloadLink(src);
  photoModal.classList.add('open');
  photoModal.setAttribute('aria-hidden', 'false');
}

function closePhotoModal() {
  photoModal.classList.remove('open');
  photoModal.setAttribute('aria-hidden', 'true');
  photoModalImg.src = '';
}

function spawnHearts(event) {
  const count = 8;
  const rect = event.target.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 4;

  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement('span');
    heart.textContent = '💕';
    heart.className = 'heart-fall';
    heart.style.left = `${startX + (Math.random() - 0.5) * 80}px`;
    heart.style.top = `${startY + (Math.random() - 0.5) * 20}px`;
    heart.style.color = '#ff6f91';
    heart.style.animationDelay = `${Math.random() * 0.2}s`;
    document.body.appendChild(heart);

    heart.addEventListener('animationend', () => {
      heart.remove();
    });
  }
}

document.querySelectorAll('.photo-card img').forEach((img) => {
  img.addEventListener('click', (event) => {
    spawnHearts(event);
    openPhotoModal(img.src, img.alt);
  });
});
photoModalClose.addEventListener('click', closePhotoModal);
photoModalBackdrop.addEventListener('click', closePhotoModal);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && photoModal.classList.contains('open')) {
    closePhotoModal();
  }
});
