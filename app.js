const state = {
  dashboard: null,
  detail: null,
  selectedChatId: null,
  activeView: "overview",
  adminMode: window.localStorage.getItem("konm-miniapp-admin-mode") === "1",
  roleEditorId: null,
  activityRoleEditorId: null,
  commandEditorId: null,
};

const dom = {
  sidebar: document.getElementById("sidebar"),
  homeSidebar: document.getElementById("homeSidebar"),
  homeSidebarContent: document.getElementById("homeSidebarContent"),
  adminSidebar: document.getElementById("adminSidebar"),
  mobileOverlay: document.getElementById("mobileOverlay"),
  openSidebar: document.getElementById("openSidebar"),
  refreshDashboard: document.getElementById("refreshDashboard"),
  adminModeToggle: document.getElementById("adminModeToggle"),
  saveGlobalAccess: document.getElementById("saveGlobalAccess"),
  loadingState: document.getElementById("loadingState"),
  appContent: document.getElementById("appContent"),
  heroTitle: document.getElementById("heroTitle"),
  heroSubtitle: document.getElementById("heroSubtitle"),
  metaBlock: document.getElementById("metaBlock"),
  chatSearch: document.getElementById("chatSearch"),
  chatList: document.getElementById("chatList"),
  toast: document.getElementById("toast"),
  mobileNav: document.getElementById("mobileNav"),
  panels: {
    overview: document.getElementById("panel-overview"),
    security: document.getElementById("panel-security"),
    roles: document.getElementById("panel-roles"),
    commands: document.getElementById("panel-commands"),
    rules: document.getElementById("panel-rules"),
  },
};

const ICONS = {
  menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>',
  overview: '<svg viewBox="0 0 24 24"><path d="M3 13.2 12 5l9 8.2"/><path d="M5 11.9V20h14v-8.1"/></svg>',
  security: '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 5-2.8 8.4-7 10-4.2-1.6-7-5-7-10V6l7-3z"/><path d="M9.5 12.5 11.3 14.3 14.8 10.8"/></svg>',
  roles: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7.5" r="3.5"/><path d="M21 21v-2a4 4 0 0 0-3-3.9"/><path d="M16.5 4.7a3.5 3.5 0 0 1 0 6.6"/></svg>',
  commands: '<svg viewBox="0 0 24 24"><path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="M14 5 10 19"/></svg>',
  rules: '<svg viewBox="0 0 24 24"><path d="M8 3h7l4 4v14H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/><path d="M15 3v5h5"/><path d="M10 12h6"/><path d="M10 16h6"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M7 18.5 3 21V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7z"/><path d="M8 9h8"/><path d="M8 13h5"/></svg>',
  activity: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
  filter: '<svg viewBox="0 0 24 24"><path d="M10 17a2 2 0 1 0 4 0"/><path d="M3 5h18"/><path d="M6 5l2 8h8l2-8"/><path d="M9 13h6"/></svg>',
  captcha: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
  welcome: '<svg viewBox="0 0 24 24"><path d="M4 12c0-4.4 3.6-8 8-8 2.2 0 4.1.8 5.6 2.2"/><path d="M20 4v5h-5"/><path d="M12 20c-4.4 0-8-3.6-8-8"/><path d="M4 20v-5h5"/></svg>',
  modules: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
  content: '<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/><path d="M15 3v5h5"/><path d="M9 12h6"/><path d="M9 16h4"/></svg>',
  public: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/></svg>',
  database: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/></svg>',
  blocked: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8.5 8.5 7 7"/><path d="m15.5 8.5-7 7"/></svg>',
  preview: '<svg viewBox="0 0 24 24"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  mute: '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m17 9 4 6"/><path d="m21 9-4 6"/></svg>',
  ban: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 8l8 8"/><path d="M16 8l-8 8"/></svg>',
  admin: '<svg viewBox="0 0 24 24"><path d="m12 3 7 3v5c0 5-2.8 8.4-7 10-4.2-1.6-7-5-7-10V6l7-3z"/><path d="m10 13 2-5 2 5"/><path d="M9.4 11.6h5.2"/></svg>',
};

const NAV_ITEMS = {
  overview: { icon: "overview", label: "Обзор" },
  security: { icon: "security", label: "Безопасность" },
  roles: { icon: "roles", label: "Роли и права" },
  commands: { icon: "commands", label: "Команды" },
  rules: { icon: "rules", label: "Правила" },
};

const API_BASE = String(
  window.__KONM_API_BASE__ ?? window.localStorage.getItem("konm-miniapp-api-base") ?? "",
).trim().replace(/\/+$/, "");

let toastTimer = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function svgIcon(name, className = "") {
  return `<span class="svg-icon${className ? ` ${className}` : ""}" aria-hidden="true">${ICONS[name] || ""}</span>`;
}

function iconText(name, label, className = "icon-text") {
  return `<span class="${className}">${svgIcon(name)}<span>${label}</span></span>`;
}

function decorateStaticChrome() {
  dom.openSidebar.innerHTML = svgIcon("menu");
  dom.refreshDashboard.innerHTML = `${svgIcon("activity")}<span>Обновить</span>`;
  dom.saveGlobalAccess.innerHTML = `${svgIcon("public")}<span>Сохранить доступ</span>`;

  document.querySelectorAll("#sideNav [data-nav]").forEach((button) => {
    const meta = NAV_ITEMS[button.dataset.nav];
    if (!meta) return;
    button.innerHTML = `${svgIcon(meta.icon)}<span>${meta.label}</span>`;
  });

  document.querySelectorAll("#mobileNav [data-nav]").forEach((button) => {
    const meta = NAV_ITEMS[button.dataset.nav];
    if (!meta) return;
    button.innerHTML = `${svgIcon(meta.icon)}<span>${meta.label}</span>`;
  });
}

function showToast(message, kind = "success") {
  clearTimeout(toastTimer);
  dom.toast.className = `toast ${kind}`;
  dom.toast.textContent = message;
  dom.toast.classList.remove("hidden");
  toastTimer = setTimeout(() => dom.toast.classList.add("hidden"), 3200);
}

async function request(url, options = {}) {
  const targetUrl = /^https?:\/\//.test(url) ? url : `${API_BASE}${url}`;
  const response = await fetch(targetUrl, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Сервер вернул некорректный ответ.");
  }

  if (!response.ok || !payload.ok) {
    throw new Error(payload?.error || "Запрос не выполнен.");
  }

  return payload.data;
}

function setLoading(ready) {
  dom.loadingState.classList.toggle("hidden", ready);
  dom.appContent.classList.toggle("hidden", !ready);
}

function formatDate(value) {
  if (!value) return "нет данных";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("ru-RU");
}

function asNullableNumber(value) {
  const cleaned = String(value ?? "").trim();
  if (!cleaned) return null;
  return Number(cleaned);
}

