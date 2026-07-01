/* Password em hash SHA-256 */
const HOST_PASSWORD_HASH = "d6db2c3c05e8ad72b65a4270de7e930a5f14c5b91cb585abd0110e11ce581c31";
const STORAGE_KEY = "pg_menu_data_v1";

/* Notificação por email quando alguém entra no Host (via Formspree) */
const HOST_NOTIFY_ENDPOINT = "https://formspree.io/f/xzdljwrp";
const HOST_NOTIFY_EMAIL = "Railaher16@gmail.com";

function notifyHostAccess() {
  if (!HOST_NOTIFY_ENDPOINT || HOST_NOTIFY_ENDPOINT.includes("COLOCA_AQUI_O_TEU_ID")) {
    console.warn("Notificação de acesso ao Host não enviada: configura HOST_NOTIFY_ENDPOINT em script.js");
    return;
  }
  const dataHora = new Date().toLocaleString("pt-PT", { timeZone: "Africa/Maputo" });
  const payload = {
    _subject: "🔐 Acesso ao painel Host — Princess Garden",
    email: HOST_NOTIFY_EMAIL,
    message:
      `Alguém entrou com sucesso no painel Host do site.\n\n` +
      `Data/Hora (Maputo): ${dataHora}\n` +
      `Página: ${location.href}\n` +
      `Navegador: ${navigator.userAgent}`
  };
  fetch(HOST_NOTIFY_ENDPOINT, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {
    /* Falha silenciosa de rede — nunca deve bloquear o acesso ao Host por causa disto */
  });
}

async function sha256Hex(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0")).join("");
}

