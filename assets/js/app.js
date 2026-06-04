/* ============================================================
   app.js — DelphianLogic frontend + admin CRUD
   Depends on: icons.js  (must load before this file)
   ============================================================ */

'use strict';

/* ── API ENDPOINTS ───────────────────────────────────────── */
const API = {
  tabs:   'api/tabs.php',
  slides: 'api/slides.php',
  upload: 'api/upload.php',
};

/* ── UTILITIES ───────────────────────────────────────────── */
const isMobile = () => window.innerWidth <= 768;

/** Generic JSON fetch — throws on error */
async function apiFetch(url, options = {}) {
  const res  = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/** Toast notification */
function toast(msg, type = 'ok') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = 'toast show' + (type === 'err' ? ' err' : '');
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.className = 'toast'), 3200);
}

/* ════════════════════════════════════════════════════════════
   FRONTEND SECTION — load & build
════════════════════════════════════════════════════════════ */

/**
 * Fetch all tabs+slides from API then rebuild the 3 columns.
 * Uses a loading overlay INSIDE the existing col divs so the
 * structural IDs (tabsCol / sliderCol / imgCol) always exist.
 */
async function loadSection() {
  const tabsCol   = document.getElementById('tabsCol');
  const sliderCol = document.getElementById('sliderCol');
  const imgCol    = document.getElementById('imgCol');

  // Show spinner inside col-2 while fetching
  sliderCol.innerHTML = `
    <div class="section-loading">
      <span class="spinner"></span>&nbsp;Loading…
    </div>`;
  tabsCol.innerHTML = '';
  imgCol.innerHTML  = '';

  try {
    // api/tabs.php GET with no id → returns tabs[] with nested slides[]
    const tabs = await apiFetch(API.tabs);
    buildSection(tabs);
  } catch (err) {
    sliderCol.innerHTML = `
      <div class="section-loading" style="color:rgba(255,255,255,.45);flex-direction:column;gap:8px">
        <span style="font-size:1.4rem">⚠</span>
        Could not load content<br>
        <small>${err.message}</small>
      </div>`;
  }
}

/**
 * Build all DOM for the 3 columns from the tabs data array.
 * @param {Array} tabs  — [{ id, title, icon_key, slides:[…] }, …]
 */
