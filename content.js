const PAGE_KEY = `refresh-button-position-${window.location.hostname}`;

function savePosition(button) {
  const position = {
    left: parseInt(button.style.left, 10) || 0,
    top: parseInt(button.style.top, 10) || 0
  };
  localStorage.setItem(PAGE_KEY, JSON.stringify(position));
}

function createRefreshIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.classList.add('refresh-icon');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('d', 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z');
  svg.appendChild(path);
  return svg;
}

function createRefreshButton() {
  if (document.getElementById('refresh-button')) return;

  const button = document.createElement('div');
  button.id = 'refresh-button';
  button.appendChild(createRefreshIcon());

  document.body.appendChild(button);

  try {
    const savedPosition = localStorage.getItem(PAGE_KEY);
    if (savedPosition) {
      const { left, top } = JSON.parse(savedPosition);
      button.style.left = left + 'px';
      button.style.top = top + 'px';
      button.style.right = 'auto';
    }
  } catch (e) {
    localStorage.removeItem(PAGE_KEY);
  }

  let isDragging = false;
  let hasDragged = false;
  let offsetX, offsetY;

  button.addEventListener('mousedown', function(e) {
    isDragging = true;
    hasDragged = false;
    offsetX = e.clientX - button.getBoundingClientRect().left;
    offsetY = e.clientY - button.getBoundingClientRect().top;
    button.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    hasDragged = true;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    const maxX = window.innerWidth - button.offsetWidth;
    const maxY = window.innerHeight - button.offsetHeight;

    button.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    button.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    button.style.right = 'auto';
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    button.style.cursor = 'move';
    if (hasDragged) savePosition(button);
  });

  button.addEventListener('click', function() {
    if (hasDragged) return;
    const url = new URL(window.location.href);
    url.searchParams.set('_rb', Date.now().toString(36));
    window.location.href = url.toString();
  });

  button.addEventListener('touchstart', function(e) {
    isDragging = true;
    hasDragged = false;
    const touch = e.touches[0];
    offsetX = touch.clientX - button.getBoundingClientRect().left;
    offsetY = touch.clientY - button.getBoundingClientRect().top;
  });

  document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    hasDragged = true;
    e.preventDefault();

    const touch = e.touches[0];
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;

    const maxX = window.innerWidth - button.offsetWidth;
    const maxY = window.innerHeight - button.offsetHeight;

    button.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    button.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    button.style.right = 'auto';
  });

  document.addEventListener('touchend', function() {
    isDragging = false;
    if (hasDragged) savePosition(button);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createRefreshButton);
} else {
  createRefreshButton();
}

if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && !document.getElementById('refresh-button')) {
        createRefreshButton();
        break;
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