/* Dados por defeito do menu (usados na primeira visita)*/
const defaultMenuData = [
  {
    id: "entradas", name: "Entradas",
    banner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=75",
    groups: [{ title: null, items: [
      { name: "Chamussas de Carne", price: "35,00 MT" },
      { name: "Chamussas de Galinha", price: "35,00 MT" },
      { name: "Rissois de Camarão", price: "35,00 MT" },
      { name: "Rissois de Galinha", price: "35,00 MT" },
      { name: "Amofadinhas", price: "35,00 MT" },
      { name: "Apas", price: "30,00 MT" },
      { name: "Pão de Alho Simples", price: "250,00 MT" },
      { name: "Pão de Alho c/ Queijo", price: "350,00 MT" },
      { name: "Camarão Alinho", price: "600,00 MT" },
      { name: "Moelas", price: "500,00 MT" },
      { name: "Lulas Alinho", price: "500,00 MT" }
    ]}]
  },
  {
    id: "pizzas", name: "Pizzas",
    banner: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=75",
    groups: [{ title: null, items: [
      { name: "Margarita", price: "700,00 MT" },
      { name: "Galinha", price: "800,00 MT" },
      { name: "Carne", price: "800,00 MT" },
      { name: "Atum", price: "800,00 MT" },
      { name: "Palony", price: "800,00 MT" },
      { name: "4 Estações", price: "900,00 MT" },
      { name: "Camarão", price: "900,00 MT" },
      { name: "Extra Queijo", price: "+200,00 MT", note: "Adicional em qualquer pizza" }
    ]}]
  },
  {
    id: "mariscos", name: "Mariscos",
    banner: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=500&q=75",
    groups: [{ title: null, items: [
      { name: "Caranguejo Recheado", price: "1.100,00 MT" },
      { name: "Lulas na Frigideira", price: "1.100,00 MT" },
      { name: "Lagostas Grelhadas", price: "2.500,00 MT" },
      { name: "Lulas Grelhadas", price: "1.250,00 MT", note: "Batata frita, Salada, Arroz ou Vegetais" },
      { name: "Camarão Grelhado TM", price: "1.900,00 MT", note: "Batata frita, Salada, Arroz ou Vegetais" },
      { name: "Camarão Grelhado TG", price: "2.000,00 MT", note: "Batata frita, Salada, Arroz ou Vegetais" },
      { name: "Camarão Frito ao Molho de Piripiri", price: "1.500,00 MT", note: "Batata frita, Salada, Arroz" },
      { name: "Peixe Inteiro Grelhado", price: "1.300,00 MT" },
      { name: "Filete de Peixe Grelhado", price: "1.100,00 MT" }
    ]}]
  },
  {
    id: "frangos", name: "Frangos",
    banner: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=75",
    groups: [
      { title: "Molho Nando's", items: [
        { name: "1/4 Frango c/ Molho Nando's", price: "380,00 MT" },
        { name: "1/2 Frango c/ Molho Nando's", price: "500,00 MT" },
        { name: "1 Frango c/ Molho Nando's", price: "1.000,00 MT" }
      ]},
      { title: "Molho a Zambeziana (Coco)", items: [
        { name: "1/4 Frango c/ Molho Zambeziana", price: "300,00 MT" },
        { name: "1/2 Frango c/ Molho Zambeziana", price: "500,00 MT" },
        { name: "1 Frango c/ Molho Zambeziana completo", price: "900,00 MT" }
      ]},
      { title: "Tandoori", items: [
        { name: "1/4 Frango Tandoori", price: "300,00 MT" },
        { name: "1/2 Frango Tandoori", price: "500,00 MT" },
        { name: "1 Frango Tandoori completo", price: "900,00 MT" }
      ]},
      { title: "Molho da Casa", items: [
        { name: "1/4 Frango Molho da Casa", price: "300,00 MT" },
        { name: "1/2 Frango Molho da Casa", price: "500,00 MT" },
        { name: "1 Frango Molho da Casa completo", price: "900,00 MT" },
        { name: "Codornizes Grelhadas", price: "950,00 MT" }
      ]}
    ]
  },
  {
    id: "carnes", name: "Carnes",
    banner: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=75",
    groups: [
      { title: "Picanha", items: [
        { name: "Picanha", price: "1.850,00 MT", note: "Batata frita, Arroz Vegetal, Salada ou Legumes" }
      ]},
      { title: "T-Bone", items: [
        { name: "T-Bone", price: "1.250,00 MT", note: "Batata frita, Arroz Vegetal, Salada ou Legumes" }
      ]},
      { title: "Bife Grelhado", items: [
        { name: "Bife Grelhado", price: "1.200,00 MT", note: "Batata frita, Arroz Vegetal, Salada ou Legumes" },
        { name: "Bife com Natas", price: "1.200,00 MT" }
      ]}
    ]
  },
  {
    id: "espetos", name: "Espetos",
    banner: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=75",
    groups: [{ title: null, items: [
      { name: "Espeto de Frango Tandoori", price: "1.100,00 MT", note: "Batata frita, Salada, Arroz ou Xima" },
      { name: "Espeto de Frango", price: "900,00 MT", note: "Batata frita, Salada, Arroz ou Xima" },
      { name: "Espeto de Carne", price: "1.200,00 MT", note: "Batata frita, Salada, Arroz ou Xima" },
      { name: "Espeto de Camarão", price: "1.200,00 MT", note: "Batata frita, Salada ou Xima" },
      { name: "Espeto Misto c/ Camarão mais Lula", price: "1.200,00 MT" }
    ]}]
  },
  {
    id: "acomp", name: "Acompanhamentos",
    banner: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900&q=75",
    groups: [{ title: null, items: [
      { name: "1 Dose de Arroz", price: "150,00 MT" },
      { name: "1 Dose de Matapa", price: "250,00 MT" },
      { name: "1 Dose de Xima", price: "100,00 MT" },
      { name: "Apas", price: "30,00 MT" }
    ]}]
  }
];

let menuData = [];

/*Utilitários*/
function uid() {
  return "id_" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}
function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function ensureIds(data) {
  data.forEach(cat => {
    if (!cat._uid) cat._uid = uid();
    cat.groups.forEach(g => {
      if (!g._uid) g._uid = uid();
      g.items.forEach(it => { if (!it._uid) it._uid = uid(); });
    });
  });
  return data;
}
function slugify(str) {
  return String(str).toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || uid();
}