function buildSection(tabs) {
  const tabsCol   = document.getElementById('tabsCol');
  const sliderCol = document.getElementById('sliderCol');
  const imgCol    = document.getElementById('imgCol');

  tabsCol.innerHTML = sliderCol.innerHTML = imgCol.innerHTML = '';

  if (!tabs.length) {
    sliderCol.innerHTML = `
      <div class="section-loading" style="color:rgba(255,255,255,.4)">
        No content yet — add a tab below.
      </div>`;
    return;
  }

  tabs.forEach((tab, ti) => {
    const slides  = tab.slides || [];
    const isFirst = ti === 0;
    const iconSVG = ICONS[tab.icon_key] || ICONS.Learning;

    /* ── Tab button ──────────────────────────────── */
    const btn = document.createElement('button');
    btn.type       = 'button';
    btn.className  = 'tab-btn' + (isFirst ? ' active' : '');
    btn.dataset.ti = ti;
    btn.innerHTML  = `
      <span class="tab-icon">${iconSVG}</span>
      <span class="tab-label">${tab.title}</span>
      <span class="tab-acc-icon" id="accIcon${ti}">
        ${isFirst ? MINUS_SVG : PLUS_SVG}
      </span>`;
    tabsCol.appendChild(btn);

    /* ── Accordion body (mobile) ─────────────────── */
    const accBody     = document.createElement('div');
    accBody.className = 'acc-body' + (isFirst ? ' open' : '');
    accBody.dataset.ti = ti;

    const mobSlider     = document.createElement('div');
    mobSlider.className = 'mob-slider';

    const mobDots     = document.createElement('div');
    mobDots.className = 'mob-dots';

    /* ── Desktop slider group ────────────────────── */
    const sg     = document.createElement('div');
    sg.className = 'slider-group' + (isFirst ? ' active' : '');
    sg.dataset.ti = ti;

    const deskDots     = document.createElement('div');
    deskDots.className = 'slide-dots';

    slides.forEach((slide, si) => {
      const isF = si === 0;

      // Shared inner HTML for desktop + mobile panes
      const slideHTML = `
        ${slide.badge_text
          ? `<span class="slide-badge">${slide.badge_text}</span>`
          : ''}
        <h3 class="slide-title">${slide.title}</h3>
        <a href="${slide.learn_more_url || '#'}" class="learn-link">
          Learn More ${ARROW_SVG}
        </a>`;

      /* Desktop pane */
      const pane = document.createElement('div');
      pane.className  = 'slide-pane' + (isF ? ' active' : '');
      pane.dataset.si = si;
      pane.dataset.ti = ti;
      pane.innerHTML  = slideHTML;
      sg.appendChild(pane);

      /* Mobile pane — background image + dark overlay */
      const mobPane = document.createElement('div');
      mobPane.className  = 'mob-slide' + (isF ? ' active' : '');
      mobPane.dataset.si = si;
      mobPane.dataset.ti = ti;
      if (slide.bg_image_url)
        mobPane.style.backgroundImage = `url('${slide.bg_image_url}')`;
      mobPane.innerHTML = slideHTML;
      mobSlider.appendChild(mobPane);

      /* Col-3 image frame (desktop only) */
      const frame = document.createElement('div');
      /* Use loop index ti for data-ti (matches slider-group & dots) */
      frame.className  = 'img-frame' + (isFirst && isF ? ' active' : '');
      frame.dataset.ti = ti;   // loop index — same as slider-group
      frame.dataset.si = si;
      frame.dataset.tabId = tab.id; // real DB id for debugging
      if (slide.bg_image_url && slide.bg_image_url.trim() !== '') {
        const img = document.createElement('img');
        img.src     = slide.bg_image_url;
        img.alt     = slide.title;
        img.loading = 'lazy';
        frame.appendChild(img);
      }
      imgCol.appendChild(frame);

      /* Dots */
      deskDots.innerHTML +=
        `<button class="dot${isF ? ' active' : ''}"
                 data-ti="${ti}" data-si="${si}" data-ctx="desk"></button>`;
      mobDots.innerHTML +=
        `<button class="dot${isF ? ' active' : ''}"
                 data-ti="${ti}" data-si="${si}" data-ctx="mob"></button>`;
    });

    sg.appendChild(deskDots);
    mobSlider.appendChild(mobDots);
    accBody.appendChild(mobSlider);
    tabsCol.appendChild(accBody);
    sliderCol.appendChild(sg);
  });

  attachEvents();
}

/* ════════════════════════════════════════════════════════════
   EVENTS
════════════════════════════════════════════════════════════ */
function attachEvents() {

  /* Tab button click */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const ti = +this.dataset.ti;

      if (!isMobile()) {
        /* Desktop: switch slider group, reset to slide 0 */
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.slider-group').forEach(g => g.classList.remove('active'));
        const sg = document.querySelector(`.slider-group[data-ti="${ti}"]`);
        if (sg) { sg.classList.add('active'); setDeskSlide(sg, 0); }

        setImg(ti, 0);

      } else {
        /* Mobile: accordion toggle */
        const body   = this.nextElementSibling; // .acc-body
        const isOpen = body.classList.contains('open');

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));
        document.querySelectorAll('.tab-acc-icon').forEach(ic => ic.innerHTML = PLUS_SVG);

        if (!isOpen) {
          this.classList.add('active');
          body.classList.add('open');
          this.querySelector('.tab-acc-icon').innerHTML = MINUS_SVG;
        }
      }
    });
  });

  /* Dot click — delegated on document */
  document.addEventListener('click', function (e) {
    const dot = e.target.closest('.dot');
    if (!dot) return;

    const ti  = +dot.dataset.ti;
    const si  = +dot.dataset.si;
    const ctx =  dot.dataset.ctx;

    if (ctx === 'desk') {
      const sg = document.querySelector(`.slider-group[data-ti="${ti}"]`);
      if (sg) { setDeskSlide(sg, si); setImg(ti, si); }
    } else {
      const ab = document.querySelector(`.acc-body[data-ti="${ti}"]`);
      if (ab) setMobSlide(ab, si);
    }
  });
}

