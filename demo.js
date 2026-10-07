function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

const scenarios = {
  patio: {
    q: "I need materials for a 25m² patio",
    title: "I can build the materials list.",
    intro: "For a 25m² patio, assuming standard 600 × 600 paving slabs and a typical sub-base:",
    rows: [
      ["Paving slabs", "≈ 70"],
      ["MOT Type 1", "≈ 2.3 tonnes"],
      ["Sharp sand", "≈ 1.3 tonnes"],
      ["Cement", "8–10 bags"]
    ],
    note: "I’d confirm slab choice, laying pattern and site conditions before finalising quantities.",
    cta: "Choose slabs & build basket"
  },
  insulation: {
    q: "Have you got 100mm PIR?",
    title: "Yes — I found matching insulation options.",
    intro: "I’d show the merchant’s live products here, with stock, branch availability and trade pricing where permitted.",
    rows: [
      ["100mm PIR board", "2400 × 1200"],
      ["Coverage per board", "2.88 m²"],
      ["Alternative", "Equivalent brand available"],
      ["Delivery", "Check by postcode"]
    ],
    note: "If the preferred product is unavailable, TradeMate can suggest an approved equivalent rather than ending the conversation.",
    cta: "Check stock & price"
  },
  repeat: {
    q: "I bought this last month — send me the same again",
    title: "I found the previous order.",
    intro: "With customer history connected, TradeMate can identify the order and rebuild it instead of asking the customer to search again.",
    rows: [
      ["Order", "#18427"],
      ["Items", "7 products"],
      ["Previous total", "€684.20"],
      ["Current availability", "6 / 7 in stock"]
    ],
    note: "The unavailable line can be replaced with an equivalent or handed to a salesperson for approval.",
    cta: "Rebuild previous basket"
  },
  alternative: {
    q: "What’s the cheaper alternative?",
    title: "Here’s the closest lower-cost option.",
    intro: "TradeMate can compare relevant products using merchant-defined rules rather than simply recommending the cheapest item.",
    rows: [
      ["Original product", "€42.50"],
      ["Alternative", "€35.90"],
      ["Saving", "€6.60 / unit"],
      ["Key difference", "Lower thermal rating"]
    ],
    note: "Where suitability matters, the assistant explains the trade-off and can ask a technical salesperson to confirm.",
    cta: "Compare both products"
  }
};

const chat = document.getElementById('demo-chat');
const input = document.getElementById('demo-input');
const send = document.getElementById('demo-send');
const status = document.getElementById('demo-status');
const promptButtons = [...document.querySelectorAll('.prompt')];

function resultMarkup(s) {
  return `
    <div class="demo-msg user">${s.q}</div>
    <div class="demo-msg bot">
      <div class="answer-title">${s.title}</div>
      <div>${s.intro}</div>
      <div class="demo-result">
        ${s.rows.map(([k,v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('')}
      </div>
      <div class="answer-note">${s.note}</div>
      <div class="answer-note">Example next step: ${s.cta}</div>
    </div>`;
}

function loadScenario(key, animate = true) {
  clearTimeout(window.scenarioTimer);
  const s = scenarios[key];
  if (!s) return;
  input.value = s.q;
  promptButtons.forEach(b => b.classList.toggle('active', b.dataset.scenario === key));
  status.textContent = animate ? 'Loading example…' : 'Ready';
  chat.innerHTML = `<div class="demo-msg user">${s.q}</div>`;
  if (animate) {
    window.scenarioTimer = setTimeout(() => {
      status.textContent = 'Example ready';
      chat.innerHTML = resultMarkup(s);
    }, 430);
  } else {
    chat.innerHTML = resultMarkup(s);
  }
}

promptButtons.forEach(btn => btn.addEventListener('click', () => loadScenario(btn.dataset.scenario)));

send.addEventListener('click', () => {
  clearTimeout(window.scenarioTimer);
  const text = input.value.trim();
  const match = Object.entries(scenarios).find(([,s]) => s.q.toLowerCase() === text.toLowerCase());
  if (match) return loadScenario(match[0]);
  status.textContent = 'Demo response';
  chat.innerHTML = `
    <div class="demo-msg user">${escapeHtml(text || 'Choose a sample question')}</div>
    <div class="demo-msg bot">
      <div class="answer-title">Choose one of the four sample enquiries.</div>
      <div>This interactive example uses prepared responses. A TradeMate demo with our team can explore enquiries specific to your business.</div>
      <div class="answer-note">Select an example question to continue.</div>
    </div>`;
});
input.addEventListener('keydown', e => { if (e.key === 'Enter') send.click(); });


loadScenario('patio',false);document.querySelectorAll('[data-scroll-demo]').forEach(b=>b.addEventListener('click',()=>document.getElementById('demo').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})));