/*Persistência */
function loadMenuData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        menuData = ensureIds(parsed);
        return;
      }
    }
  } catch (e) { /* ignora e usa defaults */ }
  menuData = ensureIds(JSON.parse(JSON.stringify(defaultMenuData)));
}
function saveMenuData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menuData));
    flashSaveNote();
  } catch (e) {
    console.error("Não foi possível guardar:", e);
  }
}
function flashSaveNote() {
  const note = document.getElementById("adminSaveNote");
  if (!note) return;
  note.textContent = "Guardado ✓";
  note.classList.add("show");
  clearTimeout(flashSaveNote._t);
  flashSaveNote._t = setTimeout(() => note.classList.remove("show"), 1400);
}

/* ---------- Renderização do menu público ---------- */
function renderItemHtml(item) {
  return `<div class="item">
      <div>
        <div class="item-name">${escapeHtml(item.name)}</div>
        ${item.note ? `<div class="item-note">${escapeHtml(item.note)}</div>` : ""}
      </div>
      <div class="item-price">${escapeHtml(item.price)}</div>
    </div>`;
}
function renderGroupsHtml(groups) {
  return groups.map(g => {
    const heading = g.title ? `<div class="sub-h">${escapeHtml(g.title)}</div>` : "";
    const items = `<div class="items">${g.items.map(renderItemHtml).join("")}</div>`;
    return heading + items;
  }).join("");
}
function renderTabsAndPanels() {
  const tabsEl = document.getElementById("tabsContainer");
  const panelsEl = document.getElementById("panelsContainer");
  if (!tabsEl || !panelsEl) return;

  let tabsHtml = `<button class="tab" data-tab="tudo" onclick="showTab('tudo',this)">Tudo</button>`;
  menuData.forEach((cat, i) => {
    tabsHtml += `<button class="tab${i === 0 ? " active" : ""}" data-tab="${cat.id}" onclick="showTab('${cat.id}',this)">${escapeHtml(cat.name)}</button>`;
  });
  tabsEl.innerHTML = tabsHtml;

  let panelsHtml = `<div class="panel" id="panel-tudo">`;
  menuData.forEach(cat => {
    panelsHtml += `<div class="cat-banner">${escapeHtml(cat.name)}</div>${renderGroupsHtml(cat.groups)}`;
  });
  panelsHtml += `</div>`;

  menuData.forEach((cat, i) => {
    panelsHtml += `<div class="panel${i === 0 ? " active" : ""}" id="panel-${cat.id}">
        ${cat.banner ? `<img class="panel-banner" src="${escapeHtml(cat.banner)}" alt="${escapeHtml(cat.name)}" loading="lazy">` : ""}
        ${renderGroupsHtml(cat.groups)}
      </div>`;
  });
  panelsEl.innerHTML = panelsHtml;
}
function showTab(id, btn) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  const panel = document.getElementById("panel-" + id);
  if (panel) panel.classList.add("active");
  if (btn) btn.classList.add("active");
}

/*SISTEMA HOST — password + painel de administração*/
let hostUnlocked = false;

function openHostLogin() {
  document.getElementById("hostOverlay").classList.add("open");
  document.getElementById("hostPasswordInput").value = "";
  document.getElementById("hostError").textContent = "";
  setTimeout(() => document.getElementById("hostPasswordInput").focus(), 50);
}
function closeHostLogin() {
  document.getElementById("hostOverlay").classList.remove("open");
  leaveHostRoute();
}
async function attemptHostLogin() {
  const errorEl = document.getElementById("hostError");
  const btn = document.getElementById("hostLoginBtn");
  const val = document.getElementById("hostPasswordInput").value;
  if (!val) return;

  if (!window.crypto || !window.crypto.subtle) {
    errorEl.textContent = "Este navegador precisa de HTTPS para validar a password.";
    return;
  }

  if (btn) btn.disabled = true;
  errorEl.textContent = "";

  const enteredHash = await sha256Hex(val);

  if (enteredHash === HOST_PASSWORD_HASH) {
    hostUnlocked = true;
    notifyHostAccess();
    closeHostLogin();
    openAdminPanel();
  } else {
    errorEl.textContent = "Password incorreta. Melhor nao tentares, Nao vais conseguir.";
  }
  if (btn) btn.disabled = false;
}
function openAdminPanel() {
  renderAdminPanel();
  document.getElementById("adminOverlay").classList.add("open");
}
function closeAdminPanel() {
  document.getElementById("adminOverlay").classList.remove("open");
  leaveHostRoute();
}