/* Activate desktop slide + dot */
function setDeskSlide(sg, si) {
  sg.querySelectorAll('.slide-pane').forEach(p => p.classList.remove('active'));
  sg.querySelector(`.slide-pane[data-si="${si}"]`)?.classList.add('active');
  sg.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  sg.querySelector(`.dot[data-si="${si}"]`)?.classList.add('active');
}

/* Activate mobile slide + dot */
function setMobSlide(ab, si) {
  ab.querySelectorAll('.mob-slide').forEach(p => p.classList.remove('active'));
  ab.querySelector(`.mob-slide[data-si="${si}"]`)?.classList.add('active');
  ab.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  ab.querySelector(`.dot[data-si="${si}"]`)?.classList.add('active');
}

/* Sync col-3 image frame */
function setImg(ti, si) {
  document.querySelectorAll('.img-frame').forEach(f => f.classList.remove('active'));
  document.querySelector(`.img-frame[data-ti="${ti}"][data-si="${si}"]`)?.classList.add('active');
}

/* ════════════════════════════════════════════════════════════
   IMAGE UPLOAD HELPER
════════════════════════════════════════════════════════════ */

/**
 * Upload a File object to api/upload.php via FormData.
 * Returns the public URL string or throws.
 */
async function uploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);

  const res  = await fetch(API.upload, { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
  return data.url;   // e.g.  "uploads/abc123.jpg"
}

/**
 * Wire up an image upload field.
 * @param {string} inputId       — <input type="file"> id
 * @param {string} urlFieldId    — <input type="text"> that receives the URL
 * @param {string} previewId     — <div> that shows the preview
 * @param {string} statusId      — <span> showing upload progress/errors
 */
function wireImageUpload(inputId, urlFieldId, previewId, statusId) {
  const fileInput = document.getElementById(inputId);
  const urlField  = document.getElementById(urlFieldId);
  const preview   = document.getElementById(previewId);
  const status    = document.getElementById(statusId);

  // Show preview when URL field already has a value (edit mode)
  urlField.addEventListener('input', () => {
    const v = urlField.value.trim();
    if (v) {
      preview.innerHTML = `<img src="${v}" alt="preview">`;
      preview.style.display = 'block';
    } else {
      preview.innerHTML = '';
      preview.style.display = 'none';
    }
  });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    status.textContent = 'Uploading…';
    status.className   = 'upload-status uploading';
    urlField.value     = '';
    preview.innerHTML  = '';
    preview.style.display = 'none';

    try {
      const url = await uploadImage(file);
      urlField.value = url;
      // Trigger input event so preview updates
      urlField.dispatchEvent(new Event('input'));
      status.textContent = '✓ Uploaded';
      status.className   = 'upload-status ok';
    } catch (err) {
      status.textContent = '✗ ' + err.message;
      status.className   = 'upload-status err';
    }

    // Clear file input so same file can be re-selected if needed
    fileInput.value = '';
  });
}

