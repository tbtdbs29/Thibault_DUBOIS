const $ = (s) => document.querySelector(s);
const api = (url, o = {}) => fetch(url, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json', ...(o.headers || {}) }, ...o });
function esc(v) { return String(v || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function escAttr(obj) { return JSON.stringify(obj).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function debounce(fn, ms) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; }
function renderPager(containerId, page, pages, onPage) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (pages <= 1) { el.innerHTML = ''; return; }
  el.innerHTML = `<button type="button" class="secondary" data-action="page" data-p="${page - 1}" ${page <= 1 ? 'disabled' : ''}>‹ Précédent</button><span class="hint" style="margin:0 10px">Page ${page} / ${pages}</span><button type="button" class="secondary" data-action="page" data-p="${page + 1}" ${page >= pages ? 'disabled' : ''}>Suivant ›</button>`;
  el.querySelectorAll('[data-action="page"]').forEach((b) => { b.onclick = () => onPage(Number(b.dataset.p)); });
}

const state = {
  articles: { page: 1, search: '', status: '' },
  comments: { page: 1, search: '', status: '' },
  requests: { page: 1, search: '' },
  quotes: { page: 1, search: '' },
  invoices: { page: 1, search: '' },
  news: { page: 1, search: '', category: '', tag: '' }
};

function addLine(id, v = {}) {
  const line = document.createElement('div');
  line.className = 'line';
  line.innerHTML = `<input class="line-desc" placeholder="Ex: Chatbot personnalisé" value="${esc(v.description)}"><input class="line-qty" type="number" min=".01" step=".01" placeholder="Qté" value="${v.quantity || 1}"><input class="line-price" type="number" min="0" step=".01" placeholder="Prix HT €" value="${v.unit_price_cents ? (v.unit_price_cents / 100) : ''}"><select class="line-frequency"><option value="one_time" ${v.frequency === 'one_time' ? 'selected' : ''}>Ponctuel</option><option value="monthly" ${v.frequency === 'monthly' ? 'selected' : ''}>Mensuel</option><option value="annual" ${v.frequency === 'annual' ? 'selected' : ''}>Annuel</option></select><button type="button" data-action="remove-line">×</button>`;
  document.getElementById(id).appendChild(line);
}
function getLines(id) { return [...document.querySelectorAll('#' + id + ' .line')].map((x) => ({ description: x.querySelector('.line-desc').value, quantity: x.querySelector('.line-qty').value, unit_price: x.querySelector('.line-price').value, frequency: x.querySelector('.line-frequency').value })); }

async function load() {
  const r = await api('/api/admin/stats');
  if (!r.ok) return showLogin();
  const s = await r.json();
  $('#login').classList.add('hidden');
  $('#app').classList.remove('hidden');
  $('#total-visits').textContent = s.totalVisits;
  $('#today-visits').textContent = s.todayVisits;
  $('#article-count').textContent = s.articles;
  $('#revenue').textContent = (s.revenueCents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  const max = Math.max(1, ...s.daily.map((x) => x.visits));
  $('#chart').innerHTML = s.daily.map((x) => `<div class="bar" style="height:${Math.max(3, x.visits / max * 100)}%"><small>${x.day.slice(5)}</small></div>`).join('') || '<span class="hint">Pas encore de données</span>';
  loadArticles(); loadRequests(); loadQuotes(); loadInvoices(); loadComments(); loadMedia(); loadNews();
}
function showLogin() { $('#login').classList.remove('hidden'); $('#app').classList.add('hidden'); }
$('#login-form').onsubmit = async (e) => {
  e.preventDefault();
  const r = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: $('#password').value }) });
  if (r.ok) load(); else $('#login-status').textContent = (await r.json()).error;
};
$('#logout').onclick = async () => { await api('/api/admin/logout', { method: 'POST' }); showLogin(); };
document.querySelectorAll('.tab').forEach((b) => b.onclick = () => {
  document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach((x) => x.classList.add('hidden'));
  b.classList.add('active');
  $('#' + b.dataset.tab).classList.remove('hidden');
});

