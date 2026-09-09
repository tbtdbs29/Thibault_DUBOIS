function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

async function sendQuoteEmail(quote) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.SEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey || !to) {
    console.log('[send-quote] RESEND_API_KEY ou CONTACT_EMAIL manquant — email non envoyé. Demande reçue :', quote);
    return { sent: false, reason: 'not_configured' };
  }

  const html = `
    <h2>Nouvelle demande de devis</h2>
    <table cellpadding="6" style="border-collapse:collapse;">
      <tr><td><strong>Nom</strong></td><td>${escapeHtml(quote.nom)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(quote.email)}</td></tr>
      <tr><td><strong>Téléphone</strong></td><td>${escapeHtml(quote.telephone || '—')}</td></tr>
      <tr><td><strong>Type de projet</strong></td><td>${escapeHtml(quote.type_projet)}</td></tr>
      <tr><td><strong>Budget indicatif</strong></td><td>${escapeHtml(quote.budget_indicatif || 'À discuter')}</td></tr>
      <tr><td><strong>Délai souhaité</strong></td><td>${escapeHtml(quote.delai_souhaite || '—')}</td></tr>
    </table>
    <p><strong>Description du projet :</strong></p>
    <p>${escapeHtml(quote.description).replace(/\n/g, '<br>')}</p>
    <p style="color:#888; font-size:12px;">Source : ${escapeHtml(quote.source || 'formulaire de contact')}</p>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Site Thibault Dubois <' + from + '>',
      to: [to],
      reply_to: quote.email,
      subject: 'Nouvelle demande de devis — ' + (quote.type_projet || 'projet web'),
      html
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(function () { return ''; });
    console.error('[send-quote] Échec envoi Resend:', res.status, errText);
    return { sent: false, reason: 'provider_error' };
  }

  return { sent: true };
}

module.exports = { sendQuoteEmail };
