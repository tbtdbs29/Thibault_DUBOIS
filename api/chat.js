const Anthropic = require('@anthropic-ai/sdk');
const { sendQuoteEmail } = require('./_lib/sendQuoteEmail');

const MODEL = process.env.MODEL_NAME || 'claude-opus-5';
const EFFORT = process.env.MODEL_EFFORT || 'low';
// Les modèles "haiku" rejettent le paramètre effort (erreur 400 invalid_request_error)
const SUPPORTS_EFFORT = !/haiku/i.test(MODEL);
console.log(`[chat] module chargé — MODEL=${JSON.stringify(MODEL)} SUPPORTS_EFFORT=${SUPPORTS_EFFORT}`);
const MAX_HISTORY_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 4000;

const SYSTEM_PROMPT = `Tu es l'assistant virtuel du site de Thibault Dubois, développeur web freelance (auto-entrepreneur) basé à Hôpital-Camfrout, près de Brest, dans le Finistère (Bretagne). Thibault est aussi titulaire d'un BUT Informatique et travaille par ailleurs comme développeur salarié en entreprise.

Tes objectifs :
- Répondre aux questions des visiteurs (souvent non-techniques) sur les prestations de Thibault, en langage clair et sans jargon.
- Prestations proposées :
  1. Sites vitrines statiques (présentation, portfolio, formulaire de contact, optimisés SEO)
  2. Applications web sur-mesure : agenda et réservation en ligne, espace client (front-office), espace de gestion (back-office), authentification et comptes utilisateurs, boutique en ligne, tableaux de bord
  3. Maintenance et accompagnement d'un site existant
- Il n'existe pas de grille tarifaire fixe : le prix dépend de la complexité du projet. Toujours proposer d'établir un devis personnalisé plutôt que d'inventer un prix précis.
- Quand un visiteur souhaite un devis ou exprime un besoin concret, pose-lui les questions nécessaires une par une, avec bienveillance : son nom, son email, le type de projet souhaité, une description du besoin, et éventuellement un budget indicatif et un délai souhaité.
- Dès que tu as au minimum le nom, l'email, le type de projet et une description, appelle l'outil "envoyer_demande_devis" pour transmettre la demande à Thibault. N'invente jamais de valeur pour un champ que le visiteur n'a pas donné.
- Réponds toujours en français, de façon chaleureuse, concise (idéalement moins de 80 mots) et professionnelle. Si une question sort du cadre du site (support technique tiers, sujet sans rapport), recentre poliment la conversation.`;

const TOOLS = [
  {
    name: 'envoyer_demande_devis',
    description: "Envoie une demande de devis à Thibault une fois que le nom, l'email, le type de projet et une description du besoin ont été recueillis auprès du visiteur.",
    input_schema: {
      type: 'object',
      properties: {
        nom: { type: 'string', description: 'Nom complet du visiteur' },
        email: { type: 'string', description: 'Adresse email du visiteur' },
        telephone: { type: 'string', description: 'Numéro de téléphone, si fourni' },
        type_projet: { type: 'string', description: 'Ex : site vitrine, application avec agenda, espace client / back-office, boutique en ligne, maintenance, autre' },
        description: { type: 'string', description: 'Description du besoin exprimé par le visiteur' },
        budget_indicatif: { type: 'string', description: 'Budget indicatif mentionné, si fourni' },
        delai_souhaite: { type: 'string', description: 'Délai souhaité, si fourni' }
      },
      required: ['nom', 'email', 'type_projet', 'description']
    }
  }
];

function sanitizeHistory(rawMessages) {
  if (!Array.isArray(rawMessages)) return [];
  const trimmed = rawMessages.slice(-MAX_HISTORY_MESSAGES);
  const messages = [];
  for (const m of trimmed) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue;
    const text = String(m.content || '').slice(0, MAX_MESSAGE_LENGTH);
    if (!text.trim()) continue;
    messages.push({ role: m.role, content: text });
  }
  while (messages.length && messages[0].role !== 'user') messages.shift();
  return messages;
}

function extractText(content) {
  return content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: 'chat_not_configured' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const messages = sanitizeHistory((body || {}).messages);
  if (!messages.length) {
    res.status(400).json({ error: 'no_messages' });
    return;
  }

  const client = new Anthropic();

  try {
    const requestParams = {
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      ...(SUPPORTS_EFFORT ? { output_config: { effort: EFFORT } } : {}),
      messages
    };
    console.log(`[chat] appel Anthropic — model=${requestParams.model} output_config=${JSON.stringify(requestParams.output_config)}`);
    const response = await client.messages.create(requestParams);

    const toolUse = response.content.find((b) => b.type === 'tool_use' && b.name === 'envoyer_demande_devis');

    if (response.stop_reason === 'tool_use' && toolUse) {
      const quote = toolUse.input || {};
      let result;
      try {
        result = await sendQuoteEmail({ ...quote, source: 'chatbot' });
      } catch (err) {
        console.error('[chat] échec envoi devis:', err);
        result = { sent: false, reason: 'error' };
      }

      const followupMessages = messages.concat([
        { role: 'assistant', content: response.content },
        {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: result.sent
                ? 'La demande de devis a bien été transmise à Thibault.'
                : "La demande a été enregistrée mais l'envoi automatique n'est pas configuré ; informe le visiteur que Thibault le recontactera tout de même dès que possible."
            }
          ]
        }
      ]);

      const followup = await client.messages.create({
        model: MODEL,
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        ...(SUPPORTS_EFFORT ? { output_config: { effort: EFFORT } } : {}),
        messages: followupMessages
      });

      res.status(200).json({
        text: extractText(followup.content) || 'Votre demande de devis a bien été transmise à Thibault, il vous recontactera rapidement.',
        quote
      });
      return;
    }

    res.status(200).json({ text: extractText(response.content) || "Pouvez-vous reformuler votre question ?" });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error('[chat] erreur API Anthropic:', err.status, err.message);
    } else {
      console.error('[chat] erreur inattendue:', err);
    }
    res.status(502).json({ error: 'chat_upstream_error' });
  }
};
