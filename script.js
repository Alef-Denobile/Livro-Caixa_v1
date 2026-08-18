/* =======================================================================
   Livro-Caixa — Pessoal & Empresa (v2)
   Vanilla JS + localStorage. Abra o index.html no navegador para usar.
   ======================================================================= */

/* ----------------------------------------------------------------------- */
/* Personagens & perfis                                                    */
/* ----------------------------------------------------------------------- */
const PROFILE_COLORS = {
  organizadora: { primary: "#2F6F4E", soft: "#E3EEE7", label: "Organizador(a)" },
  recomeco:     { primary: "#2E5FA3", soft: "#E1E9F5", label: "Recomeço" },
  consumista:   { primary: "#C23B72", soft: "#F6E1EB", label: "Consumista" },
  investidora:  { primary: "#C97A2E", soft: "#F5E5D2", label: "Investidor(a)" },
};

const CHARACTERS = [
  { id: "lily",     name: "Lily",     title: "A Empresária",    profile: "organizadora", gender: "f", desc: "Organizada e estratégica, constrói seu negócio e o futuro com inteligência." },
  { id: "julia",    name: "Júlia",    title: "A Recomeçando",   profile: "recomeco",     gender: "f", desc: "Batalhadora e determinada, está reescrevendo sua história e saindo das dívidas." },
  { id: "maria",    name: "Maria",    title: "A Consumista",    profile: "consumista",   gender: "f", desc: "Apaixonada por compras e experiências, aprendendo a equilibrar desejos e prioridades." },
  { id: "sofia",    name: "Sofia",    title: "A Investidora",   profile: "investidora",  gender: "f", desc: "Focada e visionária, investe com estratégia para conquistar liberdade financeira." },
  { id: "mateus",   name: "Mateus",   title: "O Organizado",    profile: "organizadora", gender: "m", desc: "Disciplinado e planejador, faz o dinheiro trabalhar por seus sonhos." },
  { id: "jonathan", name: "Jonathan", title: "O Endividado",    profile: "recomeco",     gender: "m", desc: "Trabalhador, mas perdido nas dívidas. Está aprendendo a recomeçar." },
  { id: "lucas",    name: "Lucas",    title: "O Consumista",    profile: "consumista",   gender: "m", desc: "Ama tecnologia e conforto, mas está descobrindo que controle financeiro traz liberdade." },
  { id: "rafael",   name: "Rafael",   title: "O Investidor",    profile: "investidora",  gender: "m", desc: "Ambicioso e estratégico, investe hoje para viver a vida que sempre sonhou amanhã." },
];

const TIPS = {
  organizadora: [
    "Continue registrando cada receita e despesa — é isso que te dá controle total.",
    "Que tal criar um orçamento mensal por categoria? Você já tem a disciplina pra seguir.",
    "Revise suas assinaturas: pequenos gastos fixos somam bastante no fim do mês.",
    "Você está no caminho certo. Considere automatizar uma poupança mensal.",
    "Organização é seu ponto forte — aproveite pra planejar os próximos 3 meses.",
  ],
  recomeco: [
    "Um passo de cada vez. Foque em quitar a dívida com maior juros primeiro.",
    "Já pensou em renegociar suas dívidas? Muitas vezes dá pra conseguir condições melhores.",
    "Celebre pequenas vitórias: cada real guardado é um passo pra fora das dívidas.",
    "Evite abrir novos parcelamentos por enquanto — foco em equilibrar o que já existe.",
    "Recomeçar não é fracasso, é coragem. Você está indo bem.",
  ],
  consumista: [
    "Antes de comprar, espere 24h. Muita vontade passa com o tempo.",
    "Que tal definir um limite mensal só pra 'gastos de desejo'? Sem culpa, com controle.",
    "Separe uma meta divertida (tipo uma viagem) pra canalizar a vontade de gastar.",
    "Revise seu extrato de cartão — as pequenas compras impulsivas costumam ser as maiores vilãs.",
    "Controlar não é deixar de viver — é viver sem sustos no fim do mês.",
  ],
  investidora: [
    "Considere diversificar entre renda fixa e variável de acordo com seu perfil de risco.",
    "Reinvista parte dos rendimentos — o efeito composto é seu maior aliado.",
    "Revise a rentabilidade dos seus investimentos a cada trimestre.",
    "Separe uma reserva de emergência antes de aumentar posições de risco.",
    "Cada real investido hoje trabalha por você amanhã. Continue assim.",
  ],
};

const PREMIUM_TABS = ["investimentos", "empresa", "comissoes", "assistente"];

/* ----------------------------------------------------------------------- */
/* Constantes gerais                                                       */
/* ----------------------------------------------------------------------- */
const COLORS = { pessoal: "#2F6F4E", empresa: "#A15C38", gold: "#B9922E", red: "#B33F3F", ink: "#1C2B22" };

/* ----------------------------------------------------------------------- */
/* Comissão de consórcio: regra fixa a partir do valor da carta de crédito */
/* Baseado no padrão real: carta de R$1.000.000 → 10 parcelas de R$1.033,88 */
/* + 3 parcelas de R$1.905,61 (13x no total). Os fatores abaixo escalam    */
/* essa mesma proporção para qualquer valor de carta.                     */
/* ----------------------------------------------------------------------- */
const COMISSAO_PARCELAS_BLOCO1 = 10;
const COMISSAO_PARCELAS_BLOCO2 = 3;
const COMISSAO_FATOR_BLOCO1 = 1033.88 / 1000000; // valor da parcela (1ª–10ª) por real de carta
const COMISSAO_FATOR_BLOCO2 = 1905.61 / 1000000; // valor da parcela (11ª–13ª) por real de carta
function calcComissaoParcelas(valorCredito) {
  const credito = parseFloat(valorCredito) || 0;
  const value1 = Math.round(credito * COMISSAO_FATOR_BLOCO1 * 100) / 100;
  const value2 = Math.round(credito * COMISSAO_FATOR_BLOCO2 * 100) / 100;
  return { value1, value2 };
}
function commissionPreviewHtml(valorCredito) {
  const { value1, value2 } = calcComissaoParcelas(valorCredito);
  const totalParcelas = COMISSAO_PARCELAS_BLOCO1 + COMISSAO_PARCELAS_BLOCO2;
  const totalLiquido = COMISSAO_PARCELAS_BLOCO1 * value1 + COMISSAO_PARCELAS_BLOCO2 * value2;
  return `🔹 10 primeiras parcelas: <b>${fmtBRL(value1)}</b> cada<br/>
    🔹 3 últimas parcelas: <b>${fmtBRL(value2)}</b> cada<br/>
    Total: ${totalParcelas}x parcelas · Total líquido da comissão: <b>${fmtBRL(totalLiquido)}</b>`;
}
const CATEGORIAS_DESPESA = ["Moradia","Alimentação","Transporte","Saúde","Educação","Lazer","Assinaturas","Impostos","Cartão de Crédito","Marketing","Fornecedores","Salários","Ferramentas/Software","Aluguel Comercial","Outros"];
const CATEGORIAS_RECEITA = ["Salário","Freelance","Vendas","Serviços Prestados","Comissão","Dividendos","Rendimentos","Reembolso","Outros"];
const CONTAS = ["Cartão de Crédito","Conta Corrente","Dinheiro","Pix","Boleto"];
const TIPOS_INVEST = ["Renda Fixa","Renda Variável","Fundos","Cripto","Previdência","Outros"];

const uid = () => Math.random().toString(36).slice(2, 10);
const fmtBRL = (n) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);
const fmtPct = (n) => `${((n || 0) * 100).toFixed(1)}%`;

/* Máscara de moeda (padrão real): formata "R$ 100.000,00" enquanto o usuário digita.
   Os dígitos digitados formam o valor inteiro em reais (sem centavos, que não se aplicam
   a valor de carta de crédito) — digitar 100000 já mostra R$ 100.000,00.
   Importante: os dígitos digitados são controlados numa variável própria (não são relidos
   do texto já formatado), pois o texto formatado sempre termina em ",00" — relê-lo faria
   esses dois zeros fixos serem contados como se o usuário tivesse digitado, multiplicando
   o valor a cada tecla (esse era o bug do "aparecem três zeros"). */
