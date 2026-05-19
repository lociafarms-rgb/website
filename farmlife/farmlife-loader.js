class FarmLifeFeed {
  constructor() {
    this.el = document.getElementById('farmlife-feed');
    this.init();
  }

  async init() {
    if (!this.el) return;

    try {
      const cacheBuster = 'v=2026-05-19-1';
      const resp = await fetch(`../journal/journal.json?${cacheBuster}`, { cache: 'force-cache' });
      if (!resp.ok) throw new Error('Failed to load journal feed');
      const data = await resp.json();
      const posts = (data.posts || []).slice().sort((a,b) => (b.date || '').localeCompare(a.date || ''));
      this.render(posts);
    } catch (e) {
      this.el.innerHTML = `<div class="empty-state"><p>Could not load Farm Life right now.</p></div>`;
    }
  }

  render(posts) {
    if (!posts.length) {
      this.el.innerHTML = `<div class="empty-state"><p>No posts yet.</p></div>`;
      return;
    }

    this.el.innerHTML = '';

    posts.forEach((p) => {
      const card = document.createElement('article');
      card.className = 'farmlife-post material-card';

      const mediaHtml = (p.media || []).map(m => {
        if (m.type === 'video') {
          return `
            <div class="farmlife-media">
              <video controls preload="metadata">
                <source src="${m.src}" type="video/mp4" />
              </video>
              ${m.caption ? `<div class="farmlife-caption">${this.escape(m.caption)}</div>` : ''}
            </div>
          `;
        }
        const fallbackSrc = m.src;
        const webpSrc = this.webpFromSrc(m.src);
        return `
          <div class="farmlife-media">
            <picture>
              <source srcset="${webpSrc}" type="image/webp" />
              <img src="${fallbackSrc}" alt="${this.escape(m.caption || p.title || 'Photo')}" loading="lazy" decoding="async" />
            </picture>
            ${m.caption ? `<div class="farmlife-caption">${this.escape(m.caption)}</div>` : ''}
          </div>
        `;
      }).join('');

      const bodyHtml = (p.body || []).map(par => `<p>${this.linkify(this.escape(par))}</p>`).join('');

      card.innerHTML = `
        <div class="farmlife-post__header">
          <div class="farmlife-date">${this.escape(p.date || '')}</div>
          <h2 class="farmlife-title">${this.escape(p.title || '')}</h2>
          ${p.summary ? `<div class="farmlife-summary">${this.escape(p.summary)}</div>` : ''}
        </div>

        <div class="farmlife-post__layout">
          <div class="farmlife-details" data-open="false">
            <button class="farmlife-details__toggle" type="button" aria-expanded="false">View details</button>
            <div class="farmlife-details__body">${bodyHtml}</div>
          </div>

          <div class="farmlife-mediaCol">${mediaHtml || '<div class="empty-state"><p>No media for this post yet.</p></div>'}</div>
        </div>
      `;

      const toggle = card.querySelector('.farmlife-details__toggle');
      const details = card.querySelector('.farmlife-details');
      toggle.addEventListener('click', () => {
        const open = details.getAttribute('data-open') === 'true';
        details.setAttribute('data-open', open ? 'false' : 'true');
        toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
        toggle.textContent = open ? 'View details' : 'Hide details';
      });

      this.el.appendChild(card);
    });
  }

  webpFromSrc(src) {
    if (!src) return '';
    return String(src).replace(/\.(jpe?g|png)$/i, '.webp');
  }

  escape(s) {
    if (!s) return '';
    const div = document.createElement('div');
    div.textContent = String(s);
    return div.innerHTML;
  }

  linkify(text) {
    if (!text) return '';
    const urlRe = /(https?:\/\/[^\s<]+)/g;
    return String(text).replace(urlRe, (url) => {
      const safeUrl = url.replace(/"/g, '&quot;');
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new FarmLifeFeed());