/* ---- Articles ---- */
async function loadArticles() {
  const q = new URLSearchParams({ page: state.articles.page, limit: 10 });
  if (state.articles.search) q.set('search', state.articles.search);
  if (state.articles.status) q.set('status', state.articles.status);
  const d = await (await api('/api/admin/articles?' + q)).json();
  $('#article-list').innerHTML = d.items.map((a) => `<div class="item"><div><strong>${esc(a.title)}</strong><small>${a.status} · ${a.published_at ? new Date(a.published_at).toLocaleString('fr-FR') : 'sans date'}</small></div><div><button class="secondary" data-action="edit-article" data-payload="${escAttr(a)}">Modifier</button><button class="danger" data-action="delete-article" data-id="${a.id}">Supprimer</button></div></div>`).join('') || '<span class="hint">Aucun article.</span>';
  renderPager('article-pager', d.page, d.pages, (p) => { state.articles.page = p; loadArticles(); });
}
function editArticle(a) { const f = $('#article-form'); Object.keys(a).forEach((k) => { if (f.elements[k]) f.elements[k].value = a[k] || ''; }); f.elements.id.value = a.id; }
async function deleteArticle(id) { if (confirm('Supprimer cet article ?')) { await api('/api/admin/articles/' + id, { method: 'DELETE' }); loadArticles(); load(); } }
$('#article-search').oninput = debounce(() => { state.articles.search = $('#article-search').value; state.articles.page = 1; loadArticles(); }, 300);
$('#article-status-filter').onchange = () => { state.articles.status = $('#article-status-filter').value; state.articles.page = 1; loadArticles(); };

/* ---- Comments ---- */
async function loadComments() {
  const q = new URLSearchParams({ page: state.comments.page, limit: 15 });
  if (state.comments.search) q.set('search', state.comments.search);
  if (state.comments.status) q.set('status', state.comments.status);
  const d = await (await api('/api/admin/comments?' + q)).json();
  $('#comments').innerHTML = d.items.map((c) => { const label = c.status === 'approved' ? 'Publié' : (c.status === 'rejected' ? 'Refusé' : 'En attente'); return `<div class="item comment-item"><div class="comment-body"><strong>${esc(c.author_name)}</strong><small>${esc(c.article_title)} · ${esc(c.body)}</small><span class="comment-status ${c.status}">${label}</span></div><div class="comment-actions"><button data-action="moderate" data-id="${c.id}" data-status="approved" ${c.status === 'approved' ? 'disabled' : ''}>Publié</button><button class="danger" data-action="moderate" data-id="${c.id}" data-status="rejected" ${c.status === 'rejected' ? 'disabled' : ''}>Refuser</button>${c.status === 'rejected' ? `<button class="danger" data-action="delete-comment" data-id="${c.id}">Supprimer</button>` : ''}</div></div>`; }).join('') || '<span class="hint">Aucun commentaire.</span>';
  renderPager('comments-pager', d.page, d.pages, (p) => { state.comments.page = p; loadComments(); });
}
async function moderate(id, status) { const r = await api('/api/admin/comments/' + id, { method: 'PUT', body: JSON.stringify({ status }) }); if (r.ok) loadComments(); }
async function deleteComment(id) { if (!confirm('Supprimer définitivement ce commentaire ?')) return; const r = await api('/api/admin/comments/' + id, { method: 'DELETE' }); if (r.ok) loadComments(); }
$('#comments-search').oninput = debounce(() => { state.comments.search = $('#comments-search').value; state.comments.page = 1; loadComments(); }, 300);
$('#comments-status-filter').onchange = () => { state.comments.status = $('#comments-status-filter').value; state.comments.page = 1; loadComments(); };