/* Verifica se o URL atual é .../host (com ou sem barra final) */
function isHostRoute() {
  return /\/host\/?$/.test(location.pathname);
}
/* Ao fechar o modal/painel, volta ao URL base do site (sem alterar histórico ruidoso) */
function leaveHostRoute() {
  if (isHostRoute()) {
    history.replaceState(null, "", location.origin + "/" + location.search);
  }
}

/* ---------- helpers de busca por _uid ---------- */
function findCategory(catUid) { return menuData.find(c => c._uid === catUid); }
function findGroup(cat, groupUid) { return cat.groups.find(g => g._uid === groupUid); }
function findItem(group, itemUid) { return group.items.find(it => it._uid === itemUid); }

/* ---------- construção do HTML do painel admin ---------- */
function renderAdminPanel() {
  const root = document.getElementById("adminPanelBody");
  if (!root) return;

  let html = "";
  menuData.forEach(cat => {
    html += `<div class="cat-card" data-cat="${cat._uid}">
      <div class="cat-card-top">
        <input type="text" class="cat-name-input" value="${escapeHtml(cat.name)}" data-action="cat-name" data-cat="${cat._uid}" placeholder="Nome da categoria">
        <input type="text" value="${escapeHtml(cat.banner || "")}" data-action="cat-banner" data-cat="${cat._uid}" placeholder="URL da imagem de banner (opcional)">
        <button class="btn-danger" data-action="remove-cat" data-cat="${cat._uid}">Remover categoria</button>
      </div>`;

    cat.groups.forEach(g => {
      html += `<div class="group-block" data-group="${g._uid}">
        <div class="group-title-row">
          <input type="text" value="${escapeHtml(g.title || "")}" data-action="group-title" data-cat="${cat._uid}" data-group="${g._uid}" placeholder="Subtítulo (opcional, ex: Molho Nando's)">
          <button class="btn-danger" data-action="remove-group" data-cat="${cat._uid}" data-group="${g._uid}">Remover grupo</button>
        </div>`;

      g.items.forEach(it => {
        html += `<div class="admin-item-row" data-item="${it._uid}">
          <input type="text" class="admin-item-name" value="${escapeHtml(it.name)}" data-action="item-name" data-cat="${cat._uid}" data-group="${g._uid}" data-item="${it._uid}" placeholder="Nome do prato">
          <input type="text" class="admin-item-price" value="${escapeHtml(it.price)}" data-action="item-price" data-cat="${cat._uid}" data-group="${g._uid}" data-item="${it._uid}" placeholder="Preço, ex: 350,00 MT">
          <input type="text" class="admin-item-note" value="${escapeHtml(it.note || "")}" data-action="item-note" data-cat="${cat._uid}" data-group="${g._uid}" data-item="${it._uid}" placeholder="Nota (opcional)">
          <button class="admin-item-remove" data-action="remove-item" data-cat="${cat._uid}" data-group="${g._uid}" data-item="${it._uid}" title="Remover item">✕</button>
        </div>`;
      });

      html += `<div class="admin-add-row">
        <button class="btn-small" data-action="add-item" data-cat="${cat._uid}" data-group="${g._uid}">+ Adicionar item</button>
      </div></div>`;
    });

    html += `<div class="admin-add-row">
        <button class="btn-small" data-action="add-group" data-cat="${cat._uid}">+ Adicionar subtítulo/grupo</button>
      </div>
    </div>`;
  });

  root.innerHTML = html;
}

