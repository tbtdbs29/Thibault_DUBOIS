const { sendQuoteEmail } = require('./_lib/sendQuoteEmail');

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const nom = String(body.nom || '').slice(0, 200).trim();
  const email = String(body.email || '').slice(0, 200).trim();
  const type_projet = String(body.type_projet || '').slice(0, 200).trim();
  const description = String(body.description || '').slice(0, 4000).trim();
  const budget_indicatif = String(body.budget_indicatif || '').slice(0, 100).trim();
  const telephone = String(body.telephone || '').slice(0, 40).trim();
  const delai_souhaite = String(body.delai_souhaite || '').slice(0, 100).trim();

  if (!nom || !isValidEmail(email) || !type_projet || !description) {
    res.status(400).json({ error: 'missing_or_invalid_fields' });
    return;
  }

  try {
    const result = await sendQuoteEmail({
      nom, email, type_projet, description, budget_indicatif, telephone, delai_souhaite,
      source: 'formulaire de contact'
    });
    res.status(200).json({ ok: true, sent: result.sent });
  } catch (err) {
    console.error('[send-quote] erreur inattendue:', err);
    res.status(500).json({ error: 'internal_error' });
  }
};
