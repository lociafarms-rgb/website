class JournalLoader {
  constructor() {
    this.el = document.getElementById('journal-list');
    this.init();
  }

  async init() {
    if (!this.el) return;

    try {
      const cacheBuster = 'v=2026-03-23-1';
      const resp = await fetch(`journal.json?${cacheBuster}`, { cache: 'force-cache' });
      if (!resp.ok) throw new Error('Failed to load journal.json');
      const data = await resp.json();
      const posts = (data.posts || []).slice().sort((a,b) => (b.date || '').localeCompare(a.date || ''));
      this.render(posts);
    } catch (e) {
      this.el.innerHTML = `<div class="empty-state"><p>Could not load the journal right now.</p></div>`;
    }
  }

  render(posts) {
    if (!posts.length) {
      this.el.innerHTML = `<div class="empty-state"><p>No journal entries yet.</p></div>`;
      return;
    }

    this.el.innerHTML = '';

    posts.forEach(p => {
      const card = document.createElement('article');
      card.className = 'journal-post';

      const mediaHtml = (p.media || []).map(m => {
        if (m.type === 'video') {
          return `
            <div class="journal-media">
              <video controls preload="metadata" style="width:100%; border-radius: 12px;">
                <source src="${m.src}" type="video/mp4" />
              </video>
              ${m.caption ? `<div class="journal-caption">${this.escape(m.caption)}</div>` : ''}
            </div>
          `;
        }
        const fallbackSrc = m.src;
        const webpSrc = this.webpFromSrc(m.src);
        return `
          <div class="journal-media">
            <picture>
              <source srcset="${webpSrc}" type="image/webp" />
              <img src="${fallbackSrc}" alt="${this.escape(m.caption || p.title || 'Photo')}" loading="lazy" decoding="async" />
            </picture>
            ${m.caption ? `<div class="journal-caption">${this.escape(m.caption)}</div>` : ''}
          </div>
        `;
      }).join('');

      const bodyHtml = (p.body || []).map(par => `<p>${this.escape(par)}</p>`).join('');

      card.innerHTML = `
        <div class="journal-header">
          <div class="journal-date">${this.escape(p.date || '')}</div>
          <h2 class="journal-title">${this.escape(p.title || '')}</h2>
          ${p.summary ? `<div class="journal-summary">${this.escape(p.summary)}</div>` : ''}
        </div>
        ${mediaHtml}
        <div class="journal-body">${bodyHtml}</div>
      `;

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
}

document.addEventListener('DOMContentLoaded', () => new JournalLoader());