/* ---- Veille (actualité) ---- */
let newsFiltersReady = false;
async function loadNews() {
  const q = new URLSearchParams({ page: state.news.page, limit: 30 });
  if (state.news.search) q.set('search', state.news.search);
  if (state.news.category) q.set('category', state.news.category);
  if (state.news.tag) q.set('tag', state.news.tag);
  const d = await (await api('/api/admin/news?' + q)).json();
  if (!newsFiltersReady) {
    const catSel = $('#news-category-filter');
    d.categories.forEach((c) => { const o = document.createElement('option'); o.value = c; o.textContent = c; catSel.appendChild(o); });
    const tagSel = $('#news-tag-filter');
    d.tags.forEach((t) => { const o = document.createElement('option'); o.value = t; o.textContent = t; tagSel.appendChild(o); });
    newsFiltersReady = true;
  }
  $('#news-list').innerHTML = d.items.map((n) => `<div class="item" style="align-items:flex-start"><div style="min-width:0"><strong><a href="${esc(n.link)}" target="_blank" rel="noopener">${esc(n.title)}</a></strong><small>${esc(n.category)}${n.tags ? ' · ' + esc(n.tags).split(',').join(', ') : ''} · ${new Date(n.published_at).toLocaleString('fr-FR')}</small>${n.summary ? `<p class="hint" style="margin:6px 0 0">${esc(n.summary)}</p>` : ''}</div></div>`).join('') || '<span class="hint">Aucune actualité collectée pour le moment (le premier passage des flux peut prendre quelques minutes après le démarrage du serveur).</span>';
  renderPager('news-pager', d.page, d.pages, (p) => { state.news.page = p; loadNews(); });
}
$('#news-search').oninput = debounce(() => { state.news.search = $('#news-search').value; state.news.page = 1; loadNews(); }, 300);
$('#news-category-filter').onchange = () => { state.news.category = $('#news-category-filter').value; state.news.page = 1; loadNews(); };
$('#news-tag-filter').onchange = () => { state.news.tag = $('#news-tag-filter').value; state.news.page = 1; loadNews(); };