/* ════════════════════════════════════════════════════════════
   ADMIN — PANEL SWITCH
════════════════════════════════════════════════════════════ */
function switchPanel(name, btn) {
  document.querySelectorAll('.apanel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.anav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  btn.classList.add('active');
}

/* ════════════════════════════════════════════════════════════
   ADMIN — TABS CRUD
════════════════════════════════════════════════════════════ */
let _editTabId = null;

async function loadTabsTable() {
  try {
    // API returns tabs[] each with nested slides[] — we only need tab fields here
    const tabs  = await apiFetch(API.tabs);
    const tbody = document.getElementById('tabsTbody');
    if (!tabs.length) {
      tbody.innerHTML = `<tr><td colspan="4"
        style="color:rgba(255,255,255,.3);text-align:center;padding:20px">
        No tabs yet — add one below</td></tr>`;
      return;
    }
    tbody.innerHTML = tabs.map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${t.title}</td>
        <td>${t.icon_key}</td>
        <td>
          <div class="row-acts">
            <button class="btn-e"
              onclick="editTab(${t.id},'${(t.title||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'")}','${t.icon_key}',${t.sort_order})">
              Edit
            </button>
            <button class="btn-d" onclick="deleteTab(${t.id})">Delete</button>
          </div>
        </td>
      </tr>`).join('');
  } catch (err) {
    toast('Could not load tabs: ' + err.message, 'err');
  }
}

async function saveTab() {
  const title      = document.getElementById('tabTitle').value.trim();
  const icon_key   = document.getElementById('tabIconKey').value.trim() || 'Learning';
  const sort_order = parseInt(document.getElementById('tabOrder').value) || 0;

  if (!title) { toast('Title is required', 'err'); return false; }

  try {
    if (_editTabId) {
      await apiFetch(`${API.tabs}?id=${_editTabId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, icon_key, sort_order }),
      });
      toast('Tab updated!');
    } else {
      await apiFetch(API.tabs, {
        method: 'POST',
        body: JSON.stringify({ title, icon_key, sort_order }),
      });
      toast('Tab created!');
    }
    resetTabForm();
    await loadTabsTable();
    await loadSection();
  } catch (err) {
    toast(err.message, 'err');
  }
  return false;
}

