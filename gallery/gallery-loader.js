class GalleryLoader {
  constructor() {
    this.el = document.getElementById('gallery-grid');
    this.init();
  }

  async init() {
    if (!this.el) return;

    try {
      const cacheBuster = 'v=2026-03-23-1';
      const resp = await fetch(`gallery.json?${cacheBuster}`, { cache: 'force-cache' });
      if (!resp.ok) throw new Error('Failed to load gallery.json');
      const data = await resp.json();
      const items = (data.items || []).slice().sort((a,b) => (b.date || '').localeCompare(a.date || ''));
      this.render(items);
    } catch (e) {
      this.el.innerHTML = `<div class="empty-state"><p>Could not load the gallery right now.</p></div>`;
    }
  }

  render(items) {
    if (!items.length) {
      this.el.innerHTML = `<div class="empty-state"><p>No photos yet.</p></div>`;
      return;
    }

    this.el.innerHTML = '';

    items.forEach(it => {
      const card = document.createElement('div');
      card.className = 'gallery-item';
      const fallbackSrc = it.src;
      const webpSrc = this.webpFromSrc(it.src);

      card.innerHTML = `
        <div class="gallery-img-wrap">
          <picture>
            <source srcset="${webpSrc}" type="image/webp" />
            <img src="${fallbackSrc}" alt="${this.escape(it.caption || '')}" loading="lazy" decoding="async" />
          </picture>
        </div>
        <div class="gallery-meta">
          <div class="gallery-caption">${this.escape(it.caption || '')}</div>
          <div class="gallery-date">${this.escape(it.date || '')}</div>
        </div>
      `;
      this.el.appendChild(card);
    });
  }

  webpFromSrc(src) {
    if (!src) return '';
    // Works even if webp doesn't exist; <picture> will fall back to <img>.
    return String(src).replace(/\.(jpe?g|png)$/i, '.webp');
  }

  escape(s) {
    if (!s) return '';
    const div = document.createElement('div');
    div.textContent = String(s);
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => new GalleryLoader());