/* ---------- ações do painel (delegação de eventos) ---------- */
function handleAdminInput(e) {
  const t = e.target;
  const action = t.dataset.action;
  if (!action) return;

  if (action === "cat-name") {
    findCategory(t.dataset.cat).name = t.value;
  } else if (action === "cat-banner") {
    findCategory(t.dataset.cat).banner = t.value;
  } else if (action === "group-title") {
    const cat = findCategory(t.dataset.cat);
    findGroup(cat, t.dataset.group).title = t.value || null;
  } else if (action === "item-name") {
    const cat = findCategory(t.dataset.cat), g = findGroup(cat, t.dataset.group);
    findItem(g, t.dataset.item).name = t.value;
  } else if (action === "item-price") {
    const cat = findCategory(t.dataset.cat), g = findGroup(cat, t.dataset.group);
    findItem(g, t.dataset.item).price = t.value;
  } else if (action === "item-note") {
    const cat = findCategory(t.dataset.cat), g = findGroup(cat, t.dataset.group);
    findItem(g, t.dataset.item).note = t.value || undefined;
  } else {
    return;
  }
  saveMenuData();
  renderTabsAndPanels();
}

function handleAdminClick(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === "remove-cat") {
    if (!confirm("Remover esta categoria e todos os seus itens?")) return;
    menuData = menuData.filter(c => c._uid !== btn.dataset.cat);

  } else if (action === "remove-group") {
    if (!confirm("Remover este grupo/subtítulo e todos os itens dentro dele?")) return;
    const cat = findCategory(btn.dataset.cat);
    cat.groups = cat.groups.filter(g => g._uid !== btn.dataset.group);
    if (cat.groups.length === 0) cat.groups.push({ _uid: uid(), title: null, items: [] });

  } else if (action === "remove-item") {
    const cat = findCategory(btn.dataset.cat);
    const g = findGroup(cat, btn.dataset.group);
    g.items = g.items.filter(it => it._uid !== btn.dataset.item);

  } else if (action === "add-item") {
    const cat = findCategory(btn.dataset.cat);
    const g = findGroup(cat, btn.dataset.group);
    g.items.push({ _uid: uid(), name: "Novo prato", price: "0,00 MT" });

  } else if (action === "add-group") {
    const cat = findCategory(btn.dataset.cat);
    cat.groups.push({ _uid: uid(), title: "", items: [{ _uid: uid(), name: "Novo prato", price: "0,00 MT" }] });

  } else {
    return;
  }
  saveMenuData();
  renderAdminPanel();
  renderTabsAndPanels();
}

function addCategory() {
  const name = prompt("Nome da nova categoria (ex: Sobremesas):");
  if (!name) return;
  menuData.push({
    _uid: uid(),
    id: slugify(name) + "-" + Math.random().toString(36).slice(2, 5),
    name: name,
    banner: "",
    groups: [{ _uid: uid(), title: null, items: [{ _uid: uid(), name: "Novo prato", price: "0,00 MT" }] }]
  });
  saveMenuData();
  renderAdminPanel();
  renderTabsAndPanels();
}

function resetMenuData() {
  if (!confirm("Isto vai repor o menu original e apagar todas as alterações feitas no Host. Continuar?")) return;
  localStorage.removeItem(STORAGE_KEY);
  loadMenuData();
  renderAdminPanel();
  renderTabsAndPanels();
}

function exportMenuData() {
  const dataStr = JSON.stringify(menuData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "princess-garden-menu.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function lockHost() {
  hostUnlocked = false;
  closeAdminPanel();
}

/* ---------- arranque ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadMenuData();
  renderTabsAndPanels();

  const adminBody = document.getElementById("adminPanelBody");
  if (adminBody) {
    adminBody.addEventListener("input", handleAdminInput);
    adminBody.addEventListener("click", handleAdminClick);
  }

  const hostLink = document.getElementById("hostLink");
  if (hostLink) {
    hostLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (!isHostRoute()) history.pushState(null, "", location.origin + "/host");
      openHostLogin();
    });
  }

  document.getElementById("hostPasswordInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") attemptHostLogin();
  });

  // Abre automaticamente o pedido de password se o URL for .../host
  // (ex: https://princess-garden-menu.vercel.app/host)
  if (isHostRoute()) openHostLogin();

  // Proteção extra da logo (bloqueia menu de contexto/long-press mesmo sendo um DIV)
  const logo = document.querySelector(".hero-logo");
  if (logo) {
    logo.addEventListener("contextmenu", e => e.preventDefault());
    logo.addEventListener("dragstart", e => e.preventDefault());
  }
});