function closeSidebar() {
  dom.sidebar.classList.remove("open");
  dom.mobileOverlay.classList.add("hidden");
}

function openSidebar() {
  dom.sidebar.classList.add("open");
  dom.mobileOverlay.classList.remove("hidden");
}

function currentChat() {
  return state.detail?.chat || null;
}

function currentSummary() {
  return state.detail?.summary || null;
}

function currentModeration() {
  return state.detail?.moderation || null;
}

function currentRules() {
  return state.detail?.rules || null;
}

function currentRoles() {
  return state.detail?.roles || [];
}

function currentActivityRoles() {
  return state.detail?.activity_roles || [];
}

function currentCommands() {
  return state.detail?.custom_commands || [];
}

function statusPill(enabled) {
  return `<span class="status-pill ${enabled ? "status-on" : "status-off"}">${enabled ? "Включено" : "Выключено"}</span>`;
}

function enabledModulesCount(moderation) {
  if (!moderation) return 0;
  return [
    moderation.anti_spam.enabled,
    moderation.link_filter.enabled,
    moderation.word_filter.enabled,
    moderation.captcha.enabled,
    moderation.welcome.enabled,
  ].filter(Boolean).length;
}

function syncDashboardSummary() {
  if (!state.dashboard || !state.detail?.summary) return;
  const index = state.dashboard.chats.findIndex((chat) => chat.chat_id === state.detail.summary.chat_id);
  if (index >= 0) {
    state.dashboard.chats[index] = state.detail.summary;
  }
}

function setAdminMode(enabled) {
  state.adminMode = Boolean(enabled);
  if (!state.adminMode) {
    state.activeView = "overview";
  }
  window.localStorage.setItem("konm-miniapp-admin-mode", state.adminMode ? "1" : "0");
  updateModeChrome();
  renderSidebar();
  renderPanels();
  closeSidebar();
}

function updateModeChrome() {
  document.body.classList.toggle("admin-mode", state.adminMode);
  dom.homeSidebar.classList.toggle("hidden", state.adminMode);
  dom.adminSidebar.classList.toggle("hidden", !state.adminMode);
  dom.saveGlobalAccess.classList.toggle("hidden", !state.adminMode);
  dom.mobileNav.classList.toggle("hidden", !state.adminMode);
  dom.adminModeToggle.innerHTML = state.adminMode
    ? `${svgIcon("overview")}<span>Обычный режим</span>`
    : `${svgIcon("admin")}<span>Админка</span>`;
  dom.adminModeToggle.className = `${state.adminMode ? "secondary-button" : "accent-button"} mode-toggle-button`;
}

function updateNavigation() {
  document.querySelectorAll("[data-nav]").forEach((item) => {
    item.classList.toggle("active", item.dataset.nav === state.activeView);
  });

  for (const [name, panel] of Object.entries(dom.panels)) {
    const shouldShow = state.adminMode ? name === state.activeView : name === "overview";
    panel.classList.toggle("hidden", !shouldShow);
  }
}

function renderSidebar() {
  syncDashboardSummary();
  if (!state.dashboard) {
    dom.homeSidebarContent.innerHTML = "";
    dom.metaBlock.innerHTML = "";
    dom.chatList.innerHTML = "";
    return;
  }

  const chat = currentChat();
  const summary = currentSummary();
  const moderation = currentModeration();
  const rules = currentRules();
  const commands = currentCommands();
  const moduleCount = enabledModulesCount(moderation);

  if (chat && summary && moderation && rules) {
    dom.homeSidebarContent.innerHTML = `
      <div class="focus-card">
        <span class="brand-kicker">Выбранный чат</span>
        <div class="focus-title">${iconText("chat", escapeHtml(chat.title), "title-with-icon")}</div>
        <div class="chip-copy">ID ${chat.chat_id} • ${escapeHtml(chat.chat_type || "unknown")} • обновлено ${formatDate(summary.updated_at)}</div>
        <div class="chip-tags">
          <span class="tag">${svgIcon("roles")}ролей ${summary.counts.roles}</span>
          <span class="tag">${svgIcon("commands")}команд ${commands.length}</span>
          <span class="tag">${svgIcon("security")}модулей ${moduleCount}/5</span>
        </div>
      </div>
      <div class="meta-chip">
        <span class="brand-kicker">${iconText("overview", "Быстрый обзор")}</span>
        <strong>${moduleCount}/5</strong>
        <div class="meta-inline">Активных модулей защиты и автоматизации в этом чате.</div>
      </div>
      <div class="meta-chip">
        <span class="brand-kicker">${iconText("content", "Контент")}</span>
        <strong>${rules.has_text ? "Правила есть" : "Правила пустые"}</strong>
        <div class="meta-inline">Ролей активности: ${summary.counts.activity_roles} • Капча: ${moderation.captcha.pending_total}</div>
      </div>
      <button class="accent-button wide-button" data-toggle-admin="on" type="button">Открыть админку</button>
    `;
  } else {
    dom.homeSidebarContent.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>Чат пока не выбран</h3>
          <p>Когда бот увидит активный чат, здесь появится быстрый обзор и вход в админку.</p>
        </div>
      </div>
    `;
  }

  dom.metaBlock.innerHTML = `
    <div class="meta-chip">
      <span class="brand-kicker">${iconText("public", "Глобальный доступ")}</span>
      <strong>${state.dashboard.meta.public_access_enabled ? "Включен" : "Выключен"}</strong>
      <div class="button-row" style="margin-top:10px;">
        <label class="soft-text">
          <input id="globalAccessToggle" type="checkbox" ${state.dashboard.meta.public_access_enabled ? "checked" : ""}>
          Бот отвечает всем, а не только владельцу
        </label>
      </div>
    </div>
    <div class="meta-chip">
      <span class="brand-kicker">${iconText("database", "Чатов в базе")}</span>
      <strong>${state.dashboard.meta.total_chats}</strong>
    </div>
    <div class="meta-chip">
      <span class="brand-kicker">${iconText("blocked", "Стандартных стоп-слов")}</span>
      <strong>${state.dashboard.meta.default_blocked_terms_count}</strong>
      <div class="meta-hint">Здесь показываются чаты из локальной базы, которые доступны для редактирования в панели.</div>
    </div>
  `;

  const query = dom.chatSearch.value.trim().toLowerCase();
  const chats = state.dashboard.chats.filter((chat) => {
    const source = `${chat.title} ${chat.username || ""} ${chat.chat_id}`.toLowerCase();
    return source.includes(query);
  });

  if (!chats.length) {
    dom.chatList.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>Чаты не найдены</h3>
          <p>Измени поиск или дай боту активность в нужной группе.</p>
        </div>
      </div>
    `;
    return;
  }

  dom.chatList.innerHTML = chats
    .map((chat) => `
      <button class="chat-chip ${chat.chat_id === state.selectedChatId ? "active" : ""}" data-chat-select="${chat.chat_id}" type="button">
        <div class="chip-title">${iconText("chat", escapeHtml(chat.title), "title-with-icon")}</div>
        <div class="chip-copy">ID ${chat.chat_id} • ${escapeHtml(chat.chat_type || "unknown")}</div>
        <div class="chip-tags">
          <span class="tag">${svgIcon("roles")}ролей ${chat.counts.roles}</span>
          <span class="tag">${svgIcon("commands")}команд ${chat.counts.custom_commands}</span>
          <span class="tag">${svgIcon("captcha")}капча ${chat.counts.pending_captcha}</span>
        </div>
      </button>
    `)
    .join("");
}