/* ---- Documents : demandes / devis / factures ---- */
function renderDocItem(d, quote) {
  return `<div class="item"><div><strong>${d.number}</strong><small>${esc(d.customer_name)} · ${(d.total_cents / 100).toFixed(2)} € TTC · ${d.status}</small></div><div>${quote && d.status !== 'converted' ? `<button class="secondary" data-action="edit-document" data-payload="${escAttr(d)}">Modifier</button><button data-action="convert-quote" data-id="${d.id}">Transformer en facture</button>` : ''}<button class="secondary" data-action="open-pdf" data-id="${d.id}">Voir PDF</button><button class="secondary" data-action="download-pdf" data-id="${d.id}">Télécharger</button>${!quote ? `<button data-action="request-payment" data-id="${d.id}">Demander le règlement</button>` : ''}<button class="secondary" data-action="send-document" data-id="${d.id}">Envoyer</button>${quote ? `<button class="danger" data-action="delete-document" data-id="${d.id}">Supprimer</button>` : ''}</div></div>`;
}
function renderRequestCard(d) {
  const info = d.data || {};
  return `<div class="request-card ${d.status === 'archived' ? 'archived' : ''}"><h3>${esc(info.nom || d.customer_name)}${d.status === 'archived' ? ' <span class="hint">(archivée)</span>' : ''}</h3><div class="request-meta"><span>${esc(info.email || d.customer_email)}</span>${info.telephone ? `<span>${esc(info.telephone)}</span>` : ''}<span>${new Date(d.created_at).toLocaleString('fr-FR')}</span></div><div class="request-meta"><span><strong>Projet :</strong> ${esc(info.type_projet || '—')}</span><span><strong>Budget :</strong> ${esc(info.budget_indicatif || 'À discuter')}</span><span><strong>Délai :</strong> ${esc(info.delai_souhaite || '—')}</span></div><p class="request-desc">${esc(info.description || '')}</p><div class="request-actions"><button data-action="create-quote-from-request" data-payload="${escAttr(d)}">Créer le devis</button><button class="secondary" data-action="toggle-archive-request" data-id="${d.id}" data-status="${d.status === 'archived' ? 'request' : 'archived'}">${d.status === 'archived' ? 'Réactiver' : 'Archiver'}</button><button class="danger" data-action="delete-request" data-id="${d.id}">Supprimer</button></div></div>`;
}
async function loadRequests() {
  const q = new URLSearchParams({ type: 'quote', status: 'request,archived', page: state.requests.page, limit: 10 });
  if (state.requests.search) q.set('search', state.requests.search);
  const d = await (await api('/api/admin/documents?' + q)).json();
  const items = d.items.slice().sort((a, b) => (a.status === 'archived') - (b.status === 'archived') || new Date(b.created_at) - new Date(a.created_at));
  const pendingCount = await (await api('/api/admin/documents?type=quote&status=request&limit=1')).json();
  $('#request-badge').textContent = pendingCount.total;
  $('#request-badge').classList.toggle('hidden', !pendingCount.total);
  $('#request-list').innerHTML = items.map(renderRequestCard).join('') || '<span class="hint">Aucune demande de devis reçue pour le moment.</span>';
  renderPager('request-pager', d.page, d.pages, (p) => { state.requests.page = p; loadRequests(); });
}
async function loadQuotes() {
  const q = new URLSearchParams({ type: 'quote', exclude_status: 'request,archived', page: state.quotes.page, limit: 10 });
  if (state.quotes.search) q.set('search', state.quotes.search);
  const d = await (await api('/api/admin/documents?' + q)).json();
  $('#quote-list').innerHTML = d.items.map((x) => renderDocItem(x, true)).join('') || '<span class="hint">Aucun devis.</span>';
  renderPager('quote-pager', d.page, d.pages, (p) => { state.quotes.page = p; loadQuotes(); });
}
async function loadInvoices() {
  const q = new URLSearchParams({ type: 'invoice', page: state.invoices.page, limit: 10 });
  if (state.invoices.search) q.set('search', state.invoices.search);
  const d = await (await api('/api/admin/documents?' + q)).json();
  $('#invoice-list').innerHTML = d.items.map((x) => renderDocItem(x, false)).join('') || '<span class="hint">Aucune facture.</span>';
  renderPager('invoice-pager', d.page, d.pages, (p) => { state.invoices.page = p; loadInvoices(); });
}
function refreshAllDocuments() { loadRequests(); loadQuotes(); loadInvoices(); }
$('#request-search').oninput = debounce(() => { state.requests.search = $('#request-search').value; state.requests.page = 1; loadRequests(); }, 300);
$('#quote-search').oninput = debounce(() => { state.quotes.search = $('#quote-search').value; state.quotes.page = 1; loadQuotes(); }, 300);
$('#invoice-search').oninput = debounce(() => { state.invoices.search = $('#invoice-search').value; state.invoices.page = 1; loadInvoices(); }, 300);