function formatBRLTyped(value) {
  const inteiro = Math.max(0, Math.round(parseFloat(value) || 0));
  const formatado = String(inteiro).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${formatado},00`;
}
function attachCurrencyMask(input, onChange) {
  let raw = ""; // string só com os dígitos que o usuário efetivamente digitou (valor em reais)
  const MAX_DIGITS = 12;
  const sync = () => {
    const value = raw ? parseInt(raw, 10) : 0;
    input.value = formatBRLTyped(value);
    onChange(value);
  };
  input.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
      e.preventDefault();
      if (raw.length < MAX_DIGITS) { raw = (raw + e.key).replace(/^0+(?=\d)/, ""); sync(); }
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      raw = raw.slice(0, -1);
      sync();
    } else if (!["ArrowLeft","ArrowRight","Tab","Home","End","Enter"].includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  });
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    const digits = text.replace(/\D/g, "");
    raw = (raw + digits).replace(/^0+(?=\d)/, "").slice(0, MAX_DIGITS);
    sync();
  });
  return { setValue: (v) => { raw = String(Math.max(0, Math.round(parseFloat(v) || 0))); sync(); } };
}
const monthKey = (d) => (d || "").slice(0, 7);
const brDate = (d) => (d || "").split("-").reverse().join("/");
const monthLabel = (ym) => {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return `${meses[parseInt(m, 10) - 1]}/${y}`;
};
const todayISO = () => new Date().toISOString().slice(0, 10);
const escapeHtml = (s) => (s || "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const addMonths = (ym, n) => {
  const [y, m] = ym.split("-").map(Number);
  const total = (y * 12 + (m - 1)) + n;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
};
const monthsBetween = (a, b) => {
  const [ya, ma] = a.split("-").map(Number);
  const [yb, mb] = b.split("-").map(Number);
  return (yb * 12 + mb) - (ya * 12 + ma);
};

/* ----------------------------------------------------------------------- */
/* Seed data                                                                */
/* ----------------------------------------------------------------------- */
const SEED_TX = [
  { id: uid(), date: "2026-07-01", desc: "Salário mensal", type: "Receita", category: "Salário", scope: "Pessoal", account: "Conta Corrente", status: "Pago", value: 6500, recurrence: "fixo", parcelas: null },
  { id: uid(), date: "2026-07-03", desc: "Aluguel", type: "Despesa", category: "Moradia", scope: "Pessoal", account: "Conta Corrente", status: "Pago", value: 1800, recurrence: "fixo", parcelas: null },
  { id: uid(), date: "2026-07-05", desc: "Supermercado", type: "Despesa", category: "Alimentação", scope: "Pessoal", account: "Cartão de Crédito", status: "Pago", value: 620, recurrence: "unico", parcelas: null },
  { id: uid(), date: "2026-06-06", desc: "Notebook novo", type: "Despesa", category: "Ferramentas/Software", scope: "Pessoal", account: "Cartão de Crédito", status: "Pago", value: 289, recurrence: "parcelado", parcelas: 10 },
  { id: uid(), date: "2026-07-06", desc: "Assinatura streaming", type: "Despesa", category: "Assinaturas", scope: "Pessoal", account: "Cartão de Crédito", status: "Pago", value: 55.9, recurrence: "fixo", parcelas: null },
  { id: uid(), date: "2026-07-10", desc: "Venda de serviço", type: "Receita", category: "Serviços Prestados", scope: "Empresa", account: "Pix", status: "Pago", value: 4200, recurrence: "unico", parcelas: null },
  { id: uid(), date: "2026-07-12", desc: "Fornecedor de materiais", type: "Despesa", category: "Fornecedores", scope: "Empresa", account: "Boleto", status: "Pago", value: 1350, recurrence: "unico", parcelas: null },
  { id: uid(), date: "2026-07-15", desc: "Ferramenta SaaS", type: "Despesa", category: "Ferramentas/Software", scope: "Empresa", account: "Cartão de Crédito", status: "Pago", value: 299, recurrence: "fixo", parcelas: null },
  { id: uid(), date: "2026-07-20", desc: "Freelance design", type: "Receita", category: "Freelance", scope: "Pessoal", account: "Pix", status: "Pendente", value: 950, recurrence: "unico", parcelas: null },
  { id: uid(), date: "2026-07-01", desc: "Comissão — Contrato Imóvel 118", type: "Receita", category: "Comissão", scope: "Pessoal", account: "Conta Corrente", status: "Pago", value: 600, recurrence: "parcelado", parcelas: 13 },
  { id: uid(), date: "2026-06-01", desc: "Comissão — Contrato Veículo 044", type: "Receita", category: "Comissão", scope: "Pessoal", account: "Conta Corrente", status: "Pago", value: 533.33, recurrence: "parcelado", parcelas: 6 },
];
const SEED_CARDS = [
  { id: uid(), name: "Nubank", limit: 5000, dueDay: 10, bestDay: 3 },
  { id: uid(), name: "Inter", limit: 3000, dueDay: 15, bestDay: 5 },
];
const SEED_INV = [
  { id: uid(), name: "Tesouro Selic", type: "Renda Fixa", scope: "Pessoal", institution: "Banco XP", date: "2025-01-10", applied: 5000, current: 5450 },
  { id: uid(), name: "Ações ITSA4", type: "Renda Variável", scope: "Pessoal", institution: "Corretora A", date: "2025-06-01", applied: 2000, current: 2180 },
  { id: uid(), name: "CDB Empresa", type: "Renda Fixa", scope: "Empresa", institution: "Banco C6", date: "2025-03-01", applied: 10000, current: 10650 },
];
const SEED_GOALS = [
  { id: uid(), name: "Reserva de Emergência", scope: "Pessoal", target: 20000, current: 8500, deadline: "2026-12-31" },
  { id: uid(), name: "Viagem Europa", scope: "Pessoal", target: 15000, current: 3200, deadline: "2027-06-30" },
  { id: uid(), name: "Equipamento novo", scope: "Empresa", target: 12000, current: 12000, deadline: "2026-05-01" },
];

/* ----------------------------------------------------------------------- */
/* Persistência                                                             */
/* ----------------------------------------------------------------------- */
function loadKey(key, seed) {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch (e) {}
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}
function persist(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }

const state = {
  tab: "dashboard",
  month: "2026-07",
  scopeFilter: "Todos",
  txs: loadKey("finance_transactions", SEED_TX),
  cards: loadKey("finance_cards", SEED_CARDS),
  invs: loadKey("finance_investments", SEED_INV),
  goals: loadKey("finance_goals", SEED_GOALS),
  profile: loadKey("finance_profile", null),
  chatLog: [],
};

function saveTxs() { persist("finance_transactions", state.txs); }
function saveCards() { persist("finance_cards", state.cards); }
function saveInvs() { persist("finance_investments", state.invs); }
function saveGoals() { persist("finance_goals", state.goals); }
function saveProfile() { persist("finance_profile", state.profile); }

/* ----------------------------------------------------------------------- */
/* Tema dinâmico                                                            */
/* ----------------------------------------------------------------------- */
function applyTheme() {
  const char = getCharacter();
  const colors = char ? PROFILE_COLORS[char.profile] : PROFILE_COLORS.organizadora;
  document.documentElement.style.setProperty("--char", colors.primary);
  document.documentElement.style.setProperty("--char-soft", colors.soft);
}
function getCharacter() {
  if (!state.profile || !state.profile.character) return null;
  return CHARACTERS.find((c) => c.id === state.profile.character) || null;
}
function isPremium() { return !!(state.profile && state.profile.plan === "premium"); }

/* ----------------------------------------------------------------------- */
/* Motor de ocorrências (único / fixo / parcelado)                         */
/* ----------------------------------------------------------------------- */
function occurrencesForMonth(month, scope) {
  const rows = [];
  state.txs.forEach((tx) => {
    if (scope && scope !== "Todos" && tx.scope !== scope) return;
    const anchor = monthKey(tx.date);
    if (tx.recurrence === "fixo") {
      if (anchor <= month) rows.push({ tx, value: tx.value, badge: "Fixo" });
    } else if (tx.recurrence === "parcelado") {
      const idx = monthsBetween(anchor, month);
      if (idx >= 0 && idx < (tx.parcelas || 1)) {
        const value = parcelaValue(tx, idx);
        rows.push({ tx, value, badge: `${idx + 1}/${tx.parcelas}` });
      }
    } else {
      if (anchor === month) rows.push({ tx, value: tx.value, badge: null });
    }
  });
  return rows;
}
function sumsFromOccurrences(rows) {
  const rec = rows.filter((r) => r.tx.type === "Receita").reduce((a, r) => a + r.value, 0);
  const desp = rows.filter((r) => r.tx.type === "Despesa").reduce((a, r) => a + r.value, 0);
  return { rec, desp, saldo: rec - desp };
}
/* Comissão: parcela 1 até "parcelas1" usa o valor do Bloco 1 (tx.value);
   da parcela seguinte até o fim usa o valor do Bloco 2 (tx.value2).
   Se tx.parcelas1 não existir, é uma parcela simples (valor único). */
function parcelaValue(tx, idx) {
  if (tx.parcelas1 == null) return tx.value;
  return idx < tx.parcelas1 ? tx.value : (tx.value2 != null ? tx.value2 : tx.value);
}
function contratoTotal(c) {
  let total = 0;
  for (let i = 0; i < c.parcelas; i++) total += parcelaValue(c, i);
  return total;
}
function contratoRestante(c, fromIdx) {
  let total = 0;
  for (let i = Math.max(0, fromIdx); i < c.parcelas; i++) total += parcelaValue(c, i);
  return total;
}
function cardUsage() {
  const rows = occurrencesForMonth(state.month).filter((r) => r.tx.account === "Cartão de Crédito" && r.tx.type === "Despesa");
  const total = rows.reduce((a, r) => a + r.value, 0);
  return state.cards.length ? total / state.cards.length : 0;
}

/* ----------------------------------------------------------------------- */
/* Navegação                                                                */
/* ----------------------------------------------------------------------- */
document.getElementById("nav").addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-item");
  if (!btn) return;
  const tab = btn.dataset.tab;
  if (PREMIUM_TABS.includes(tab) && !isPremium()) {
    state.tab = tab;
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b === btn));
    render();
    return;
  }
  state.tab = tab;
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b === btn));
  render();
});

function render() {
  applyTheme();
  const main = document.getElementById("main");
  if (PREMIUM_TABS.includes(state.tab) && !isPremium()) { main.innerHTML = renderPaywall(state.tab); attachMainEvents(); return; }
  if (state.tab === "dashboard") main.innerHTML = renderDashboard();
  else if (state.tab === "lancamentos") main.innerHTML = renderLancamentos();
  else if (state.tab === "cartoes") main.innerHTML = renderCartoes();
  else if (state.tab === "investimentos") main.innerHTML = renderInvestimentos();
  else if (state.tab === "empresa") main.innerHTML = renderEmpresa();
  else if (state.tab === "objetivos") main.innerHTML = renderObjetivos();
  else if (state.tab === "comissoes") main.innerHTML = renderComissoes();
  else if (state.tab === "assistente") main.innerHTML = renderAssistente();
  else if (state.tab === "cadastro") main.innerHTML = renderCadastro();
  attachMainEvents();
}

/* ----------------------------------------------------------------------- */
/* Componentes                                                              */
/* ----------------------------------------------------------------------- */
function statCard(label, value, color, sub) {
  return `<div class="card"><div class="stat-row"><span class="stat-label">${label}</span></div>
    <div class="stat-value" style="color:${color}">${value}</div>${sub ? `<div class="stat-sub">${sub}</div>` : ""}</div>`;
}
function bar(pct, color) {
  const clamped = Math.max(0, Math.min(1, pct || 0));
  return `<div class="bar-track"><div class="bar-fill" style="width:${clamped * 100}%;background:${color}"></div></div>`;
}
function scopeTag(scope) { return `<span class="tag ${scope === "Empresa" ? "empresa" : "pessoal"}">${scope}</span>`; }
function recurBadge(badge) {
  if (!badge) return "";
  if (badge === "Fixo") return `<span class="tag fixo">Fixo</span>`;
  return `<span class="tag parcelado">${badge}</span>`;
}
const STATUS_OPTIONS = ["Pago", "Pendente", "Agendado"];
const STATUS_COLORS = {
  Pago: { text: COLORS.pessoal, bg: "#E3EEE7" },
  Pendente: { text: COLORS.red, bg: "#F5E2E0" },
  Agendado: { text: "#2E5FA3", bg: "#E1E9F5" },
};
function statusSelect(tx) {
  const c = STATUS_COLORS[tx.status] || STATUS_COLORS.Pago;
  const opts = STATUS_OPTIONS.map((o) => `<option value="${o}" ${o === tx.status ? "selected" : ""}>${o}</option>`).join("");
  return `<select class="status-select" data-id="${tx.id}" style="color:${c.text};background:${c.bg}">${opts}</select>`;
}
function scopePills() {
  return `<div class="row-gap">
    <button class="pill ${state.scopeFilter === "Todos" ? "active" : ""}" style="${state.scopeFilter === "Todos" ? `background:${COLORS.ink}` : ""}" data-scope="Todos">Todos</button>
    <button class="pill ${state.scopeFilter === "Pessoal" ? "active" : ""}" style="${state.scopeFilter === "Pessoal" ? `background:${COLORS.pessoal}` : ""}" data-scope="Pessoal">Pessoal</button>
    <button class="pill ${state.scopeFilter === "Empresa" ? "active" : ""}" style="${state.scopeFilter === "Empresa" ? `background:${COLORS.empresa}` : ""}" data-scope="Empresa">Empresa</button>
  </div>`;
}
function monthNav(inputId) {
  return `<div class="month-nav">
    <button data-monthdelta="-1">‹</button>
    <span>${monthLabel(state.month)}</span>
    <button data-monthdelta="1">›</button>
  </div>`;
}
function occTable(rows) {
  if (rows.length === 0) return `<div class="table-wrap"><p class="empty-msg">Nenhum lançamento neste filtro/mês.</p></div>`;
  const sorted = rows.slice().sort((a, b) => (a.tx.date < b.tx.date ? 1 : -1));
  const trs = sorted.map((r) => `
    <tr data-id="${r.tx.id}">
      <td class="mono" style="color:var(--ink-muted);white-space:nowrap;font-size:12px">${brDate(r.tx.date)}</td>
      <td>${escapeHtml(r.tx.desc)} ${recurBadge(r.badge)}</td>
      <td style="color:var(--ink-muted)">${r.tx.category}</td>
      <td>${scopeTag(r.tx.scope)}</td>
      <td style="font-size:12px;color:var(--ink-muted)">${r.tx.account}</td>
      <td class="${r.tx.type === "Receita" ? "val-receita" : "val-despesa"}">${r.tx.type === "Receita" ? "+" : "−"} ${fmtBRL(r.value)}</td>
      <td>${statusSelect(r.tx)}</td>
      <td><button class="icon-btn tx-edit" title="Editar">✎</button><button class="icon-btn tx-del" title="Excluir">🗑</button></td>
    </tr>`).join("");
  return `<div class="table-wrap"><table>
    <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Escopo</th><th>Forma</th><th>Valor</th><th>Status</th><th></th></tr></thead>
    <tbody>${trs}</tbody></table></div>`;
}

/* ----------------------------------------------------------------------- */
/* Paywall                                                                  */
/* ----------------------------------------------------------------------- */
const PAYWALL_INFO = {
  investimentos: { title: "Investimentos é premium", desc: "Acompanhe seus investimentos, rentabilidade e evolução do patrimônio." },
  empresa: { title: "Área Empresa é premium", desc: "Separe as finanças do seu CNPJ com painel próprio." },
  comissoes: { title: "Comissões é premium", desc: "Controle contratos de consórcio e comissões parceladas em até 13x." },
  assistente: { title: "Assistente é premium", desc: "Dicas, alertas e respostas personalizadas com base no seu perfil financeiro." },
};
function renderPaywall(tab) {
  const info = PAYWALL_INFO[tab] || { title: "Recurso premium", desc: "Esse recurso faz parte do plano pago." };
  return `<div class="paywall">
    <div class="lock-big">🔒</div>
    <h2>${info.title}</h2>
    <p>${info.desc}</p>
    <ul>
      <li>Investimentos com rentabilidade automática</li>
      <li>Painel separado da Empresa</li>
      <li>Comissões parceladas em até 13x</li>
      <li>Assistente com dicas e alertas personalizados</li>
    </ul>
    <div><button class="btn char save-btn" id="unlock-premium-btn">Ativar Premium</button></div>
    <p style="font-size:11px;margin-top:10px">Assinatura simulada — sem cobrança real.</p>
  </div>`;
}

/* ----------------------------------------------------------------------- */
/* Painel (Dashboard)                                                       */
/* ----------------------------------------------------------------------- */
function renderDashboard() {
  const rows = occurrencesForMonth(state.month, state.scopeFilter);
  const dashSums = sumsFromOccurrences(rows);
  const allMonthsUpToNow = []; // saldo acumulado: soma de todas ocorrências em meses <= state.month
  state.txs.forEach((tx) => {}); // placeholder not used
  const allSums = sumsFromOccurrences(occurrencesForMonth(state.month, state.scopeFilter));

  const catMap = {};
  rows.filter((r) => r.tx.type === "Despesa").forEach((r) => { catMap[r.tx.category] = (catMap[r.tx.category] || 0) + r.value; });
  const catTotals = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxCat = catTotals.length ? catTotals[0][1] : 1;

  const investTotals = state.invs.reduce((a, i) => ({ applied: a.applied + i.applied, current: a.current + i.current }), { applied: 0, current: 0 });
  const rentMedia = investTotals.applied ? (investTotals.current - investTotals.applied) / investTotals.applied : 0;
  const char = getCharacter();
  const tipOfDay = char ? TIPS[char.profile][new Date().getDate() % TIPS[char.profile].length] : null;

  return `
    <div class="row-between">
      <div>
        <h1 class="page-title">Painel financeiro</h1>
        <p class="page-sub">Resumo de ${monthLabel(state.month)}${char ? ` · Olá, ${escapeHtml(state.profile.name || "")}` : ""}</p>
      </div>
      <div class="row-gap">
        ${monthNav()}
        ${scopePills()}
      </div>
    </div>

    ${tipOfDay ? `<div class="card" style="margin-bottom:20px;border-color:var(--char);display:flex;gap:12px;align-items:center">
      <div style="width:34px;height:34px;border-radius:50%;background:var(--char);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0">✦</div>
      <div><div class="stat-label">Dica do dia · ${char.name}</div><div style="font-size:14px;margin-top:2px">${tipOfDay}</div></div>
    </div>` : ""}

    <div class="grid grid-3" style="margin-bottom:20px">
      ${statCard("Receitas do mês", fmtBRL(dashSums.rec), COLORS.pessoal)}
      ${statCard("Despesas do mês", fmtBRL(dashSums.desp), COLORS.red)}
      ${statCard("Saldo do mês", fmtBRL(dashSums.saldo), COLORS.gold)}
    </div>

    <div class="grid grid-2" style="margin-bottom:20px">
      <div class="card">
        <h2 class="section-title" style="border-color:${COLORS.pessoal}">Despesas por categoria</h2>
        ${catTotals.length === 0 ? `<p style="color:var(--ink-muted);font-size:14px">Sem despesas neste filtro.</p>` :
          catTotals.map(([cat, val]) => `<div style="margin-bottom:12px"><div class="bar-line"><span>${cat}</span><span class="mono">${fmtBRL(val)}</span></div>${bar(val / maxCat, COLORS.empresa)}</div>`).join("")}
      </div>
      <div class="card">
        <h2 class="section-title" style="border-color:${COLORS.gold}">Objetivos em andamento</h2>
        ${state.goals.map((g) => { const pct = g.target ? g.current / g.target : 0; return `
          <div style="margin-bottom:14px"><div class="bar-line"><span>${escapeHtml(g.name)} <span style="font-size:12px;color:${g.scope === "Empresa" ? COLORS.empresa : COLORS.pessoal}">· ${g.scope}</span></span><span class="mono" style="font-size:12px;color:var(--ink-muted)">${fmtPct(pct)}</span></div>${bar(pct, pct >= 1 ? COLORS.pessoal : COLORS.gold)}</div>`; }).join("")}
      </div>
    </div>

    <div class="grid grid-3">
      ${statCard("Limite de cartões", fmtBRL(state.cards.reduce((a, c) => a + c.limit, 0)), COLORS.pessoal)}
      ${isPremium() ? statCard("Total investido", fmtBRL(investTotals.applied), COLORS.pessoal, `Valor atual: ${fmtBRL(investTotals.current)}`) : statCard("Investimentos", "🔒 Premium", COLORS.ink)}
      ${isPremium() ? statCard("Rentabilidade média", fmtPct(rentMedia), COLORS.gold) : statCard("Assistente & mais", "🔒 Premium", COLORS.ink)}
    </div>
  `;
}

/* ----------------------------------------------------------------------- */
/* Lançamentos                                                              */
/* ----------------------------------------------------------------------- */
function renderLancamentos() {
  const rows = occurrencesForMonth(state.month, state.scopeFilter);
  return `
    <div class="row-between">
      <h1 class="page-title">Lançamentos</h1>
      <div class="row-gap">
        ${monthNav()}
        ${scopePills()}
        <button class="btn pessoal" id="new-tx-btn">+ Novo</button>
      </div>
    </div>
    <p style="font-size:12px;color:var(--ink-muted);margin:-14px 0 16px">Contas <span class="tag fixo">Fixo</span> repetem todo mês. Contas <span class="tag parcelado">Parcelado</span> aparecem automaticamente até acabar as parcelas.</p>
    ${occTable(rows)}
  `;
}

/* ----------------------------------------------------------------------- */
/* Cartões                                                                  */
/* ----------------------------------------------------------------------- */
function renderCartoes() {
  const usage = cardUsage();
  const items = state.cards.map((c) => {
    const used = usage;
    const pct = c.limit ? used / c.limit : 0;
    return `<div class="item-card" data-id="${c.id}">
      <div class="item-head">
        <div><h3 class="item-title">${escapeHtml(c.name)}</h3><p class="item-note">Vence dia ${c.dueDay} · melhor compra dia ${c.bestDay}</p></div>
        <div><button class="icon-btn card-edit" title="Editar">✎</button><button class="icon-btn card-del" title="Excluir">🗑</button></div>
      </div>
      <div class="bar-line"><span>Fatura estimada do mês</span><span class="mono" style="font-weight:700">${fmtBRL(used)}</span></div>
      ${bar(pct, pct > 0.8 ? COLORS.red : COLORS.pessoal)}
      <div class="bar-line" style="margin-top:8px;font-size:12px;color:var(--ink-muted)"><span>Limite ${fmtBRL(c.limit)}</span><span>Disponível ${fmtBRL(c.limit - used)}</span></div>
    </div>`;
  }).join("");
  return `<div class="row-between"><h1 class="page-title">Cartões de crédito</h1><button class="btn pessoal" id="new-card-btn">+ Novo cartão</button></div>
    <div class="grid grid-2">${items || `<p class="empty-msg">Nenhum cartão cadastrado.</p>`}</div>`;
}

/* ----------------------------------------------------------------------- */
/* Investimentos                                                           */
/* ----------------------------------------------------------------------- */
function renderInvestimentos() {
  const rows = state.invs.map((i) => {
    const rent = i.applied ? (i.current - i.applied) / i.applied : 0;
    return `<tr data-id="${i.id}">
      <td>${escapeHtml(i.name)}<div style="font-size:12px;color:var(--ink-muted)">${escapeHtml(i.institution || "")}</div></td>
      <td style="font-size:12px;color:var(--ink-muted)">${i.type}</td>
      <td>${scopeTag(i.scope)}</td>
      <td class="mono">${fmtBRL(i.applied)}</td>
      <td class="mono">${fmtBRL(i.current)}</td>
      <td class="mono" style="font-weight:700;color:${rent >= 0 ? COLORS.pessoal : COLORS.red}">${fmtPct(rent)}</td>
      <td><button class="icon-btn inv-edit" title="Editar">✎</button><button class="icon-btn inv-del" title="Excluir">🗑</button></td>
    </tr>`;
  }).join("");
  return `<div class="row-between"><h1 class="page-title">Investimentos</h1><button class="btn pessoal" id="new-inv-btn">+ Novo</button></div>
    <div class="table-wrap"><table><thead><tr><th>Ativo</th><th>Tipo</th><th>Escopo</th><th>Aplicado</th><th>Atual</th><th>Rentab.</th><th></th></tr></thead>
    <tbody>${rows || `<tr><td colspan="7"><p class="empty-msg">Nenhum investimento cadastrado.</p></td></tr>`}</tbody></table></div>`;
}

/* ----------------------------------------------------------------------- */
/* Empresa                                                                  */
/* ----------------------------------------------------------------------- */
function renderEmpresa() {
  const rows = occurrencesForMonth(state.month, "Empresa");
  const s = sumsFromOccurrences(rows);
  return `
    <div class="row-between">
      <div><h1 class="page-title" style="color:${COLORS.empresa}">Empresa</h1><p class="page-sub">Área separada do seu CNPJ · ${monthLabel(state.month)}</p></div>
      <div class="row-gap">${monthNav()}<button class="btn empresa" id="new-tx-emp-btn">+ Novo</button></div>
    </div>
    <div class="grid grid-3" style="margin-bottom:24px">
      ${statCard("Receitas", fmtBRL(s.rec), COLORS.empresa)}
      ${statCard("Despesas", fmtBRL(s.desp), COLORS.red)}
      ${statCard("Saldo", fmtBRL(s.saldo), COLORS.gold)}
    </div>
    <h2 class="section-title" style="border-color:${COLORS.empresa}">Lançamentos da empresa</h2>
    ${occTable(rows)}
  `;
}

/* ----------------------------------------------------------------------- */
/* Objetivos                                                                */
/* ----------------------------------------------------------------------- */
function renderObjetivos() {
  const items = state.goals.map((g) => {
    const pct = g.target ? g.current / g.target : 0;
    const done = pct >= 1;
    const late = !done && new Date(g.deadline) < new Date();
    const statusLabel = done ? "Concluído" : late ? "Atrasado" : "Em andamento";
    const statusColor = done ? COLORS.pessoal : late ? COLORS.red : "var(--ink-muted)";
    return `<div class="item-card" data-id="${g.id}">
      <div class="item-head">
        <div><h3 class="item-title">${escapeHtml(g.name)}</h3>${scopeTag(g.scope)}</div>
        <div><button class="icon-btn goal-edit" title="Editar">✎</button><button class="icon-btn goal-del" title="Excluir">🗑</button></div>
      </div>
      <div class="bar-line"><span class="mono">${fmtBRL(g.current)} de ${fmtBRL(g.target)}</span><span class="mono" style="font-weight:700">${fmtPct(pct)}</span></div>
      ${bar(pct, done ? COLORS.pessoal : late ? COLORS.red : COLORS.gold)}
      <div class="bar-line" style="margin-top:8px;font-size:12px;color:var(--ink-muted)"><span>Prazo: ${brDate(g.deadline)}</span><span style="color:${statusColor};font-weight:600">${statusLabel}</span></div>
    </div>`;
  }).join("");
  return `<div class="row-between"><h1 class="page-title">Objetivos futuros</h1><button class="btn gold" id="new-goal-btn">+ Novo objetivo</button></div>
    <div class="grid grid-2">${items || `<p class="empty-msg">Nenhum objetivo cadastrado.</p>`}</div>`;
}

/* ----------------------------------------------------------------------- */
/* Comissões (consórcio) — pagamento em blocos de parcela fixa             */
/* ----------------------------------------------------------------------- */
function commissionBlocks(c) {
  const p1 = c.parcelas1 != null ? c.parcelas1 : c.parcelas;
  const p2 = c.parcelas - p1;
  const v1 = c.value;
  const v2 = c.value2 != null ? c.value2 : c.value;
  return { p1, v1, p2, v2 };
}
function renderComissoes() {
  const contratos = state.txs.filter((t) => t.category === "Comissão" && t.recurrence === "parcelado");
  const rowsMes = occurrencesForMonth(state.month).filter((r) => r.tx.category === "Comissão");
  const previstoMes = rowsMes.reduce((a, r) => a + r.value, 0);
  const totalAtivo = contratos.reduce((a, c) => {
    const anchor = monthKey(c.date);
    const idx = monthsBetween(anchor, state.month);
    return a + contratoRestante(c, idx);
  }, 0);

  const cards = contratos.map((c) => {
    const anchor = monthKey(c.date);
    const idx = monthsBetween(anchor, state.month);
    const parcelaAtual = Math.min(Math.max(idx + 1, 0), c.parcelas);
    const pct = Math.max(0, Math.min(1, idx / c.parcelas));
    const status = idx >= c.parcelas ? "Contrato quitado" : idx < 0 ? "Ainda não iniciado" : `Parcela ${parcelaAtual}/${c.parcelas} este mês`;
    const { p1, v1, p2, v2 } = commissionBlocks(c);
    const blocosHtml = p2 > 0
      ? `<div>🔹 Bloco 1: ${p1} parcela${p1 === 1 ? "" : "s"} de ${fmtBRL(v1)} cada</div>
         <div>🔹 Bloco 2: ${p2} parcela${p2 === 1 ? "" : "s"} de ${fmtBRL(v2)} cada</div>`
      : `<div>🔹 ${p1} parcela${p1 === 1 ? "" : "s"} de ${fmtBRL(v1)} cada</div>`;
    const creditoNote = c.creditoValor ? ` · Carta de crédito: ${fmtBRL(c.creditoValor)}` : "";
    return `<div class="item-card" data-id="${c.id}" style="margin-bottom:14px">
      <div class="item-head">
        <div><h3 class="item-title">${escapeHtml(c.desc)}</h3><p class="item-note">${scopeTag(c.scope)} · Pagamento da Comissão — ${c.parcelas}x parcelas${creditoNote}</p></div>
        <div><button class="icon-btn comm-edit" title="Editar">✎</button><button class="icon-btn comm-del" title="Excluir">🗑</button></div>
      </div>
      <div style="font-size:13px;line-height:1.7;margin:10px 0;color:var(--ink)">
        ${blocosHtml}
        <div style="font-weight:700;margin-top:4px">Total líquido da comissão: ${fmtBRL(contratoTotal(c))}</div>
      </div>
      ${bar(pct, COLORS.gold)}
      <div class="bar-line" style="margin-top:8px;font-size:12px;color:var(--ink-muted)"><span>${status}</span><span>Início: ${monthLabel(anchor)}</span></div>
    </div>`;
  }).join("");

  return `
    <div class="row-between">
      <div><h1 class="page-title">Comissões</h1><p class="page-sub">Previsão de recebimento por mês · ${monthLabel(state.month)}</p></div>
      <div class="row-gap">${monthNav()}<button class="btn gold" id="new-comm-btn">+ Novo contrato</button></div>
    </div>
    <div class="grid grid-3" style="margin-bottom:24px">
      ${statCard("Comissão este mês", fmtBRL(previstoMes), COLORS.gold, "já soma automaticamente no saldo")}
      ${statCard("Contratos ativos", contratos.length, COLORS.ink)}
      ${statCard("Total ainda a receber", fmtBRL(totalAtivo), COLORS.pessoal)}
    </div>
    <h2 class="section-title" style="border-color:${COLORS.gold}">Contratos de consórcio</h2>
    ${cards || `<p class="empty-msg">Nenhum contrato cadastrado ainda.</p>`}
  `;
}

/* ----------------------------------------------------------------------- */
/* Assistente (baseado em regras + dados reais)                            */
/* ----------------------------------------------------------------------- */
function buildAlerts() {
  const alerts = [];
  const rows = occurrencesForMonth(state.month);
  const s = sumsFromOccurrences(rows);
  if (s.saldo < 0) alerts.push({ type: "warn", text: `Seu saldo em ${monthLabel(state.month)} está negativo: ${fmtBRL(s.saldo)}. Vale revisar os gastos do mês.` });
  const usage = cardUsage();
  state.cards.forEach((c) => {
    const pct = c.limit ? usage / c.limit : 0;
    if (pct > 0.8) alerts.push({ type: "warn", text: `O cartão ${c.name} está com ${fmtPct(pct)} do limite usado esse mês.` });
  });
  state.goals.forEach((g) => {
    const pct = g.target ? g.current / g.target : 0;
    const diasRestantes = (new Date(g.deadline) - new Date()) / 86400000;
    if (pct < 1 && diasRestantes >= 0 && diasRestantes <= 30) alerts.push({ type: "warn", text: `A meta "${g.name}" vence em breve e está em ${fmtPct(pct)}.` });
    if (pct >= 1) alerts.push({ type: "ok", text: `Meta "${g.name}" concluída! 🎉` });
  });
  const comissaoMes = occurrencesForMonth(state.month).filter((r) => r.tx.category === "Comissão").reduce((a, r) => a + r.value, 0);
  if (comissaoMes > 0) alerts.push({ type: "info", text: `Você tem ${fmtBRL(comissaoMes)} de comissão prevista para ${monthLabel(state.month)}.` });
  if (alerts.length === 0) alerts.push({ type: "ok", text: "Tudo tranquilo por aqui! Nenhum alerta no momento." });
  return alerts;
}

function answerQuestion(text) {
  const q = text.toLowerCase();
  const rows = occurrencesForMonth(state.month);
  const s = sumsFromOccurrences(rows);
  const char = getCharacter();
  if (/saldo/.test(q)) return `Seu saldo em ${monthLabel(state.month)} é ${fmtBRL(s.saldo)} (receitas ${fmtBRL(s.rec)} − despesas ${fmtBRL(s.desp)}).`;
  if (/cart[aã]o|fatura/.test(q)) { const u = cardUsage(); return `A fatura estimada dos seus cartões esse mês é de aproximadamente ${fmtBRL(u)} por cartão.`; }
  if (/comiss/.test(q)) { const c = occurrencesForMonth(state.month).filter((r) => r.tx.category === "Comissão").reduce((a, r) => a + r.value, 0); return `Você tem ${fmtBRL(c)} de comissão prevista para ${monthLabel(state.month)}.`; }
  if (/meta|objetivo/.test(q)) { const g = state.goals[0]; return g ? `Sua meta "${g.name}" está em ${fmtPct(g.current / g.target)} (${fmtBRL(g.current)} de ${fmtBRL(g.target)}).` : "Você ainda não tem metas cadastradas."; }
  if (/investir|investimento/.test(q)) return "Considere manter uma reserva de emergência antes de investir em renda variável, e revisite sua carteira a cada trimestre.";
  if (/economizar|poupar|guardar/.test(q)) return "Uma boa prática é separar um valor fixo assim que a receita entra — mesmo que pequeno, o hábito é o que conta.";
  if (/d[íi]vida/.test(q)) return "Priorize sempre a dívida com maior juros primeiro, e evite contrair novas enquanto quita as atuais.";
  const tips = char ? TIPS[char.profile] : TIPS.organizadora;
  return tips[Math.floor(Math.random() * tips.length)];
}

function renderAssistente() {
  const char = getCharacter();
  const alerts = buildAlerts();
  if (state.chatLog.length === 0 && char) {
    state.chatLog.push({ from: "bot", text: `Oi, ${escapeHtml(state.profile.name || "")}! Eu sou a assistente do ${char.name}. Pode me perguntar sobre seu saldo, cartões, metas, comissões ou pedir uma dica.` });
  }
  const msgs = state.chatLog.map((m) => `<div class="chat-msg ${m.from}">${m.text}</div>`).join("");
  return `
    <div class="row-between"><div><h1 class="page-title">Assistente</h1><p class="page-sub">Dicas e alertas baseados nos seus dados${char ? ` · estilo ${char.name}` : ""}</p></div></div>
    <div class="grid grid-2" style="align-items:start">
      <div>
        <h2 class="section-title" style="border-color:var(--char)">Conversa</h2>
        <div class="chat-box" id="chat-box">${msgs}</div>
        <div class="chat-suggestions">
          <button class="chip ask-chip" data-ask="Qual meu saldo esse mês?">Meu saldo</button>
          <button class="chip ask-chip" data-ask="Como está meu cartão?">Meu cartão</button>
          <button class="chip ask-chip" data-ask="Quanto de comissão vou receber?">Comissão do mês</button>
          <button class="chip ask-chip" data-ask="Me dá uma dica">Dica rápida</button>
        </div>
        <div class="chat-input-row">
          <input type="text" id="chat-input" placeholder="Pergunte alguma coisa..." />
          <button id="chat-send">➤</button>
        </div>
      </div>
      <div>
        <h2 class="section-title" style="border-color:${COLORS.red}">Alertas &amp; notificações</h2>
        ${alerts.map((a) => `<div class="alert-item ${a.type}">${a.type === "warn" ? "⚠️" : a.type === "ok" ? "✅" : "ℹ️"} <span>${a.text}</span></div>`).join("")}
      </div>
    </div>
  `;
}

/* ----------------------------------------------------------------------- */
/* Cadastro                                                                 */
/* ----------------------------------------------------------------------- */
function computeLevel() {
  const hasRec = state.txs.some((t) => t.type === "Receita");
  const hasDesp = state.txs.some((t) => t.type === "Despesa");
  const hasGoal = state.goals.length > 0;
  const hasBudgetDiscipline = state.txs.filter((t) => t.recurrence === "fixo").length >= 1;
  const hasInvest = state.invs.length > 0;
  const goalDone = state.goals.some((g) => g.current >= g.target);
  let level = 1;
  const checks = [hasRec, hasDesp, hasGoal, hasBudgetDiscipline, hasInvest || goalDone];
  level = 1 + checks.filter(Boolean).length;
  return Math.min(level, 5);
}
function renderCadastro() {
  const char = getCharacter();
  const level = computeLevel();
  const photo = state.profile && state.profile.photo;
  return `
    <h1 class="page-title">Meu perfil</h1>
    <p class="page-sub" style="margin-bottom:22px">Suas informações, personagem e plano</p>

    <div class="profile-header">
      ${photo ? `<img class="profile-photo" src="${photo}" />` : `<div class="profile-photo-placeholder">${(state.profile && state.profile.name ? state.profile.name[0] : "?").toUpperCase()}</div>`}
      <div>
        <h2 style="font-family:Georgia,serif;margin:0 0 4px">${escapeHtml((state.profile && state.profile.name) || "Sem nome")}</h2>
        <p style="margin:0;font-size:13px;color:var(--ink-muted)">${char ? `${char.name} · ${PROFILE_COLORS[char.profile].label}` : "Nenhum personagem escolhido"}</p>
        <span class="plan-badge ${isPremium() ? "premium" : "gratis"}">${isPremium() ? "Premium" : "Grátis"}</span>
      </div>
    </div>

    <div class="grid grid-2" style="margin-bottom:20px">
      <div class="card">
        <h2 class="section-title" style="border-color:var(--char)">Dados</h2>
        <div class="field"><label>Nome</label><input id="f-profile-name" value="${escapeHtml((state.profile && state.profile.name) || "")}" /></div>
        <div class="field"><label>Foto</label><input id="f-profile-photo" type="file" accept="image/*" /></div>
        <button class="btn char save-btn" id="save-profile-btn">Salvar dados</button>
      </div>
      <div class="card">
        <h2 class="section-title" style="border-color:${COLORS.gold}">Plano</h2>
        <p style="font-size:13px;color:var(--ink-muted);margin-top:0">${isPremium() ? "Você tem acesso completo: Investimentos, Empresa, Comissões e Assistente." : "No plano grátis, Investimentos, Empresa, Comissões e Assistente ficam bloqueados."}</p>
        <button class="btn ${isPremium() ? "ghost" : "gold"} save-btn" id="toggle-plan-btn">${isPremium() ? "Voltar para o plano Grátis" : "Ativar Premium (simulado)"}</button>
        <p style="font-size:11px;color:var(--ink-muted);margin:10px 0 0">Assinatura simulada — sem cobrança real, apenas para você ver como funciona.</p>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <h2 class="section-title" style="border-color:var(--char)">Personagem</h2>
      ${char ? `<p style="font-size:13px;color:var(--ink-muted)">${escapeHtml(char.desc)}</p>` : ""}
      <button class="btn char" id="change-char-btn">Trocar personagem</button>
    </div>

    <div class="card">
      <h2 class="section-title" style="border-color:var(--char)">Evolução</h2>
      <p style="font-size:13px;color:var(--ink-muted);margin-top:0">Nível ${level} de 5</p>
      <div class="level-track">
        ${[1,2,3,4,5].map((n) => `<div class="level-dot ${n <= level ? "done" : ""}">${n}</div>`).join("")}
      </div>
    </div>
  `;
}

/* ----------------------------------------------------------------------- */
/* Eventos da tela principal                                                */
/* ----------------------------------------------------------------------- */
function attachMainEvents() {
  document.querySelectorAll("[data-scope]").forEach((btn) => btn.addEventListener("click", () => { state.scopeFilter = btn.dataset.scope; render(); }));
  document.querySelectorAll("[data-monthdelta]").forEach((btn) => btn.addEventListener("click", () => { state.month = addMonths(state.month, parseInt(btn.dataset.monthdelta, 10)); render(); }));

  const unlockBtn = document.getElementById("unlock-premium-btn");
  if (unlockBtn) unlockBtn.addEventListener("click", () => { state.profile.plan = "premium"; saveProfile(); render(); });

  const newTxBtn = document.getElementById("new-tx-btn") || document.getElementById("new-tx-emp-btn");
  if (newTxBtn) newTxBtn.addEventListener("click", () => openTxModal(null, state.tab === "empresa" ? "Empresa" : undefined));
  document.querySelectorAll(".tx-edit").forEach((b) => b.addEventListener("click", (e) => { const id = e.target.closest("tr").dataset.id; openTxModal(state.txs.find((t) => t.id === id)); }));
  document.querySelectorAll(".tx-del").forEach((b) => b.addEventListener("click", (e) => { const id = e.target.closest("tr").dataset.id; if (confirm("Excluir este lançamento? (remove de todos os meses, se for fixo/parcelado)")) { state.txs = state.txs.filter((t) => t.id !== id); saveTxs(); render(); } }));
  document.querySelectorAll(".status-select").forEach((sel) => sel.addEventListener("change", (e) => {
    const id = e.target.dataset.id;
    const tx = state.txs.find((t) => t.id === id);
    if (!tx) return;
    tx.status = e.target.value;
    saveTxs();
    render();
  }));

  const newCardBtn = document.getElementById("new-card-btn");
  if (newCardBtn) newCardBtn.addEventListener("click", () => openCardModal(null));
  document.querySelectorAll(".card-edit").forEach((b) => b.addEventListener("click", (e) => { const id = e.target.closest(".item-card").dataset.id; openCardModal(state.cards.find((c) => c.id === id)); }));
  document.querySelectorAll(".card-del").forEach((b) => b.addEventListener("click", (e) => { const id = e.target.closest(".item-card").dataset.id; if (confirm("Excluir este cartão?")) { state.cards = state.cards.filter((c) => c.id !== id); saveCards(); render(); } }));

  const newInvBtn = document.getElementById("new-inv-btn");
  if (newInvBtn) newInvBtn.addEventListener("click", () => openInvModal(null));
  document.querySelectorAll(".inv-edit").forEach((b) => b.addEventListener("click", (e) => { const id = e.target.closest("tr").dataset.id; openInvModal(state.invs.find((i) => i.id === id)); }));
  document.querySelectorAll(".inv-del").forEach((b) => b.addEventListener("click", (e) => { const id = e.target.closest("tr").dataset.id; if (confirm("Excluir este investimento?")) { state.invs = state.invs.filter((i) => i.id !== id); saveInvs(); render(); } }));

  const newGoalBtn = document.getElementById("new-goal-btn");
  if (newGoalBtn) newGoalBtn.addEventListener("click", () => openGoalModal(null));
  document.querySelectorAll(".goal-edit").forEach((b) => b.addEventListener("click", (e) => { const id = e.target.closest(".item-card").dataset.id; openGoalModal(state.goals.find((g) => g.id === id)); }));
  document.querySelectorAll(".goal-del").forEach((b) => b.addEventListener("click", (e) => { const id = e.target.closest(".item-card").dataset.id; if (confirm("Excluir este objetivo?")) { state.goals = state.goals.filter((g) => g.id !== id); saveGoals(); render(); } }));

  const newCommBtn = document.getElementById("new-comm-btn");
  if (newCommBtn) newCommBtn.addEventListener("click", () => openCommissionModal(null));
  document.querySelectorAll(".comm-edit").forEach((b) => b.addEventListener("click", (e) => { const id = e.target.closest(".item-card").dataset.id; openCommissionModal(state.txs.find((t) => t.id === id)); }));
  document.querySelectorAll(".comm-del").forEach((b) => b.addEventListener("click", (e) => { const id = e.target.closest(".item-card").dataset.id; if (confirm("Excluir este contrato?")) { state.txs = state.txs.filter((t) => t.id !== id); saveTxs(); render(); } }));

  /* Assistente */
  const chatSend = document.getElementById("chat-send");
  const chatInput = document.getElementById("chat-input");
  const sendMsg = () => {
    if (!chatInput || !chatInput.value.trim()) return;
    const text = chatInput.value.trim();
    state.chatLog.push({ from: "user", text: escapeHtml(text) });
    state.chatLog.push({ from: "bot", text: escapeHtml(answerQuestion(text)) });
    chatInput.value = "";
    render();
    setTimeout(() => { const box = document.getElementById("chat-box"); if (box) box.scrollTop = box.scrollHeight; }, 0);
  };
  if (chatSend) chatSend.addEventListener("click", sendMsg);
  if (chatInput) chatInput.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMsg(); });
  document.querySelectorAll(".ask-chip").forEach((chip) => chip.addEventListener("click", () => {
    const text = chip.dataset.ask;
    state.chatLog.push({ from: "user", text: escapeHtml(text) });
    state.chatLog.push({ from: "bot", text: escapeHtml(answerQuestion(text)) });
    render();
  }));

  /* Cadastro */
  const saveProfileBtn = document.getElementById("save-profile-btn");
  if (saveProfileBtn) saveProfileBtn.addEventListener("click", () => {
    state.profile.name = document.getElementById("f-profile-name").value;
    saveProfile(); render();
  });
  const photoInput = document.getElementById("f-profile-photo");
  if (photoInput) photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { state.profile.photo = reader.result; saveProfile(); render(); };
    reader.readAsDataURL(file);
  });
  const togglePlanBtn = document.getElementById("toggle-plan-btn");
  if (togglePlanBtn) togglePlanBtn.addEventListener("click", () => {
    state.profile.plan = isPremium() ? "gratis" : "premium";
    saveProfile(); render();
  });
  const changeCharBtn = document.getElementById("change-char-btn");
  if (changeCharBtn) changeCharBtn.addEventListener("click", () => openCharacterPicker(true));
}

/* ----------------------------------------------------------------------- */
/* Modal genérico                                                           */
/* ----------------------------------------------------------------------- */
function closeModal() { document.getElementById("modal-root").innerHTML = ""; }
function openModal(title, bodyHtml) {
  document.getElementById("modal-root").innerHTML = `<div class="modal-overlay" id="modal-overlay"><div class="modal-box">
    <div class="modal-head"><h3 class="modal-title">${title}</h3><button class="icon-btn" id="modal-close">✕</button></div>${bodyHtml}
  </div></div>`;
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => { if (e.target.id === "modal-overlay") closeModal(); });
}
function chipGroup(name, options, selected, color) {
  return `<div class="chip-group" data-chipgroup="${name}">${options.map((o) => `<button type="button" class="chip ${o === selected ? "selected" : ""}" data-value="${o}" style="${o === selected ? `background:${color};border-color:${color}` : ""}">${o}</button>`).join("")}</div>`;
}
function wireChipGroup(name, onChange) {
  document.querySelectorAll(`[data-chipgroup="${name}"] .chip`).forEach((chip) => chip.addEventListener("click", () => onChange(chip.dataset.value)));
}

/* ---- Transação (com recorrência) ---- */
function openTxModal(existing, defaultScope) {
  const f = existing ? { ...existing } : { date: todayISO(), desc: "", type: "Despesa", category: CATEGORIAS_DESPESA[0], scope: defaultScope || "Pessoal", account: CONTAS[0], status: "Pago", value: "", recurrence: "unico", parcelas: 2 };
  const draw = () => {
    const cats = f.type === "Receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
    openModal(existing ? "Editar lançamento" : "Novo lançamento", `
      <div class="field"><label>Descrição</label><input id="f-desc" value="${escapeHtml(f.desc)}" placeholder="Ex.: Supermercado" /></div>
      <div class="field-row">
        <div class="field"><label>Data ${f.recurrence !== "unico" ? "(início)" : ""}</label><input id="f-date" type="date" value="${f.date}" /></div>
        <div class="field"><label>Valor ${f.recurrence !== "unico" ? "(por mês)" : ""} (R$)</label><input id="f-value" type="number" step="0.01" value="${f.value}" placeholder="0,00" /></div>
      </div>
      <div class="field"><label>Recorrência</label>${chipGroup("recurrence", ["unico","fixo","parcelado"].map((r) => ({unico:"Único",fixo:"Fixo (todo mês)",parcelado:"Parcelado"}[r])), {unico:"Único",fixo:"Fixo (todo mês)",parcelado:"Parcelado"}[f.recurrence], COLORS.gold)}</div>
      ${f.recurrence === "parcelado" ? `<div class="field"><label>Número de parcelas</label><input id="f-parcelas" type="number" min="2" max="60" value="${f.parcelas || 2}" /></div>` : ""}
      <div class="field"><label>Tipo</label>${chipGroup("type", ["Despesa","Receita"], f.type, f.type === "Receita" ? COLORS.pessoal : COLORS.red)}</div>
      <div class="field"><label>Escopo</label>${chipGroup("scope", ["Pessoal","Empresa"], f.scope, f.scope === "Empresa" ? COLORS.empresa : COLORS.pessoal)}</div>
      <div class="field"><label>Categoria</label>${chipGroup("category", cats, f.category, COLORS.gold)}</div>
      <div class="field"><label>Forma de pagamento</label>${chipGroup("account", CONTAS, f.account, COLORS.ink)}</div>
      <div class="field"><label>Status</label>${chipGroup("status", ["Pago","Pendente","Agendado"], f.status, COLORS.pessoal)}</div>
      <button ${!f.desc || !f.value ? "disabled" : ""} class="btn save-btn" id="f-save" style="background:${f.scope === "Empresa" ? COLORS.empresa : COLORS.pessoal}">Salvar lançamento</button>
    `);
    document.getElementById("f-desc").addEventListener("input", (e) => { f.desc = e.target.value; });
    document.getElementById("f-date").addEventListener("change", (e) => { f.date = e.target.value; });
    document.getElementById("f-value").addEventListener("input", (e) => { f.value = e.target.value; });
    const parcelasInput = document.getElementById("f-parcelas");
    if (parcelasInput) parcelasInput.addEventListener("input", (e) => { f.parcelas = e.target.value; });
    wireChipGroup("recurrence", (label) => { f.recurrence = { "Único":"unico","Fixo (todo mês)":"fixo","Parcelado":"parcelado" }[label]; draw(); });
    wireChipGroup("type", (v) => { f.type = v; f.category = v === "Receita" ? CATEGORIAS_RECEITA[0] : CATEGORIAS_DESPESA[0]; draw(); });
    wireChipGroup("scope", (v) => { f.scope = v; draw(); });
    wireChipGroup("category", (v) => { f.category = v; draw(); });
    wireChipGroup("account", (v) => { f.account = v; draw(); });
    wireChipGroup("status", (v) => { f.status = v; draw(); });
    document.getElementById("f-save").addEventListener("click", () => {
      if (!f.desc || !f.value) return;
      const data = { ...f, value: parseFloat(f.value) || 0, id: f.id || uid(), parcelas: f.recurrence === "parcelado" ? (parseInt(f.parcelas, 10) || 2) : null };
      const exists = state.txs.some((t) => t.id === data.id);
      state.txs = exists ? state.txs.map((t) => (t.id === data.id ? data : t)) : [data, ...state.txs];
      saveTxs(); closeModal(); render();
    });
  };
  draw();
}

/* ---- Cartão / Investimento / Objetivo (iguais à versão anterior) ---- */
function openCardModal(existing) {
  const f = existing ? { ...existing } : { name: "", limit: "", dueDay: "", bestDay: "" };
  openModal(existing ? "Editar cartão" : "Novo cartão", `
    <div class="field"><label>Nome do cartão</label><input id="f-name" value="${escapeHtml(f.name)}" /></div>
    <div class="field"><label>Limite (R$)</label><input id="f-limit" type="number" value="${f.limit}" /></div>
    <div class="field-row">
      <div class="field"><label>Dia de vencimento</label><input id="f-due" type="number" value="${f.dueDay}" /></div>
      <div class="field"><label>Melhor dia de compra</label><input id="f-best" type="number" value="${f.bestDay}" /></div>
    </div>
    <button class="btn save-btn pessoal" id="f-save">Salvar cartão</button>
  `);
  document.getElementById("f-save").addEventListener("click", () => {
    const name = document.getElementById("f-name").value;
    if (!name) return;
    const data = { id: f.id || uid(), name, limit: parseFloat(document.getElementById("f-limit").value) || 0, dueDay: parseInt(document.getElementById("f-due").value) || 0, bestDay: parseInt(document.getElementById("f-best").value) || 0 };
    const exists = state.cards.some((c) => c.id === data.id);
    state.cards = exists ? state.cards.map((c) => (c.id === data.id ? data : c)) : [...state.cards, data];
    saveCards(); closeModal(); render();
  });
}
function openInvModal(existing) {
  const f = existing ? { ...existing } : { name: "", type: TIPOS_INVEST[0], scope: "Pessoal", institution: "", date: todayISO(), applied: "", current: "" };
  const draw = () => {
    openModal(existing ? "Editar investimento" : "Novo investimento", `
      <div class="field"><label>Ativo / Aplicação</label><input id="f-name" value="${escapeHtml(f.name)}" /></div>
      <div class="field"><label>Tipo</label>${chipGroup("type", TIPOS_INVEST, f.type, COLORS.pessoal)}</div>
      <div class="field"><label>Escopo</label>${chipGroup("scope", ["Pessoal","Empresa"], f.scope, f.scope === "Empresa" ? COLORS.empresa : COLORS.pessoal)}</div>
      <div class="field"><label>Instituição</label><input id="f-inst" value="${escapeHtml(f.institution || "")}" /></div>
      <div class="field"><label>Data da aplicação</label><input id="f-date" type="date" value="${f.date}" /></div>
      <div class="field-row">
        <div class="field"><label>Valor aplicado (R$)</label><input id="f-applied" type="number" value="${f.applied}" /></div>
        <div class="field"><label>Valor atual (R$)</label><input id="f-current" type="number" value="${f.current}" /></div>
      </div>
      <button class="btn save-btn pessoal" id="f-save">Salvar investimento</button>
    `);
    document.getElementById("f-name").addEventListener("input", (e) => { f.name = e.target.value; });
    document.getElementById("f-inst").addEventListener("input", (e) => { f.institution = e.target.value; });
    document.getElementById("f-date").addEventListener("change", (e) => { f.date = e.target.value; });
    document.getElementById("f-applied").addEventListener("input", (e) => { f.applied = e.target.value; });
    document.getElementById("f-current").addEventListener("input", (e) => { f.current = e.target.value; });
    wireChipGroup("type", (v) => { f.type = v; draw(); });
    wireChipGroup("scope", (v) => { f.scope = v; draw(); });
    document.getElementById("f-save").addEventListener("click", () => {
      if (!f.name) return;
      const data = { ...f, applied: parseFloat(f.applied) || 0, current: parseFloat(f.current) || 0, id: f.id || uid() };
      const exists = state.invs.some((i) => i.id === data.id);
      state.invs = exists ? state.invs.map((i) => (i.id === data.id ? data : i)) : [...state.invs, data];
      saveInvs(); closeModal(); render();
    });
  };
  draw();
}
function openGoalModal(existing) {
  const f = existing ? { ...existing } : { name: "", scope: "Pessoal", target: "", current: "", deadline: "2026-12-31" };
  const draw = () => {
    openModal(existing ? "Editar objetivo" : "Novo objetivo", `
      <div class="field"><label>Objetivo</label><input id="f-name" value="${escapeHtml(f.name)}" placeholder="Ex.: Reserva de emergência" /></div>
      <div class="field"><label>Escopo</label>${chipGroup("scope", ["Pessoal","Empresa"], f.scope, f.scope === "Empresa" ? COLORS.empresa : COLORS.pessoal)}</div>
      <div class="field-row">
        <div class="field"><label>Valor meta (R$)</label><input id="f-target" type="number" value="${f.target}" /></div>
        <div class="field"><label>Valor atual (R$)</label><input id="f-current" type="number" value="${f.current}" /></div>
      </div>
      <div class="field"><label>Prazo</label><input id="f-deadline" type="date" value="${f.deadline}" /></div>
      <button class="btn save-btn gold" id="f-save">Salvar objetivo</button>
    `);
    document.getElementById("f-name").addEventListener("input", (e) => { f.name = e.target.value; });
    document.getElementById("f-target").addEventListener("input", (e) => { f.target = e.target.value; });
    document.getElementById("f-current").addEventListener("input", (e) => { f.current = e.target.value; });
    document.getElementById("f-deadline").addEventListener("change", (e) => { f.deadline = e.target.value; });
    wireChipGroup("scope", (v) => { f.scope = v; draw(); });
    document.getElementById("f-save").addEventListener("click", () => {
      if (!f.name) return;
      const data = { ...f, target: parseFloat(f.target) || 0, current: parseFloat(f.current) || 0, id: f.id || uid() };
      const exists = state.goals.some((g) => g.id === data.id);
      state.goals = exists ? state.goals.map((g) => (g.id === data.id ? data : g)) : [...state.goals, data];
      saveGoals(); closeModal(); render();
    });
  };
  draw();
}

/* ---- Contrato de comissão — só o valor da carta de crédito; parcelas calculadas ---- */
function openCommissionModal(existing) {
  const f = existing
    ? { id: existing.id, desc: existing.desc, scope: existing.scope, date: existing.date, credito: existing.creditoValor != null ? existing.creditoValor : "" }
    : { desc: "", scope: "Pessoal", credito: "", date: state.month + "-01" };

  const draw = () => {
    openModal(existing ? "Editar contrato" : "Novo contrato de comissão", `
      <div class="field"><label>Cliente / contrato</label><input id="f-cliente" value="${escapeHtml(f.desc)}" placeholder="Ex.: Consórcio — Contrato Imóvel 118" /></div>
      <div class="field"><label>Escopo</label>${chipGroup("scope", ["Pessoal","Empresa"], f.scope, f.scope === "Empresa" ? COLORS.empresa : COLORS.pessoal)}</div>
      <div class="field"><label>Valor da carta de crédito vendida</label><input id="f-credito" type="text" inputmode="numeric" value="" placeholder="R$ 0,00" /></div>
      <div class="field"><label>Mês da 1ª parcela</label><input id="f-mes" type="month" value="${monthKey(f.date)}" /></div>

      <div class="calc-preview" id="comm-preview">${commissionPreviewHtml(f.credito)}</div>
      <p style="font-size:12px;color:var(--ink-muted);margin:-6px 0 14px">O valor de cada parcela é calculado automaticamente a partir da carta de crédito, já líquido — não precisa digitar parcela por parcela.</p>

      <button class="btn save-btn gold" id="f-save">${existing ? "Salvar alterações" : "Criar contrato"}</button>
    `);

    document.getElementById("f-cliente").addEventListener("input", (e) => { f.desc = e.target.value; });
    document.getElementById("f-mes").addEventListener("change", (e) => { f.date = e.target.value + "-01"; });
    const creditoInput = document.getElementById("f-credito");
    const creditoMask = attachCurrencyMask(creditoInput, (value) => {
      f.credito = value;
      const preview = document.getElementById("comm-preview");
      if (preview) preview.innerHTML = commissionPreviewHtml(f.credito);
    });
    if (f.credito) creditoMask.setValue(f.credito);
    wireChipGroup("scope", (v) => { f.scope = v; draw(); });

    document.getElementById("f-save").addEventListener("click", () => {
      if (!f.desc || !f.credito) return;
      const credito = parseFloat(f.credito) || 0;
      const { value1, value2 } = calcComissaoParcelas(credito);
      const data = {
        id: f.id || uid(), desc: f.desc, type: "Receita", category: "Comissão", scope: f.scope,
        account: "Conta Corrente", status: "Pago", date: f.date, recurrence: "parcelado",
        parcelas: COMISSAO_PARCELAS_BLOCO1 + COMISSAO_PARCELAS_BLOCO2, parcelas1: COMISSAO_PARCELAS_BLOCO1,
        value: value1, value2, creditoValor: credito,
      };
      const exists = state.txs.some((t) => t.id === data.id);
      state.txs = exists ? state.txs.map((t) => (t.id === data.id ? data : t)) : [data, ...state.txs];
      saveTxs(); closeModal(); render();
    });
  };
  draw();
}

/* ----------------------------------------------------------------------- */
/* Onboarding — escolha de personagem                                      */
/* ----------------------------------------------------------------------- */
function renderCharacterCard(c, selectedId) {
  const colors = PROFILE_COLORS[c.profile];
  const initial = c.name[0];
  const selected = c.id === selectedId;
  return `<div class="char-card ${selected ? "selected" : ""}" data-char="${c.id}" style="--sel-color:${colors.primary};--sel-color-soft:${colors.soft}">
    <div class="char-avatar" style="background:${colors.primary}">${initial}</div>
    <p class="char-name">${c.name}</p>
    <p class="char-title">${c.title}</p>
    <p class="char-desc">${c.desc}</p>
    <span class="char-badge" style="background:${colors.soft};color:${colors.primary}">${colors.label}</span>
  </div>`;
}
function openCharacterPicker(isChange) {
  let selectedId = isChange && state.profile ? state.profile.character : null;
  const females = CHARACTERS.filter((c) => c.gender === "f");
  const males = CHARACTERS.filter((c) => c.gender === "m");
  const root = isChange ? document.getElementById("modal-root") : document.getElementById("onboarding-root");
  const draw = () => {
    const html = `
      <div class="onb-wrap">
        <div class="onb-head"><h1>Escolha seu personagem</h1><p>As dicas financeiras e a cor do painel vão acompanhar o perfil escolhido.</p></div>
        <div class="onb-groups">
          <div><p class="onb-group-title">Personagens femininas</p><div class="onb-grid">${females.map((c) => renderCharacterCard(c, selectedId)).join("")}</div></div>
          <div><p class="onb-group-title">Personagens masculinos</p><div class="onb-grid">${males.map((c) => renderCharacterCard(c, selectedId)).join("")}</div></div>
        </div>
        <div class="onb-footer">
          ${!isChange ? `<input id="onb-name" class="onb-name-input" placeholder="Como podemos te chamar?" />` : ""}
          <button class="btn char save-btn" id="onb-confirm" style="max-width:280px" ${!selectedId ? "disabled" : ""}>${isChange ? "Trocar personagem" : "Começar"}</button>
        </div>
      </div>`;
    if (isChange) { openModal("Trocar personagem", html.replace('<div class="onb-wrap">', "").replace(/<\/div>\s*$/, "")); }
    else { root.innerHTML = html; }
    root.querySelectorAll("[data-char]").forEach((card) => card.addEventListener("click", () => { selectedId = card.dataset.char; draw(); }));
    const confirmBtn = document.getElementById("onb-confirm");
    if (confirmBtn) confirmBtn.addEventListener("click", () => {
      if (!selectedId) return;
      if (isChange) {
        state.profile.character = selectedId; saveProfile(); closeModal(); render();
      } else {
        const nameInput = document.getElementById("onb-name");
        const name = nameInput ? nameInput.value.trim() : "";
        state.profile = { name: name || "Você", character: selectedId, plan: "gratis", photo: null };
        saveProfile();
        startApp();
      }
    });
  };
  draw();
}

/* ----------------------------------------------------------------------- */
/* Inicialização                                                            */
/* ----------------------------------------------------------------------- */
function startApp() {
  document.getElementById("onboarding-root").style.display = "none";
  document.getElementById("onboarding-root").innerHTML = "";
  document.getElementById("app-root").style.display = "flex";
  applyTheme();
  render();
}
if (state.profile && state.profile.character) {
  startApp();
} else {
  document.getElementById("app-root").style.display = "none";
  openCharacterPicker(false);
}