function renderHeader() {
  const chat = currentChat();
  const summary = currentSummary();
  if (!chat || !summary) {
    dom.heroTitle.textContent = "Чаты не найдены";
    dom.heroSubtitle.textContent = "Добавь бота в чат, чтобы он попал в панель управления.";
    return;
  }

  const username = chat.username ? `@${chat.username}` : "без username";
  const members = chat.member_count ?? "неизвестно";
  dom.heroTitle.textContent = chat.title;
  dom.heroSubtitle.textContent = `${state.adminMode ? "Админка" : "Обычный режим"} • ID ${chat.chat_id} • ${username} • участников: ${members} • обновлено: ${formatDate(summary.updated_at)}`;
}

function quickActionCard(view, badgeClass, iconName, title, copy) {
  return `
    <button class="action-card" data-nav="${view}" type="button">
      <div class="action-card-badge ${badgeClass}">${svgIcon(iconName)}</div>
      <div class="action-card-title">${title}</div>
      <div class="action-card-copy">${copy}</div>
    </button>
  `;
}

function moduleRow(iconName, label, enabled, extra) {
  return `
    <div class="module-row">
      <div class="module-row-main">
        <div class="chip-icon">${svgIcon(iconName)}</div>
        <div>
          <div class="chip-title">${label}</div>
          <div class="chip-copy">${extra}</div>
        </div>
      </div>
      ${statusPill(enabled)}
    </div>
  `;
}