function createQuoteFromRequest(d) {
  const info = d.data || {};
  fillDocument($('#quote-form'), d, 'quote-lines');
  const notes = $('#quote-form').elements.notes;
  if (notes && !notes.value) notes.value = `Demande initiale : ${info.type_projet || ''} — budget ${info.budget_indicatif || 'à discuter'} — délai ${info.delai_souhaite || '—'}${info.telephone ? ` — tél. ${info.telephone}` : ''}\n\n${info.description || ''}`.trim();
  document.querySelector('[data-tab="quotes"]').click();
}
async function toggleArchiveRequest(id, status) { const r = await api('/api/admin/documents/' + id + '/status', { method: 'PUT', body: JSON.stringify({ status }) }); if (r.ok) loadRequests(); else alert((await r.json().catch(() => ({}))).error || 'Action impossible.'); }
async function deleteRequest(id) { if (confirm('Supprimer cette demande de devis ?')) { await api('/api/admin/documents/' + id, { method: 'DELETE' }); loadRequests(); } }
function openPdf(id) { window.open('/api/admin/documents/' + id + '/pdf', '_blank', 'noopener'); }
function downloadPdf(id) { const a = document.createElement('a'); a.href = '/api/admin/documents/' + id + '/pdf?download=1'; a.download = 'document-' + id + '.pdf'; a.click(); }
async function requestPayment(id) { try { const r = await api('/api/admin/documents/' + id + '/payment-request', { method: 'POST' }); const d = await r.json().catch(() => ({})); if (r.ok) { alert('Demande de règlement envoyée au client.'); refreshAllDocuments(); } else alert('Erreur : ' + (d.error || "la demande de règlement n'a pas pu être envoyée au client, réessayez.")); } catch (error) { alert("Erreur réseau : la demande de règlement n'a pas pu être envoyée, vérifiez votre connexion et réessayez."); } }
async function convertQuote(id) { const r = await api('/api/admin/documents/' + id + '/convert', { method: 'POST' }); if (!r.ok) alert((await r.json()).error); refreshAllDocuments(); }
function fillDocument(form, d, lineId) {
  form.elements.id.value = d.id;
  form.elements.customer_name.value = d.customer_name;
  form.elements.customer_email.value = d.customer_email;
  Object.entries(d.data || {}).forEach(([k, v]) => { if (form.elements[k]) form.elements[k].value = v || ''; });
  document.getElementById(lineId).innerHTML = '';
  (d.data.lines || []).forEach((line) => addLine(lineId, line));
}
function editDocument(d) { fillDocument($('#quote-form'), d, 'quote-lines'); document.querySelector('[data-tab="quotes"]').click(); }
async function saveDocument(form, type, statusId, lineId) {
  const data = Object.fromEntries(new FormData(form));
  data.type = type;
  data.lines = getLines(lineId);
  const id = data.id;
  delete data.id;
  try {
    const r = await api(id ? '/api/admin/documents/' + id : '/api/admin/documents', { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) });
    if (r.status === 401) { $(statusId).textContent = 'Session expirée. Reconnectez-vous pour enregistrer la modification.'; showLogin(); return; }
    if (!r.ok) { const err = await r.json().catch(() => ({})); $(statusId).textContent = 'Erreur : ' + (err.error || "le devis n'a pas pu être enregistré, réessayez."); return; }
    $(statusId).textContent = 'Document enregistré.';
    form.reset();
    document.getElementById(lineId).innerHTML = '';
    addLine(lineId);
    refreshAllDocuments();
  } catch (error) { $(statusId).textContent = "Erreur réseau : le devis n'a pas pu être enregistré, vérifiez votre connexion et réessayez."; }
}
$('#quote-form').onsubmit = (e) => { e.preventDefault(); saveDocument(e.target, 'quote', '#quote-status', 'quote-lines'); };
$('#invoice-form').onsubmit = (e) => { e.preventDefault(); saveDocument(e.target, 'invoice', '#invoice-status', 'invoice-lines'); };
async function deleteDocument(id) { if (confirm('Supprimer ce devis ?')) { await api('/api/admin/documents/' + id, { method: 'DELETE' }); refreshAllDocuments(); } }
async function sendDocument(id) { try { const r = await api('/api/admin/documents/' + id + '/send', { method: 'POST' }); const d = await r.json().catch(() => ({})); if (r.ok) { alert('Document envoyé.'); refreshAllDocuments(); } else alert('Erreur : ' + (d.error || "le devis n'a pas pu être envoyé au client, réessayez.")); } catch (error) { alert("Erreur réseau : le devis n'a pas pu être envoyé au client, vérifiez votre connexion et réessayez."); } }

