(function () {
  'use strict';

  var launcher = document.querySelector('[data-chat-launcher]');
  var win = document.querySelector('[data-chat-window]');
  var body = document.querySelector('[data-chat-body]');
  var form = document.querySelector('[data-chat-form]');
  var input = document.querySelector('[data-chat-input]');
  var closeBtn = document.querySelector('[data-chat-close]');
  var badge = document.querySelector('[data-chat-badge]');
  if (!launcher || !win) return;

  var history = [];
  var isOpen = false;
  var isSending = false;
  var greeted = false;

  var STARTER_CHIPS = [
    'Combien coûte un site vitrine ?',
    'Je veux un devis',
    'Un site avec agenda / réservation, c\'est possible ?',
    'Parler à Thibault directement'
  ];

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderMarkdownLite(text) {
    var safe = escapeHtml(text);
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\n\n/g, '</p><p>');
    safe = safe.replace(/\n/g, '<br>');
    return '<p>' + safe + '</p>';
  }

  function addMessage(role, text) {
    var wrap = document.createElement('div');
    wrap.className = 'msg ' + (role === 'user' ? 'msg-user' : 'msg-bot');
    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = renderMarkdownLite(text);
    wrap.appendChild(bubble);
    body.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function addChips(labels, onPick) {
    var wrap = document.createElement('div');
    wrap.className = 'msg-suggestions';
    labels.forEach(function (label) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = label;
      chip.addEventListener('click', function () { onPick(label); });
      wrap.appendChild(chip);
    });
    body.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function addQuoteCard(quote) {
    var wrap = document.createElement('div');
    wrap.className = 'quote-card';
    wrap.innerHTML =
      '<h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Demande de devis envoyée</h4>' +
      '<dl>' +
      '<dt>Nom</dt><dd>' + escapeHtml(quote.nom || '—') + '</dd>' +
      '<dt>Email</dt><dd>' + escapeHtml(quote.email || '—') + '</dd>' +
      '<dt>Projet</dt><dd>' + escapeHtml(quote.type_projet || '—') + '</dd>' +
      '<dt>Budget</dt><dd>' + escapeHtml(quote.budget_indicatif || 'à discuter') + '</dd>' +
      '</dl>';
    body.appendChild(wrap);
    scrollToBottom();
  }

  function addTyping() {
    var wrap = document.createElement('div');
    wrap.className = 'msg msg-bot';
    wrap.setAttribute('data-typing', '1');
    wrap.innerHTML = '<div class="bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
    body.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function openChat() {
    isOpen = true;
    win.classList.add('is-open');
    win.setAttribute('aria-hidden', 'false');
    if (badge) badge.style.display = 'none';
    if (!greeted) {
      greeted = true;
      setTimeout(function () {
        addMessage('bot', 'Bonjour ! Je suis l\'assistant virtuel de Thibault Dubois, développeur web freelance près de Brest. Je peux vous expliquer ses prestations, répondre à vos questions ou préparer une demande de devis. Comment puis-je vous aider ?');
        addChips(STARTER_CHIPS, function (label) {
          submitMessage(label);
        });
      }, 300);
    }
    setTimeout(function () { input.focus(); }, 350);
  }

  function closeChat() {
    isOpen = false;
    win.classList.remove('is-open');
    win.setAttribute('aria-hidden', 'true');
  }

  launcher.addEventListener('click', function () {
    isOpen ? closeChat() : openChat();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  function fallbackMessage() {
    return 'Je ne parviens pas à me connecter à mon service de conversation pour le moment. En attendant, vous pouvez consulter la page **Services**, ou envoyer directement votre demande via le formulaire de la page **Contact** — Thibault vous répondra sous 24 à 48h.';
  }

  function submitMessage(text) {
    if (!text || isSending) return;
    isSending = true;
    addMessage('user', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    var typingEl = addTyping();
    var sendBtn = form.querySelector('.chat-send');
    if (sendBtn) sendBtn.disabled = true;

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('http ' + res.status);
        return res.json();
      })
      .then(function (data) {
        typingEl.remove();
        var replyText = data.text || 'Désolé, je n\'ai pas compris. Pouvez-vous reformuler ?';
        addMessage('bot', replyText);
        history.push({ role: 'assistant', content: replyText });
        if (data.quote) {
          addQuoteCard(data.quote);
        }
      })
      .catch(function () {
        typingEl.remove();
        addMessage('bot', fallbackMessage());
        addChips(['Voir les services', 'Aller au formulaire de contact'], function (label) {
          window.location.href = label.indexOf('services') > -1 ? 'services.html' : 'contact.html#form';
        });
      })
      .finally(function () {
        isSending = false;
        if (sendBtn) sendBtn.disabled = false;
      });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitMessage(input.value.trim());
    });
  }
})();