function editTab(id, title, icon_key, sort_order) {
  _editTabId = id;
  document.getElementById('tabTitle').value   = title;
  document.getElementById('tabIconKey').value = icon_key;
  document.getElementById('tabOrder').value   = sort_order;
  document.getElementById('tabBtn').textContent = 'Update Tab';
  document.getElementById('tabTitle').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function deleteTab(id) {
  if (!confirm('Delete this tab and all its slides?')) return;
  try {
    await apiFetch(`${API.tabs}?id=${id}`, { method: 'DELETE' });
    toast('Tab deleted');
    await loadTabsTable();
    await loadSection();
  } catch (err) {
    toast(err.message, 'err');
  }
}

function resetTabForm() {
  _editTabId = null;
  document.getElementById('tabTitle').value   = '';
  document.getElementById('tabIconKey').value = '';
  document.getElementById('tabOrder').value   = '0';
  document.getElementById('tabBtn').textContent = 'Add Tab';
}

/* ════════════════════════════════════════════════════════════
   ADMIN — SLIDES CRUD
════════════════════════════════════════════════════════════ */
let _editSlideId = null;

async function loadSlidesTable() {
  const tabId = parseInt(document.getElementById('loadTabId').value);
  if (!tabId) { toast('Enter a Tab ID', 'err'); return; }

  const tbody = document.getElementById('slidesTbody');
  tbody.innerHTML = `<tr><td colspan="6"
    style="color:rgba(255,255,255,.3);text-align:center;padding:16px">
    Loading…</td></tr>`;

  try {
    const slides = await apiFetch(`${API.slides}?tab_id=${tabId}`);
    if (!slides.length) {
      tbody.innerHTML = `<tr><td colspan="6"
        style="color:rgba(255,255,255,.3);text-align:center;padding:20px">
        No slides found for Tab ID ${tabId}</td></tr>`;
      return;
    }
    tbody.innerHTML = slides.map(s => `
      <tr>
        <td>${s.id}</td>
        <td>${s.tab_id}</td>
        <td style="max-width:160px">${s.title}</td>
        <td>${s.badge_text || '-'}</td>
        <td>
          ${s.bg_image_url
            ? `<img src="${s.bg_image_url}" style="width:48px;height:48px;object-fit:cover;border-radius:3px;display:block;margin-bottom:4px">`
            : '<span style="opacity:.3">—</span>'}
        </td>
        <td>
          <div class="row-acts">
            <button class="btn-e" onclick="editSlide(${s.id})">Edit</button>
            <button class="btn-d" onclick="deleteSlide(${s.id})">Delete</button>
          </div>
        </td>
      </tr>`).join('');
  } catch (err) {
    toast('Could not load slides: ' + err.message, 'err');
  }
}

async function saveSlide() {
  const tab_id = parseInt(document.getElementById('sTabId').value);
  const title  = document.getElementById('sTitle').value.trim();
  if (!tab_id || !title) { toast('Tab ID & Title are required', 'err'); return false; }

  const payload = {
    tab_id,
    badge_text:     document.getElementById('sBadge').value.trim(),
    title,
    learn_more_url: document.getElementById('sUrl').value.trim() || '#',
    bg_image_url:   document.getElementById('sImg').value.trim(),
    sort_order:     parseInt(document.getElementById('sOrder').value) || 0,
  };

  try {
    if (_editSlideId) {
      await apiFetch(`${API.slides}?id=${_editSlideId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      toast('Slide updated!');
    } else {
      await apiFetch(API.slides, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast('Slide created!');
    }
    resetSlideForm();
    await loadSlidesTable();
    await loadSection();        // ← re-render frontend immediately
  } catch (err) {
    toast(err.message, 'err');
  }
  return false;
}

async function editSlide(id) {
  try {
    const s = await apiFetch(`${API.slides}?id=${id}`);
    _editSlideId = id;
    document.getElementById('sTabId').value = s.tab_id;
    document.getElementById('sBadge').value = s.badge_text   || '';
    document.getElementById('sTitle').value = s.title;
    document.getElementById('sUrl').value   = s.learn_more_url;
    document.getElementById('sImg').value   = s.bg_image_url || '';
    document.getElementById('sOrder').value = s.sort_order;
    document.getElementById('slideBtn').textContent = 'Update Slide';

    // Show existing image in preview
    const preview = document.getElementById('sImgPreview');
    const status  = document.getElementById('sImgStatus');
    if (s.bg_image_url) {
      preview.innerHTML     = `<img src="${s.bg_image_url}" alt="preview">`;
      preview.style.display = 'block';
      status.textContent    = '';
      status.className      = 'upload-status';
    } else {
      preview.innerHTML     = '';
      preview.style.display = 'none';
    }

    document.getElementById('sTabId').scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    toast('Could not load slide: ' + err.message, 'err');
  }
}

async function deleteSlide(id) {
  if (!confirm('Delete this slide?')) return;
  try {
    await apiFetch(`${API.slides}?id=${id}`, { method: 'DELETE' });
    toast('Slide deleted');
    await loadSlidesTable();
    await loadSection();
  } catch (err) {
    toast(err.message, 'err');
  }
}

function resetSlideForm() {
  _editSlideId = null;
  ['sTabId','sBadge','sTitle','sOrder'].forEach(id =>
    document.getElementById(id).value = '');
  document.getElementById('sUrl').value = '#';
  document.getElementById('sImg').value = '';
  document.getElementById('sImgPreview').innerHTML = '';
  document.getElementById('sImgPreview').style.display = 'none';
  document.getElementById('sImgStatus').textContent = '';
  document.getElementById('sImgStatus').className   = 'upload-status';
  document.getElementById('slideBtn').textContent = 'Add Slide';
}

/* ════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Wire up slide image upload field
  wireImageUpload('sImgFile', 'sImg', 'sImgPreview', 'sImgStatus');

  // Load frontend section
  loadSection();

  // Load admin tabs table
  loadTabsTable();

  // Auto-load slides for tab ID 1 so the list is visible immediately
  loadSlidesTable();
});
