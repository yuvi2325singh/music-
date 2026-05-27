/**
 * UI Components Module
 * Reusable, modern UI components with smooth animations
 */

export class UIComponent {
  /**
   * Create a card component
   */
  static createCard(item, type = 'song') {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-image">
        <img 
          src="${item.image || item.image_url}" 
          alt="${item.title || item.name}" 
          loading="lazy"
        />
        <div class="card-overlay">
          ${
            type === 'song'
              ? `<button class="card-play-btn" data-id="${item.id}">▶</button>`
              : `<button class="card-action-btn" data-id="${item.id}">→</button>`
          }
        </div>
      </div>
      <div class="card-content">
        <h3 class="card-title">${item.title || item.name}</h3>
        <p class="card-subtitle">${item.artist || item.genre || 'Collection'}</p>
        ${
          type === 'song'
            ? `<div class="card-meta">
                <span class="duration">${item.duration || '--'}</span>
                <span class="plays">${(item.plays || 0).toLocaleString()} plays</span>
              </div>`
            : ''
        }
      </div>
    `;

    return card;
  }

  /**
   * Create a toast notification
   */
  static createToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${this.getIcon(type)}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close">×</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('closing');
      setTimeout(() => toast.remove(), 300);
    });

    if (duration > 0) {
      setTimeout(() => {
        toast.classList.add('closing');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return toast;
  }

  /**
   * Create a modal dialog
   */
  static createModal(options = {}) {
    const {
      title = 'Dialog',
      message = '',
      primaryLabel = 'OK',
      secondaryLabel = 'Cancel',
      onPrimary = null,
      onSecondary = null,
      showInput = false,
      inputPlaceholder = '',
    } = options;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>${message}</p>
          ${
            showInput
              ? `<input 
                   type="text" 
                   class="modal-input" 
                   placeholder="${inputPlaceholder}"
                   autocomplete="off"
                 />`
              : ''
          }
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary">${secondaryLabel}</button>
          <button class="btn btn-primary">${primaryLabel}</button>
        </div>
      </div>
    `;

    const primaryBtn = modal.querySelector('.btn-primary');
    const secondaryBtn = modal.querySelector('.btn-secondary');
    const closeBtn = modal.querySelector('.modal-close');
    const inputEl = modal.querySelector('.modal-input');

    primaryBtn?.addEventListener('click', () => {
      if (onPrimary) onPrimary(inputEl?.value || '');
      modal.remove();
    });

    secondaryBtn?.addEventListener('click', () => {
      if (onSecondary) onSecondary();
      modal.remove();
    });

    closeBtn?.addEventListener('click', () => {
      if (onSecondary) onSecondary();
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (onSecondary) onSecondary();
        modal.remove();
      }
    });

    return modal;
  }

  /**
   * Create a loading skeleton
   */
  static createSkeleton(type = 'card', count = 1) {
    const skeletons = [];

    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = `skeleton skeleton-${type}`;

      if (type === 'card') {
        skeleton.innerHTML = `
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-line skeleton-line-title"></div>
            <div class="skeleton-line skeleton-line-short"></div>
          </div>
        `;
      } else if (type === 'text') {
        skeleton.innerHTML = `
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line skeleton-line-short"></div>
        `;
      }

      skeletons.push(skeleton);
    }

    return count === 1 ? skeletons[0] : skeletons;
  }

  /**
   * Create a loading spinner
   */
  static createSpinner(size = 'medium') {
    const spinner = document.createElement('div');
    spinner.className = `spinner spinner-${size}`;
    spinner.innerHTML = '<div></div><div></div><div></div><div></div>';
    return spinner;
  }

  /**
   * Create an album grid
   */
  static createAlbumGrid(albums = []) {
    const grid = document.createElement('div');
    grid.className = 'album-grid';

    albums.forEach((album) => {
      const card = this.createCard(album, 'album');
      grid.appendChild(card);
    });

    return grid;
  }

  /**
   * Get icon by type
   */
  static getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type] || '•';
  }

  /**
   * Create a progress bar
   */
  static createProgressBar(current = 0, total = 100, animated = false) {
    const container = document.createElement('div');
    container.className = 'progress-container';

    const bar = document.createElement('div');
    bar.className = `progress-bar ${animated ? 'animated' : ''}`;
    bar.style.width = `${(current / total) * 100}%`;

    container.appendChild(bar);
    return container;
  }

  /**
   * Create a playlist item
   */
  static createPlaylistItem(playlist) {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.innerHTML = `
      <img 
        src="${playlist.cover_image_url || 'assets/images/default-playlist.jpg'}" 
        alt="${playlist.title}"
        class="playlist-thumbnail"
      />
      <div class="playlist-info">
        <h4>${playlist.title}</h4>
        <p>${playlist.total_songs || 0} songs</p>
      </div>
      <button class="playlist-menu">⋮</button>
    `;

    return item;
  }

  /**
   * Create a queue item with drag handle
   */
  static createQueueItem(song, index) {
    const item = document.createElement('div');
    item.className = 'queue-item';
    item.draggable = true;
    item.innerHTML = `
      <span class="queue-drag-handle">⋮⋮</span>
      <span class="queue-index">${index + 1}</span>
      <img src="${song.image}" alt="${song.title}" class="queue-thumbnail" />
      <div class="queue-info">
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
      </div>
      <span class="queue-duration">${song.duration}</span>
      <button class="queue-remove">×</button>
    `;

    return item;
  }

  /**
   * Create a search suggestion item
   */
  static createSearchSuggestion(item) {
    const suggestion = document.createElement('button');
    suggestion.className = 'search-suggestion';
    suggestion.innerHTML = `
      <span class="suggestion-icon">${
        item.type === 'song'
          ? '♫'
          : item.type === 'artist'
            ? '👤'
            : '💿'
      }</span>
      <span class="suggestion-text">
        <strong>${item.title}</strong>
        <span class="suggestion-subtitle">${item.subtitle}</span>
      </span>
    `;

    return suggestion;
  }
}

export default UIComponent;
