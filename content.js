// 创建刷新按钮
function createRefreshButton() {
  // 检查是否已存在按钮
  if (document.getElementById('refresh-button')) {
    return;
  }

  const button = document.createElement('div');
  button.id = 'refresh-button';
  button.innerHTML = `
    <svg class="refresh-icon" viewBox="0 0 24 24">
      <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  `;

  document.body.appendChild(button);

  // 恢复保存的位置
  const pageKey = `refresh-button-position-${window.location.hostname}`;
  const savedPosition = localStorage.getItem(pageKey);
  if (savedPosition) {
    const { left, top } = JSON.parse(savedPosition);
    button.style.left = left + 'px';
    button.style.top = top + 'px';
    button.style.right = 'auto';
  }

  // 拖动功能
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

    // 限制按钮在可视区域内
    const maxX = window.innerWidth - button.offsetWidth;
    const maxY = window.innerHeight - button.offsetHeight;

    button.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    button.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    button.style.right = 'auto';
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    button.style.cursor = 'move';
    
    // 保存按钮位置
    const pageKey = `refresh-button-position-${window.location.hostname}`;
    const position = {
      left: parseInt(button.style.left) || 0,
      top: parseInt(button.style.top) || 0
    };
    localStorage.setItem(pageKey, JSON.stringify(position));
  });

  // 点击刷新功能
  button.addEventListener('click', function(e) {
    if (!hasDragged) {
      // 硬刷新页面（忽略缓存）
      window.location.reload(true);
    }
  });

  // 触摸设备支持
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
    
    // 保存按钮位置
    const pageKey = `refresh-button-position-${window.location.hostname}`;
    const position = {
      left: parseInt(button.style.left) || 0,
      top: parseInt(button.style.top) || 0
    };
    localStorage.setItem(pageKey, JSON.stringify(position));
  });
}

// 页面加载完成后创建按钮
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createRefreshButton);
} else {
  createRefreshButton();
}

// 监听页面变化（单页应用）
let observer;
if (typeof MutationObserver !== 'undefined') {
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && !document.getElementById('refresh-button')) {
        createRefreshButton();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}