/* ---- Articles : création/édition + médiathèque ---- */
$('#article-form').onsubmit = async (e) => {
  e.preventDefault();
  const f = e.target;
  const image = f.elements.image.files[0];
  if (image) {
    const fd = new FormData();
    fd.append('image', image);
    const u = await fetch('/api/admin/uploads', { method: 'POST', body: fd, credentials: 'same-origin' });
    if (!u.ok) { $('#article-status').textContent = 'Upload impossible'; return; }
    f.elements.cover_image.value = (await u.json()).url;
  }
  const data = Object.fromEntries(new FormData(f));
  delete data.image;
  const id = data.id;
  delete data.id;
  const r = await api(id ? '/api/admin/articles/' + id : '/api/admin/articles', { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) });
  $('#article-status').textContent = r.ok ? 'Article enregistré.' : (await r.json()).error;
  if (r.ok) { f.reset(); loadArticles(); loadMedia(); load(); }
};
async function loadMedia() {
  const list = await (await api('/api/admin/uploads')).json();
  $('#media-list').innerHTML = (Array.isArray(list) ? list : []).map((f) => `<div style="border:1px solid var(--line);border-radius:8px;overflow:hidden;background:#fff"><img src="${f.url}" alt="" style="width:100%;height:90px;object-fit:cover;display:block" loading="lazy"><div style="padding:6px;display:flex;gap:4px;justify-content:space-between"><button class="secondary" style="padding:5px 7px;font-size:.72rem" data-action="use-media" data-url="${f.url}">Utiliser</button><button class="danger" style="padding:5px 7px;font-size:.72rem" data-action="delete-media" data-name="${esc(f.name)}">Suppr.</button></div></div>`).join('') || '<span class="hint">Aucune image envoyée pour le moment.</span>';
}
function useMedia(url) { $('#article-form').elements.cover_image.value = url; $('#article-status').textContent = 'Image de couverture sélectionnée.'; }
async function deleteMedia(name) { if (!confirm("Supprimer définitivement ce fichier ? Les articles qui l'utilisent encore afficheront une image cassée.")) return; await api('/api/admin/uploads/' + encodeURIComponent(name), { method: 'DELETE' }); loadMedia(); }

/* ---- Outils : export, sauvegarde, restauration ---- */
$('#restore-form').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  if (!confirm('Cette action va REMPLACER toutes les données actuelles (articles, devis, factures, commentaires) par celles du fichier importé. Continuer ?')) return;
  const status = $('#restore-status');
  status.textContent = 'Restauration en cours...';
  try {
    const r = await fetch('/api/admin/restore', { method: 'POST', body: new FormData(form), credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { status.textContent = d.message || 'Base restaurée.'; alert((d.message || 'Base restaurée.') + '\n\nLa page va se recharger.'); location.reload(); }
    else status.textContent = 'Erreur : ' + (d.error || 'la restauration a échoué.');
  } catch (error) { status.textContent = 'Erreur réseau : la restauration a échoué.'; }
};

/* ---- Délégation d'événements : aucun onclick inline, requis par la CSP stricte du back office ---- */
const actions = {
  'add-line': (el) => addLine(el.dataset.target),
  'remove-line': (el) => el.closest('.line').remove(),
  'edit-article': (el) => editArticle(JSON.parse(el.dataset.payload)),
  'delete-article': (el) => deleteArticle(Number(el.dataset.id)),
  'moderate': (el) => moderate(Number(el.dataset.id), el.dataset.status),
  'delete-comment': (el) => deleteComment(Number(el.dataset.id)),
  'edit-document': (el) => editDocument(JSON.parse(el.dataset.payload)),
  'convert-quote': (el) => convertQuote(Number(el.dataset.id)),
  'open-pdf': (el) => openPdf(Number(el.dataset.id)),
  'download-pdf': (el) => downloadPdf(Number(el.dataset.id)),
  'request-payment': (el) => requestPayment(Number(el.dataset.id)),
  'send-document': (el) => sendDocument(Number(el.dataset.id)),
  'delete-document': (el) => deleteDocument(Number(el.dataset.id)),
  'create-quote-from-request': (el) => createQuoteFromRequest(JSON.parse(el.dataset.payload)),
  'toggle-archive-request': (el) => toggleArchiveRequest(Number(el.dataset.id), el.dataset.status),
  'delete-request': (el) => deleteRequest(Number(el.dataset.id)),
  'use-media': (el) => useMedia(el.dataset.url),
  'delete-media': (el) => deleteMedia(el.dataset.name)
};
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.action];
  if (fn) fn(el);
});

addLine('quote-lines');
addLine('invoice-lines');
load();