function renderOverviewHero(chat, summary, moderation, rules, commands) {
  if (state.adminMode) {
    return `
      <article class="glass-card hero-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("admin", "Центр управления", "title-with-icon")}</h3>
          <span class="pill">редактирование активно</span>
        </div>
        <p class="section-note">Админ-режим открыт. Здесь уже можно менять настройки, роли, правила и кастомные команды без кнопок в самом боте.</p>
        <div class="hero-mini-grid">
          <div class="hero-mini-card">
            <span class="brand-kicker">${iconText("security", "Защита")}</span>
            <strong>${enabledModulesCount(moderation)}/5</strong>
            <div class="chip-copy">Активных модулей безопасности и входного контроля.</div>
          </div>
          <div class="hero-mini-card">
            <span class="brand-kicker">${iconText("commands", "Команды")}</span>
            <strong>${commands.length}</strong>
            <div class="chip-copy">Кастомных ответов и триггеров доступны в чате.</div>
          </div>
          <div class="hero-mini-card">
            <span class="brand-kicker">${iconText("rules", "Правила")}</span>
            <strong>${rules.has_text ? "Есть" : "Пусто"}</strong>
            <div class="chip-copy">Текст правил и шаблоны наказаний можно менять из панели.</div>
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="glass-card hero-card">
      <div class="section-head">
        <h3 class="section-title">${iconText("overview", "Быстрый режим", "title-with-icon")}</h3>
        <span class="pill">без лишних блоков</span>
      </div>
      <p class="section-note">Обычный режим оставляет только главное по выбранному чату. Для редактирования модулей, ролей и команд открой админку одной кнопкой.</p>
      <div class="hero-cta-grid">
        <button class="accent-button wide-button" data-toggle-admin="on" type="button">Открыть админку</button>
        <button class="secondary-button wide-button" data-nav="security" type="button">Сразу к безопасности</button>
      </div>
      <div class="hero-mini-grid">
        <div class="hero-mini-card">
          <span class="brand-kicker">${iconText("chat", "Чат")}</span>
          <strong>${escapeHtml(chat.chat_type || "unknown")}</strong>
          <div class="chip-copy">${chat.username ? `@${escapeHtml(chat.username)}` : "Приватный чат без username"}</div>
        </div>
        <div class="hero-mini-card">
          <span class="brand-kicker">${iconText("roles", "Роли")}</span>
          <strong>${summary.counts.roles}</strong>
          <div class="chip-copy">Модераторские роли, доступные в чате.</div>
        </div>
        <div class="hero-mini-card">
          <span class="brand-kicker">${iconText("captcha", "Капча")}</span>
          <strong>${moderation.captcha.pending_total}</strong>
          <div class="chip-copy">Пользователей сейчас ждут подтверждение входа.</div>
        </div>
      </div>
    </article>
  `;
}

function renderOverview() {
  const chat = currentChat();
  const summary = currentSummary();
  const moderation = currentModeration();
  const rules = currentRules();
  const commands = currentCommands();
  if (!chat || !summary || !moderation || !rules) {
    dom.panels.overview.innerHTML = "";
    return;
  }

  const inviteLink = chat.invite_link || (chat.username ? `https://t.me/${chat.username}` : "Ссылка не сохранена");
  dom.panels.overview.innerHTML = `
    ${renderOverviewHero(chat, summary, moderation, rules, commands)}

    <section class="stats-grid">
      <article class="stats-card">
        <div class="stats-accent accent-blue">${svgIcon("chat")}Чат</div>
        <div class="stats-label">Всего ролей</div>
        <div class="stats-value">${summary.counts.roles}</div>
      </article>
      <article class="stats-card">
        <div class="stats-accent accent-green">${svgIcon("activity")}Активность</div>
        <div class="stats-label">Роли активности</div>
        <div class="stats-value">${summary.counts.activity_roles}</div>
      </article>
      <article class="stats-card">
        <div class="stats-accent accent-red">${svgIcon("security")}Безопасность</div>
        <div class="stats-label">Ожидают капчу</div>
        <div class="stats-value">${moderation.captcha.pending_total}</div>
      </article>
    </section>

    <section class="overview-grid">
      <article class="glass-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("activity", "Быстрые действия", "title-with-icon")}</h3>
          <span class="pill">${state.adminMode ? "настройки доступны" : "откроют админку"}</span>
        </div>
        <div class="quick-actions">
          ${quickActionCard("security", "badge-red", "security", "Безопасность", "Антиспам, ссылки, слова, капча и приветствие")}
          ${quickActionCard("commands", "badge-purple", "commands", "Команды", "Кастомные ответы и триггеры чата")}
          ${quickActionCard("roles", "badge-blue", "roles", "Роли", "Права модерации и роли активности")}
          ${quickActionCard("rules", "badge-green", "rules", "Правила", "Текст правил и шаблоны наказаний")}
          ${quickActionCard("security", "badge-yellow", "filter", "Фильтры", "Ссылки, слова и автоматические наказания")}
          ${quickActionCard("overview", "badge-blue", "overview", "Обзор", "Сводка по модулям и текущему состоянию")}
        </div>
      </article>

      <article class="glass-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("modules", "Модули", "title-with-icon")}</h3>
          <span class="pill">живое состояние</span>
        </div>
        <div class="item-stack">
          ${moduleRow("security", "Антиспам", moderation.anti_spam.enabled, `Наказание: ${moderation.anti_spam.punishment_action}`)}
          ${moduleRow("filter", "Фильтр ссылок", moderation.link_filter.enabled, `Срок: ${moderation.link_filter.punishment_duration_label}`)}
          ${moduleRow("blocked", "Фильтр слов", moderation.word_filter.enabled, `Своих слов: ${moderation.word_filter.custom_terms.length}`)}
          ${moduleRow("captcha", "Капча", moderation.captcha.enabled, `Ожидают: ${moderation.captcha.pending_total}`)}
          ${moduleRow("welcome", "Приветствие", moderation.welcome.enabled, "Работает после входа участника")}
        </div>
      </article>
    </section>

    <section class="two-col-grid">
      <article class="glass-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("public", "Подключение чата", "title-with-icon")}</h3>
          <span class="pill">${chat.username ? "public" : "private"}</span>
        </div>
        <div class="code-box">${escapeHtml(inviteLink)}</div>
        <div class="item-stack" style="margin-top:14px;">
          <div class="info-row"><span class="soft-text">Последний заход бота</span><span>${formatDate(chat.last_seen)}</span></div>
          <div class="info-row"><span class="soft-text">Тип чата</span><span>${escapeHtml(chat.chat_type || "unknown")}</span></div>
        </div>
      </article>

      <article class="glass-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("content", "Содержимое чата", "title-with-icon")}</h3>
          <span class="pill">из базы бота</span>
        </div>
        <div class="item-stack">
          <div class="mini-row"><span class="soft-text">Кастомных команд</span><strong>${commands.length}</strong></div>
          <div class="mini-row"><span class="soft-text">Текст правил</span><strong>${rules.has_text ? "есть" : "пусто"}</strong></div>
          <div class="mini-row"><span class="soft-text">Шаблонов мута</span><strong>${rules.mute_templates.length}</strong></div>
          <div class="mini-row"><span class="soft-text">Шаблонов бана</span><strong>${rules.ban_templates.length}</strong></div>
        </div>
      </article>
    </section>
  `;
}

function renderSecurity() {
  const moderation = currentModeration();
  if (!moderation) {
    dom.panels.security.innerHTML = "";
    return;
  }

  dom.panels.security.innerHTML = `
    <section class="two-col-grid">
      <form id="antispamForm" class="editor-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("security", "Антиспам", "title-with-icon")}</h3>
          <span class="pill">${moderation.anti_spam.punishment_duration_label}</span>
        </div>
        <div class="toggle-grid">
          <label class="toggle-card"><input type="checkbox" name="enabled" ${moderation.anti_spam.enabled ? "checked" : ""}> Включить модуль</label>
          <label class="toggle-card"><input type="checkbox" name="warnings_enabled" ${moderation.anti_spam.warnings_enabled ? "checked" : ""}> Использовать предупреждения</label>
        </div>
        <div class="form-grid">
          <label><span class="field-label">Лимит варнов</span><input class="text-input" type="number" name="warning_limit" min="1" max="20" value="${moderation.anti_spam.warning_limit}"></label>
          <label><span class="field-label">Наказание</span><select class="select-input" name="punishment_action"><option value="mute" ${moderation.anti_spam.punishment_action === "mute" ? "selected" : ""}>Мут</option><option value="ban" ${moderation.anti_spam.punishment_action === "ban" ? "selected" : ""}>Бан</option></select></label>
          <label><span class="field-label">Срок наказания в секундах</span><input class="text-input" type="number" name="punishment_duration_seconds" min="1" placeholder="Пусто = навсегда" value="${moderation.anti_spam.punishment_duration_seconds ?? ""}"></label>
          <label><span class="field-label">Окно проверки, сек</span><input class="text-input" type="number" name="window_seconds" min="1" max="30" value="${moderation.anti_spam.window_seconds}"></label>
          <label><span class="field-label">Схожесть, %</span><input class="text-input" type="number" name="similarity_percent" min="50" max="100" value="${moderation.anti_spam.similarity_percent}"></label>
          <label><span class="field-label">Повторов подряд</span><input class="text-input" type="number" name="repeat_threshold" min="2" max="10" value="${moderation.anti_spam.repeat_threshold}"></label>
        </div>
        <div class="button-row">
          <button class="accent-button" type="submit">Сохранить антиспам</button>
        </div>
      </form>

      <form id="linksForm" class="editor-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("filter", "Фильтр ссылок", "title-with-icon")}</h3>
          <span class="pill">${moderation.link_filter.punishment_duration_label}</span>
        </div>
        <div class="toggle-grid">
          <label class="toggle-card"><input type="checkbox" name="enabled" ${moderation.link_filter.enabled ? "checked" : ""}> Включить модуль</label>
        </div>
        <div class="form-grid">
          <label><span class="field-label">Наказание</span><select class="select-input" name="punishment_action"><option value="mute" ${moderation.link_filter.punishment_action === "mute" ? "selected" : ""}>Мут</option><option value="ban" ${moderation.link_filter.punishment_action === "ban" ? "selected" : ""}>Бан</option></select></label>
          <label><span class="field-label">Срок наказания в секундах</span><input class="text-input" type="number" name="punishment_duration_seconds" min="1" placeholder="Пусто = навсегда" value="${moderation.link_filter.punishment_duration_seconds ?? ""}"></label>
        </div>
        <div class="button-row">
          <button class="accent-button" type="submit">Сохранить фильтр ссылок</button>
        </div>
      </form>
    </section>

    <section class="two-col-grid">
      <form id="wordsForm" class="editor-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("blocked", "Фильтр слов", "title-with-icon")}</h3>
          <span class="pill">дефолтных: ${moderation.word_filter.default_terms_count}</span>
        </div>
        <div class="toggle-grid">
          <label class="toggle-card"><input type="checkbox" name="enabled" ${moderation.word_filter.enabled ? "checked" : ""}> Включить модуль</label>
        </div>
        <div class="form-grid">
          <label><span class="field-label">Наказание</span><select class="select-input" name="punishment_action"><option value="mute" ${moderation.word_filter.punishment_action === "mute" ? "selected" : ""}>Мут</option><option value="ban" ${moderation.word_filter.punishment_action === "ban" ? "selected" : ""}>Бан</option></select></label>
          <label><span class="field-label">Срок наказания в секундах</span><input class="text-input" type="number" name="punishment_duration_seconds" min="1" placeholder="Пусто = навсегда" value="${moderation.word_filter.punishment_duration_seconds ?? ""}"></label>
          <label><span class="field-label">Свои слова и фразы</span><textarea class="text-area" name="custom_terms_text" placeholder="По одной строке или через запятую">${escapeHtml(moderation.word_filter.custom_terms_text)}</textarea></label>
        </div>
        <div class="button-row">
          <button class="accent-button" type="submit">Сохранить фильтр слов</button>
        </div>
      </form>

      <form id="securityForm" class="editor-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("captcha", "Капча и приветствие", "title-with-icon")}</h3>
          <span class="pill">ожидают: ${moderation.captcha.pending_total}</span>
        </div>
        <div class="toggle-grid">
          <label class="toggle-card"><input type="checkbox" name="captcha_enabled" ${moderation.captcha.enabled ? "checked" : ""}> Капча новым участникам</label>
          <label class="toggle-card"><input type="checkbox" name="welcome_enabled" ${moderation.welcome.enabled ? "checked" : ""}> Приветствие после входа</label>
        </div>
        <div class="code-box">Если выключить капчу здесь, бот очистит pending-список и сразу начнет пропускать новых участников без решения примера.</div>
        <div class="button-row">
          <button class="accent-button" type="submit">Сохранить блок входа</button>
        </div>
      </form>
    </section>
  `;
}

function renderRoleEditor(role) {
  if (!role) {
    return `
      <div class="editor-card">
        <div class="section-head"><h3 class="section-title">${iconText("roles", "Редактор роли", "title-with-icon")}</h3></div>
        <div class="code-box">Выбери роль слева, чтобы поменять права, лимиты и позицию.</div>
      </div>
    `;
  }

  if (role.is_system) {
    return `
      <div class="editor-card">
        <div class="section-head"><h3 class="section-title">${iconText("admin", escapeHtml(role.name), "title-with-icon")}</h3><span class="pill">системная</span></div>
        <div class="code-box">Это роль владельца чата. Ее можно видеть в панели, но нельзя менять или удалять.</div>
      </div>
    `;
  }

  return `
    <form id="roleEditorForm" class="editor-card" data-role-id="${role.id}">
      <div class="section-head">
        <h3 class="section-title">${iconText("roles", escapeHtml(role.name), "title-with-icon")}</h3>
        <span class="pill">позиция ${role.position}</span>
      </div>
      <div class="form-grid">
        <label><span class="field-label">Название</span><input class="text-input" name="name" value="${escapeHtml(role.name)}"></label>
        <label><span class="field-label">Лимит мута, сек</span><input class="text-input" type="number" name="max_mute_seconds" min="1" placeholder="Пусто = навсегда" value="${role.max_mute_seconds ?? ""}"></label>
        <label><span class="field-label">Лимит бана, сек</span><input class="text-input" type="number" name="max_ban_seconds" min="1" placeholder="Пусто = навсегда" value="${role.max_ban_seconds ?? ""}"></label>
      </div>
      <div class="toggle-grid">
        <label class="toggle-card"><input type="checkbox" name="can_mute" ${role.can_mute ? "checked" : ""}> Мутить</label>
        <label class="toggle-card"><input type="checkbox" name="can_ban" ${role.can_ban ? "checked" : ""}> Банить</label>
        <label class="toggle-card"><input type="checkbox" name="can_unmute" ${role.can_unmute ? "checked" : ""}> Размучивать</label>
        <label class="toggle-card"><input type="checkbox" name="can_unban" ${role.can_unban ? "checked" : ""}> Разбанивать</label>
        <label class="toggle-card"><input type="checkbox" name="can_promote" ${role.can_promote ? "checked" : ""}> Повышать и понижать</label>
        <label class="toggle-card"><input type="checkbox" name="can_manage_roles" ${role.can_manage_roles ? "checked" : ""}> Управлять ролями</label>
      </div>
      <div class="button-row">
        <button class="accent-button" type="submit">Сохранить роль</button>
        <button class="secondary-button" data-role-move="up:${role.id}" type="button">Выше</button>
        <button class="secondary-button" data-role-move="down:${role.id}" type="button">Ниже</button>
        <button class="danger-button" data-role-delete="${role.id}" type="button">Удалить</button>
      </div>
    </form>
  `;
}

function renderActivityRoleEditor(role) {
  if (!role) {
    return `
      <div class="editor-card">
        <div class="section-head"><h3 class="section-title">${iconText("activity", "Роль активности", "title-with-icon")}</h3></div>
        <div class="code-box">Выбери роль активности, чтобы поменять название или порог сообщений.</div>
      </div>
    `;
  }

  return `
    <form id="activityRoleEditorForm" class="editor-card" data-role-id="${role.id}">
      <div class="section-head">
        <h3 class="section-title">${iconText("activity", escapeHtml(role.name), "title-with-icon")}</h3>
        <span class="pill">позиция ${role.position}</span>
      </div>
      <div class="form-grid">
        <label><span class="field-label">Название</span><input class="text-input" name="name" value="${escapeHtml(role.name)}"></label>
        <label><span class="field-label">Нужно сообщений</span><input class="text-input" type="number" name="required_messages" min="1" value="${role.required_messages}"></label>
      </div>
      <div class="button-row">
        <button class="accent-button" type="submit">Сохранить роль активности</button>
        <button class="secondary-button" data-activity-role-move="up:${role.id}" type="button">Выше</button>
        <button class="secondary-button" data-activity-role-move="down:${role.id}" type="button">Ниже</button>
        <button class="danger-button" data-activity-role-delete="${role.id}" type="button">Удалить</button>
      </div>
    </form>
  `;
}

function renderRoles() {
  const roles = currentRoles();
  const activityRoles = currentActivityRoles();
  const selectedRole = roles.find((role) => role.id === state.roleEditorId) || roles.find((role) => !role.is_system) || roles[0] || null;
  const selectedActivityRole = activityRoles.find((role) => role.id === state.activityRoleEditorId) || activityRoles[0] || null;

  if (selectedRole) state.roleEditorId = selectedRole.id;
  if (selectedActivityRole) state.activityRoleEditorId = selectedActivityRole.id;

  dom.panels.roles.innerHTML = `
    <section class="two-col-grid">
      <article class="glass-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("roles", "Модераторские роли", "title-with-icon")}</h3>
          <span class="pill">${roles.length}</span>
        </div>
        <form id="createRoleForm" class="button-row" style="margin-bottom:14px;">
          <input class="text-input" name="name" placeholder="Новая роль">
          <button class="secondary-button" type="submit">Добавить роль</button>
        </form>
        <div class="item-stack">
          ${roles.map((role) => `
            <button class="role-chip ${role.id === state.roleEditorId ? "active" : ""}" data-role-select="${role.id}" type="button">
              <div class="chip-title">${iconText("roles", escapeHtml(role.name), "title-with-icon")}</div>
              <div class="chip-copy">${role.is_system ? "Системная роль владельца" : `Мут: ${role.max_mute_label} • Бан: ${role.max_ban_label}`}</div>
            </button>
          `).join("")}
        </div>
      </article>
      ${renderRoleEditor(selectedRole)}
    </section>

    <section class="two-col-grid">
      <article class="glass-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("activity", "Роли активности", "title-with-icon")}</h3>
          <span class="pill">${activityRoles.length}</span>
        </div>
        <form id="createActivityRoleForm" class="form-grid" style="margin-bottom:14px;">
          <label><span class="field-label">Название</span><input class="text-input" name="name" placeholder="Новая роль активности"></label>
          <label><span class="field-label">Порог сообщений</span><input class="text-input" type="number" name="required_messages" min="1" value="1"></label>
          <div class="button-row"><button class="secondary-button" type="submit">Добавить роль активности</button></div>
        </form>
        <div class="item-stack">
          ${activityRoles.length ? activityRoles.map((role) => `
            <button class="role-chip ${role.id === state.activityRoleEditorId ? "active" : ""}" data-activity-role-select="${role.id}" type="button">
              <div class="chip-title">${iconText("activity", escapeHtml(role.name), "title-with-icon")}</div>
              <div class="chip-copy">Выдается от ${role.required_messages} сообщений</div>
            </button>
          `).join("") : `<div class="code-box">Роли активности еще не созданы.</div>`}
        </div>
      </article>
      ${renderActivityRoleEditor(selectedActivityRole)}
    </section>
  `;
}

function renderCommandEditor(command) {
  if (!command) {
    return `
      <div class="editor-card">
        <div class="section-head"><h3 class="section-title">${iconText("commands", "Редактор команды", "title-with-icon")}</h3></div>
        <div class="code-box">Выбери команду слева или создай новую. Текстовые команды редактируются прямо здесь. Медиа-команды остаются рабочими и правятся через бота.</div>
      </div>
    `;
  }

  return `
    <form id="commandEditorForm" class="editor-card" data-command-id="${command.id}">
      <div class="section-head">
        <h3 class="section-title">${iconText("commands", escapeHtml(command.command_display), "title-with-icon")}</h3>
        <span class="pill">${escapeHtml(command.template_kind)}</span>
      </div>
      <div class="form-grid">
        <label><span class="field-label">Триггер</span><input class="text-input" name="command_display" value="${escapeHtml(command.command_display)}" ${command.supports_web_edit ? "" : "disabled"}></label>
        <label><span class="field-label">Текст ответа</span><textarea class="text-area" name="template_text" ${command.supports_web_edit ? "" : "disabled"}>${escapeHtml(command.template_preview || "")}</textarea></label>
      </div>
      <div class="code-box">Плейсхолдеры: {name} и {username}</div>
      <div class="button-row">
        <button class="accent-button" type="submit" ${command.supports_web_edit ? "" : "disabled"}>Сохранить команду</button>
        <button class="danger-button" data-command-delete="${command.id}" type="button">Удалить</button>
      </div>
    </form>
  `;
}

function renderCommands() {
  const commands = currentCommands();
  const selectedCommand = commands.find((item) => item.id === state.commandEditorId) || commands[0] || null;
  if (selectedCommand) state.commandEditorId = selectedCommand.id;

  dom.panels.commands.innerHTML = `
    <section class="two-col-grid">
      <article class="glass-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("commands", "Кастомные команды", "title-with-icon")}</h3>
          <span class="pill">${commands.length}</span>
        </div>
        <form id="createCommandForm" class="form-grid" style="margin-bottom:14px;">
          <label><span class="field-label">Триггер</span><input class="text-input" name="command_display" placeholder="!привет или новая команда"></label>
          <label><span class="field-label">Текст ответа</span><textarea class="text-area" name="template_text" placeholder="Текст ответа команды"></textarea></label>
          <div class="button-row"><button class="secondary-button" type="submit">Добавить команду</button></div>
        </form>
        <div class="item-stack">
          ${commands.length ? commands.map((command) => `
            <button class="command-chip ${command.id === state.commandEditorId ? "active" : ""}" data-command-select="${command.id}" type="button">
              <div class="chip-title">${iconText("commands", escapeHtml(command.command_display), "title-with-icon")}</div>
              <div class="chip-copy">${escapeHtml((command.template_preview || "").slice(0, 150) || "Без текста")}</div>
            </button>
          `).join("") : `<div class="code-box">Кастомных команд пока нет.</div>`}
        </div>
      </article>
      ${renderCommandEditor(selectedCommand)}
    </section>
  `;
}

function templateList(mode, items) {
  if (!items.length) {
    return `<div class="code-box">Шаблонов пока нет.</div>`;
  }

  return items
    .map((item, index) => `
      <div class="template-chip" style="padding:14px;">
        <div class="card-head">
          <h3 class="card-title">${iconText("rules", `Правило ${escapeHtml(item.rule_key)}`, "title-with-icon")}</h3>
          <button class="danger-button" data-template-delete="${mode}:${index}" type="button">Удалить</button>
        </div>
        <div class="chip-copy">Срок: ${escapeHtml(item.duration_label)}</div>
        <div class="chip-copy">Причина: ${escapeHtml(item.reason || "без причины")}</div>
      </div>
    `)
    .join("");
}

function renderRules() {
  const rules = currentRules();
  if (!rules) {
    dom.panels.rules.innerHTML = "";
    return;
  }

  dom.panels.rules.innerHTML = `
    <section class="two-col-grid">
      <form id="rulesTextForm" class="editor-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("rules", "Текст правил", "title-with-icon")}</h3>
          <span class="pill">${rules.has_text ? "заданы" : "пусто"}</span>
        </div>
        <label><span class="field-label">Что увидят по команде !правила</span><textarea class="text-area" name="text" placeholder="Напиши правила чата">${escapeHtml(rules.text)}</textarea></label>
        <div class="button-row">
          <button class="accent-button" type="submit">Сохранить правила</button>
        </div>
      </form>

      <article class="glass-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("preview", "Предпросмотр", "title-with-icon")}</h3>
          <span class="pill">публичный текст</span>
        </div>
        <div class="code-box">${escapeHtml(rules.text || "Правила пока пустые.")}</div>
      </article>
    </section>

    <section class="two-col-grid">
      <article class="glass-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("mute", "Шаблоны мута", "title-with-icon")}</h3>
          <span class="pill">${rules.mute_templates.length}</span>
        </div>
        <form id="muteTemplateForm" class="form-grid" style="margin-bottom:14px;">
          <label><span class="field-label">Номер правила</span><input class="text-input" name="rule_key" placeholder="1 или 1.2.4"></label>
          <label><span class="field-label">Срок в секундах</span><input class="text-input" type="number" name="duration_seconds" min="1" placeholder="Пусто = навсегда"></label>
          <label><span class="field-label">Причина</span><input class="text-input" name="reason" placeholder="Причина для мута"></label>
          <div class="button-row"><button class="secondary-button" type="submit">Добавить шаблон мута</button></div>
        </form>
        <div class="item-stack">${templateList("mute", rules.mute_templates)}</div>
      </article>

      <article class="glass-card">
        <div class="section-head">
          <h3 class="section-title">${iconText("ban", "Шаблоны бана", "title-with-icon")}</h3>
          <span class="pill">${rules.ban_templates.length}</span>
        </div>
        <form id="banTemplateForm" class="form-grid" style="margin-bottom:14px;">
          <label><span class="field-label">Номер правила</span><input class="text-input" name="rule_key" placeholder="2 или 2.3"></label>
          <label><span class="field-label">Срок в секундах</span><input class="text-input" type="number" name="duration_seconds" min="1" placeholder="Пусто = навсегда"></label>
          <label><span class="field-label">Причина</span><input class="text-input" name="reason" placeholder="Причина для бана"></label>
          <div class="button-row"><button class="secondary-button" type="submit">Добавить шаблон бана</button></div>
        </form>
        <div class="item-stack">${templateList("ban", rules.ban_templates)}</div>
      </article>
    </section>
  `;
}

function renderPanels() {
  renderHeader();
  renderOverview();
  renderSecurity();
  renderRoles();
  renderCommands();
  renderRules();
  updateNavigation();
}

async function loadChat(chatId) {
  if (!chatId) return;
  state.selectedChatId = Number(chatId);
  state.detail = await request(`/api/chats/${state.selectedChatId}`);
  syncDashboardSummary();
  renderSidebar();
  renderPanels();
  setLoading(true);
}

async function loadDashboard() {
  state.dashboard = await request("/api/dashboard");
  const chats = state.dashboard.chats;
  if (!chats.length) {
    state.selectedChatId = null;
    state.detail = null;
    renderSidebar();
    renderHeader();
    setLoading(true);
    return;
  }

  if (!state.selectedChatId || !chats.some((chat) => chat.chat_id === state.selectedChatId)) {
    state.selectedChatId = chats[0].chat_id;
  }

  renderSidebar();
  await loadChat(state.selectedChatId);
}

async function saveGlobalAccess() {
  const toggle = document.getElementById("globalAccessToggle");
  state.dashboard = await request("/api/meta", {
    method: "PATCH",
    body: JSON.stringify({
      public_access_enabled: Boolean(toggle?.checked),
    }),
  });
  renderSidebar();
  showToast("Глобальный доступ обновлен.");
}

async function saveModeration(payload, message) {
  state.detail = await request(`/api/chats/${state.selectedChatId}/moderation`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  renderPanels();
  renderSidebar();
  showToast(message);
}

async function saveRules(payload, message) {
  state.detail = await request(`/api/chats/${state.selectedChatId}/rules`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  renderPanels();
  showToast(message);
}

function collectRuleTemplates(mode) {
  return [...(currentRules()?.[`${mode}_templates`] || [])].map((item) => ({
    rule_key: item.rule_key,
    duration_seconds: item.duration_seconds,
    reason: item.reason,
  }));
}

async function handleSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();

  try {
    if (form.id === "antispamForm") {
      await saveModeration({
        anti_spam: {
          enabled: form.elements.enabled.checked,
          warnings_enabled: form.elements.warnings_enabled.checked,
          warning_limit: Number(form.elements.warning_limit.value),
          punishment_action: form.elements.punishment_action.value,
          punishment_duration_seconds: asNullableNumber(form.elements.punishment_duration_seconds.value),
          window_seconds: Number(form.elements.window_seconds.value),
          similarity_percent: Number(form.elements.similarity_percent.value),
          repeat_threshold: Number(form.elements.repeat_threshold.value),
        },
      }, "Антиспам сохранен.");
      return;
    }

    if (form.id === "linksForm") {
      await saveModeration({
        link_filter: {
          enabled: form.elements.enabled.checked,
          punishment_action: form.elements.punishment_action.value,
          punishment_duration_seconds: asNullableNumber(form.elements.punishment_duration_seconds.value),
        },
      }, "Фильтр ссылок сохранен.");
      return;
    }

    if (form.id === "wordsForm") {
      await saveModeration({
        word_filter: {
          enabled: form.elements.enabled.checked,
          punishment_action: form.elements.punishment_action.value,
          punishment_duration_seconds: asNullableNumber(form.elements.punishment_duration_seconds.value),
          custom_terms_text: form.elements.custom_terms_text.value,
        },
      }, "Фильтр слов сохранен.");
      return;
    }

    if (form.id === "securityForm") {
      await saveModeration({
        captcha: { enabled: form.elements.captcha_enabled.checked },
        welcome: { enabled: form.elements.welcome_enabled.checked },
      }, "Капча и приветствие обновлены.");
      return;
    }

    if (form.id === "rulesTextForm") {
      await saveRules({
        text: form.elements.text.value,
        mute_templates: collectRuleTemplates("mute"),
        ban_templates: collectRuleTemplates("ban"),
      }, "Правила сохранены.");
      return;
    }

    if (form.id === "muteTemplateForm" || form.id === "banTemplateForm") {
      const mode = form.id === "muteTemplateForm" ? "mute" : "ban";
      const templates = collectRuleTemplates(mode);
      templates.push({
        rule_key: form.elements.rule_key.value.trim(),
        duration_seconds: asNullableNumber(form.elements.duration_seconds.value),
        reason: form.elements.reason.value.trim(),
      });
      await saveRules({
        text: currentRules().text,
        mute_templates: mode === "mute" ? templates : collectRuleTemplates("mute"),
        ban_templates: mode === "ban" ? templates : collectRuleTemplates("ban"),
      }, `Шаблон ${mode === "mute" ? "мута" : "бана"} добавлен.`);
      form.reset();
      return;
    }

    if (form.id === "createRoleForm") {
      state.detail = await request(`/api/chats/${state.selectedChatId}/roles`, {
        method: "POST",
        body: JSON.stringify({ name: form.elements.name.value }),
      });
      renderPanels();
      renderSidebar();
      form.reset();
      showToast("Роль добавлена.");
      return;
    }

    if (form.id === "roleEditorForm") {
      const roleId = form.dataset.roleId;
      state.detail = await request(`/api/chats/${state.selectedChatId}/roles/${roleId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.elements.name.value,
          max_mute_seconds: asNullableNumber(form.elements.max_mute_seconds.value),
          max_ban_seconds: asNullableNumber(form.elements.max_ban_seconds.value),
          can_mute: form.elements.can_mute.checked,
          can_ban: form.elements.can_ban.checked,
          can_unmute: form.elements.can_unmute.checked,
          can_unban: form.elements.can_unban.checked,
          can_promote: form.elements.can_promote.checked,
          can_manage_roles: form.elements.can_manage_roles.checked,
        }),
      });
      renderPanels();
      renderSidebar();
      showToast("Роль обновлена.");
      return;
    }

    if (form.id === "createActivityRoleForm") {
      state.detail = await request(`/api/chats/${state.selectedChatId}/activity-roles`, {
        method: "POST",
        body: JSON.stringify({
          name: form.elements.name.value,
          required_messages: Number(form.elements.required_messages.value),
        }),
      });
      renderPanels();
      renderSidebar();
      form.reset();
      showToast("Роль активности добавлена.");
      return;
    }

    if (form.id === "activityRoleEditorForm") {
      const roleId = form.dataset.roleId;
      state.detail = await request(`/api/chats/${state.selectedChatId}/activity-roles/${roleId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.elements.name.value,
          required_messages: Number(form.elements.required_messages.value),
        }),
      });
      renderPanels();
      renderSidebar();
      showToast("Роль активности обновлена.");
      return;
    }

    if (form.id === "createCommandForm") {
      state.detail = await request(`/api/chats/${state.selectedChatId}/custom-commands`, {
        method: "POST",
        body: JSON.stringify({
          command_display: form.elements.command_display.value,
          template_text: form.elements.template_text.value,
        }),
      });
      renderPanels();
      renderSidebar();
      form.reset();
      showToast("Команда добавлена.");
      return;
    }

    if (form.id === "commandEditorForm") {
      const commandId = form.dataset.commandId;
      state.detail = await request(`/api/chats/${state.selectedChatId}/custom-commands/${commandId}`, {
        method: "PATCH",
        body: JSON.stringify({
          command_display: form.elements.command_display.value,
          template_text: form.elements.template_text.value,
        }),
      });
      renderPanels();
      renderSidebar();
      showToast("Команда обновлена.");
    }
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function handleClick(event) {
  const target = event.target.closest("[data-nav],[data-toggle-admin],[data-chat-select],[data-role-select],[data-activity-role-select],[data-command-select],[data-template-delete],[data-role-move],[data-role-delete],[data-activity-role-move],[data-activity-role-delete],[data-command-delete]");
  if (!target) return;

  try {
    if (target.dataset.toggleAdmin) {
      setAdminMode(target.dataset.toggleAdmin !== "off");
      return;
    }

    if (target.dataset.nav) {
      if (!state.adminMode && target.dataset.nav !== "overview") {
        state.adminMode = true;
        window.localStorage.setItem("konm-miniapp-admin-mode", "1");
        updateModeChrome();
      }
      state.activeView = target.dataset.nav;
      renderPanels();
      updateNavigation();
      closeSidebar();
      return;
    }

    if (target.dataset.chatSelect) {
      await loadChat(Number(target.dataset.chatSelect));
      closeSidebar();
      return;
    }

    if (target.dataset.roleSelect) {
      state.roleEditorId = Number(target.dataset.roleSelect);
      renderRoles();
      return;
    }

    if (target.dataset.activityRoleSelect) {
      state.activityRoleEditorId = Number(target.dataset.activityRoleSelect);
      renderRoles();
      return;
    }

    if (target.dataset.commandSelect) {
      state.commandEditorId = Number(target.dataset.commandSelect);
      renderCommands();
      return;
    }

    if (target.dataset.templateDelete) {
      const [mode, indexText] = target.dataset.templateDelete.split(":");
      const index = Number(indexText);
      const templates = collectRuleTemplates(mode);
      templates.splice(index, 1);
      await saveRules({
        text: currentRules().text,
        mute_templates: mode === "mute" ? templates : collectRuleTemplates("mute"),
        ban_templates: mode === "ban" ? templates : collectRuleTemplates("ban"),
      }, "Шаблон удален.");
      return;
    }

    if (target.dataset.roleMove) {
      const [direction, roleId] = target.dataset.roleMove.split(":");
      state.detail = await request(`/api/chats/${state.selectedChatId}/roles/${roleId}/move`, {
        method: "POST",
        body: JSON.stringify({ direction }),
      });
      renderPanels();
      renderSidebar();
      showToast("Позиция роли изменена.");
      return;
    }

    if (target.dataset.roleDelete) {
      if (!window.confirm("Удалить роль?")) return;
      state.detail = await request(`/api/chats/${state.selectedChatId}/roles/${target.dataset.roleDelete}`, {
        method: "DELETE",
      });
      state.roleEditorId = null;
      renderPanels();
      renderSidebar();
      showToast("Роль удалена.");
      return;
    }

    if (target.dataset.activityRoleMove) {
      const [direction, roleId] = target.dataset.activityRoleMove.split(":");
      state.detail = await request(`/api/chats/${state.selectedChatId}/activity-roles/${roleId}/move`, {
        method: "POST",
        body: JSON.stringify({ direction }),
      });
      renderPanels();
      renderSidebar();
      showToast("Позиция роли активности изменена.");
      return;
    }

    if (target.dataset.activityRoleDelete) {
      if (!window.confirm("Удалить роль активности?")) return;
      state.detail = await request(`/api/chats/${state.selectedChatId}/activity-roles/${target.dataset.activityRoleDelete}`, {
        method: "DELETE",
      });
      state.activityRoleEditorId = null;
      renderPanels();
      renderSidebar();
      showToast("Роль активности удалена.");
      return;
    }

    if (target.dataset.commandDelete) {
      if (!window.confirm("Удалить команду?")) return;
      state.detail = await request(`/api/chats/${state.selectedChatId}/custom-commands/${target.dataset.commandDelete}`, {
        method: "DELETE",
      });
      state.commandEditorId = null;
      renderPanels();
      renderSidebar();
      showToast("Команда удалена.");
    }
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function init() {
  document.addEventListener("submit", handleSubmit);
  document.addEventListener("click", handleClick);

  decorateStaticChrome();
  dom.openSidebar.addEventListener("click", openSidebar);
  dom.mobileOverlay.addEventListener("click", closeSidebar);
  dom.chatSearch.addEventListener("input", renderSidebar);
  dom.adminModeToggle.addEventListener("click", () => setAdminMode(!state.adminMode));

  dom.refreshDashboard.addEventListener("click", async () => {
    try {
      await loadDashboard();
      showToast("Список чатов обновлен.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  dom.saveGlobalAccess.addEventListener("click", async () => {
    try {
      await saveGlobalAccess();
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  updateModeChrome();

  try {
    await loadDashboard();
  } catch (error) {
    dom.loadingState.classList.remove("hidden");
    dom.loadingState.innerHTML = `
      <div>
        <h3>Не удалось загрузить Mini App</h3>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

init();
