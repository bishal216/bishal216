/**
 * repos.js — GitHub API fetch with localStorage cache (TTL from config.js)
 *
 * Flow:
 *   1. Check localStorage for a cached payload
 *   2a. Cache is fresh (< cacheDuration mins)  → render immediately, schedule bg refresh
 *   2b. Cache is stale                         → render old data instantly → fetch in bg → update
 *   2c. No cache at all                        → show skeletons → fetch → render
 *
 * Depends on: config.js (must be loaded before this script in index.html)
 */

/* ─────────────────────────────────────────────
   Language → hex color map
───────────────────────────────────────────── */
const LANG_COLORS = {
  "JavaScript":  "#f1e05a",
  "TypeScript":  "#3178c6",
  "Python":      "#3572a5",
  "Java":        "#b07219",
  "C":           "#555555",
  "C++":         "#f34b7d",
  "Go":          "#00add8",
  "Rust":        "#dea584",
  "Ruby":        "#701516",
  "PHP":         "#4f5d95",
  "HTML":        "#e34c26",
  "CSS":         "#563d7c",
  "Shell":       "#89e051",
  "Kotlin":      "#a97bff",
  "Swift":       "#f05138",
  "Dart":        "#00b4ab",
  "LaTeX":       "#3d6117",
  "Markdown":    "#083fa1",
  "Vue":         "#41b883",
  "Svelte":      "#ff3e00",
  "default":     "#8b949e"
};

function getLangColor(lang) {
  return lang ? (LANG_COLORS[lang] || LANG_COLORS["default"]) : LANG_COLORS["default"];
}

/* ─────────────────────────────────────────────
   Relative time helper
───────────────────────────────────────────── */
function timeAgo(dateStr) {
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (days < 1)   return "today";
  if (days < 7)   return `${days}d ago`;
  if (days < 30)  return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

/* ─────────────────────────────────────────────
   localStorage cache helpers
───────────────────────────────────────────── */
const CACHE_KEY = `repo_cache_${CONFIG.github}`;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw); // { timestamp, repos }
  } catch {
    return null;
  }
}

function writeCache(repos) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      repos
    }));
  } catch {
    // localStorage quota exceeded — silently skip
  }
}

function isCacheFresh(cache) {
  if (!cache) return false;
  const ageMs = Date.now() - cache.timestamp;
  const maxMs = CONFIG.cacheDuration * 60 * 1000;
  return ageMs < maxMs;
}

function cacheAgeString(cache) {
  if (!cache) return "";
  const mins = Math.floor((Date.now() - cache.timestamp) / 60000);
  if (mins < 1)   return "updated just now";
  if (mins === 1) return "updated 1 min ago";
  return `updated ${mins} min ago`;
}

/* ─────────────────────────────────────────────
   GitHub API fetch + normalize
───────────────────────────────────────────── */
async function fetchFromGitHub() {
  const { github, token, display } = CONFIG;
  const perPage = Math.min(display.maxRepos, 100);
  const url = `https://api.github.com/users/${github}/repos?per_page=${perPage}&sort=${display.sortBy}&type=owner`;

  const headers = { "Accept": "application/vnd.github+json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { headers });

  if (res.status === 403) {
    const reset = res.headers.get("X-RateLimit-Reset");
    const resetTime = reset ? new Date(reset * 1000).toLocaleTimeString() : "soon";
    throw new Error(`rate_limit:${resetTime}`);
  }
  if (res.status === 404) throw new Error(`not_found:${github}`);
  if (!res.ok)            throw new Error(`http_error:${res.status}`);

  const raw = await res.json();

  return raw
    .filter(r => {
      if (CONFIG.exclude.includes(r.name))            return false;
      if (!CONFIG.display.showForks    && r.fork)     return false;
      if (!CONFIG.display.showArchived && r.archived) return false;
      return true;
    })
    .map(r => ({
      name:        r.name,
      description: r.description || "",
      url:         r.html_url,
      language:    r.language || "Unknown",
      tags:        r.topics   || [],
      stars:       r.stargazers_count,
      forks:       r.forks_count,
      updated:     r.pushed_at || r.updated_at,
      pinned:      CONFIG.pinned.includes(r.name),
      archived:    r.archived,
      fork:        r.fork
    }));
}

/* ─────────────────────────────────────────────
   Sort repos: pinned first, then by config sort
───────────────────────────────────────────── */
function sortRepos(repos) {
  return [...repos].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (CONFIG.display.sortBy === "stars") return b.stars - a.stars;
    if (CONFIG.display.sortBy === "name")  return a.name.localeCompare(b.name);
    return new Date(b.updated) - new Date(a.updated);
  });
}

/* ─────────────────────────────────────────────
   Build a single card HTML string
───────────────────────────────────────────── */
function buildCard(repo) {
  const color    = getLangColor(repo.language);
  const pinHtml  = repo.pinned
    ? `<div class="card-pin-badge"><i class="fas fa-thumbtack"></i> pinned</div>`
    : "";
  const tagsHtml = repo.tags.length
    ? `<div class="card-tags">${repo.tags.map(t => `<span class="card-tag">${t}</span>`).join("")}</div>`
    : "";
  const archivedBadge = repo.archived
    ? `<span class="card-badge-archived">archived</span>`
    : "";

  return `
    <div class="repo-card ${repo.pinned ? "pinned" : ""}"
         data-name="${repo.name.toLowerCase()}"
         data-lang="${repo.language}"
         data-pinned="${repo.pinned ? 1 : 0}">
      ${pinHtml}
      <div class="card-header">
        <i class="fas fa-folder card-icon"></i>
        <a class="card-name" href="${repo.url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
        ${archivedBadge}
      </div>
      ${repo.description ? `<p class="card-desc">${repo.description}</p>` : ""}
      ${tagsHtml}
      <div class="card-stats">
        <span class="card-stat">
          <span class="lang-dot" style="background:${color}"></span>
          ${repo.language}
        </span>
        <span class="card-stat">
          <i class="fas fa-star" style="color:#ffb347"></i>
          ${repo.stars.toLocaleString()}
        </span>
        <span class="card-stat">
          <i class="fas fa-code-branch" style="color:#4a9eff"></i>
          ${repo.forks.toLocaleString()}
        </span>
        <span class="card-stat card-stat-push">
          <i class="fas fa-clock" style="color:#6b7a8d"></i>
          ${timeAgo(repo.updated)}
        </span>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────────
   Skeleton loading cards
───────────────────────────────────────────── */
function showSkeletons(count = 6) {
  const grid = document.getElementById("repoGrid");
  if (!grid) return;
  Array.from(grid.querySelectorAll(".repo-card, .repo-skeleton")).forEach(c => c.remove());

  for (let i = 0; i < count; i++) {
    const sk = document.createElement("div");
    sk.className = "repo-skeleton";
    sk.innerHTML = `
      <div class="sk-line sk-title"></div>
      <div class="sk-line sk-desc"></div>
      <div class="sk-line sk-desc sk-short"></div>
      <div class="sk-line sk-tags"></div>
      <div class="sk-stats-row">
        <div class="sk-line sk-stat"></div>
        <div class="sk-line sk-stat"></div>
      </div>`;
    grid.insertBefore(sk, document.getElementById("noResults"));
  }
}

function removeSkeletons() {
  document.querySelectorAll(".repo-skeleton").forEach(s => s.remove());
}

/* ─────────────────────────────────────────────
   Render cards + rebuild pills + update stats
───────────────────────────────────────────── */
function renderCards(repos) {
  const grid = document.getElementById("repoGrid");
  if (!grid) return;

  removeSkeletons();
  Array.from(grid.querySelectorAll(".repo-card")).forEach(c => c.remove());

  sortRepos(repos).forEach((repo, i) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = buildCard(repo);
    const card = wrapper.firstElementChild;
    card.style.animationDelay = `${i * 0.04}s`;
    grid.insertBefore(card, document.getElementById("noResults"));
  });

  applyFilters();
  buildFilterPills(repos);
  populateHeroStats(repos);
  updateMetaBar();
}

/* ─────────────────────────────────────────────
   Error display
───────────────────────────────────────────── */
function showError(type, detail) {
  removeSkeletons();
  const no = document.getElementById("noResults");
  if (!no) return;

  const msgs = {
    rate_limit: `GitHub rate limit reached. Resets at ${detail}.`,
    not_found:  `GitHub user "${detail}" not found — check config.js.`,
    http_error: `GitHub API returned error ${detail}.`,
    network:    "Network error — check your internet connection."
  };

  no.innerHTML = `
    <span class="no-results-icon">!</span>
    <p>${msgs[type] || "Unknown error."}</p>
    <button class="btn-terminal btn-ghost" id="retryBtn" style="margin-top:16px;font-size:12px">
      <span class="btn-bracket">[</span>./retry<span class="btn-bracket">]</span>
    </button>`;
  no.style.display = "block";

  document.getElementById("retryBtn")?.addEventListener("click", () => {
    no.style.display = "none";
    initRepos(true);
  });
}

function parseAndHandleError(err) {
  const msg = err.message || "";
  if      (msg.startsWith("rate_limit:")) showError("rate_limit", msg.slice(11));
  else if (msg.startsWith("not_found:"))  showError("not_found",  msg.slice(10));
  else if (msg.startsWith("http_error:")) showError("http_error", msg.slice(11));
  else                                    showError("network",    "");
}

/* ─────────────────────────────────────────────
   Status dot + cache age in meta bar
───────────────────────────────────────────── */
function setStatusIndicator(state) {
  const el = document.getElementById("syncStatus");
  if (!el) return;
  const map = {
    loading: ["#6b7a8d", "fetching..."],
    syncing: ["#ffb347", "syncing..."],
    live:    ["#00ff88", "live"],
    stale:   ["#ffb347", "cached"],
    error:   ["#ff5f56", "error"]
  };
  const [color, label] = map[state] || map.live;
  el.innerHTML = `<span class="status-dot" style="background:${color}"></span>${label}`;
}

function updateMetaBar() {
  const el = document.getElementById("cacheAge");
  if (el) el.textContent = cacheAgeString(readCache());
}

/* ─────────────────────────────────────────────
   Hero stats counter animation
───────────────────────────────────────────── */
function populateHeroStats(repos) {
  const animateCount = (id, target) => {
    const el = document.getElementById(id);
    if (!el) return;
    let curr = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const t = setInterval(() => {
      curr = Math.min(curr + step, target);
      el.textContent = curr.toLocaleString();
      if (curr >= target) clearInterval(t);
    }, 30);
  };
  animateCount("statRepos", repos.length);
  animateCount("statStars", repos.reduce((s, r) => s + r.stars, 0));
  animateCount("statLangs", new Set(repos.map(r => r.language)).size);
}

/* ─────────────────────────────────────────────
   Build language filter pills from actual data
───────────────────────────────────────────── */
function buildFilterPills(repos) {
  const container = document.getElementById("filterPills");
  if (!container) return;

  // Remove dynamic pills, keep "all"
  Array.from(container.querySelectorAll(".filter-pill:not([data-lang='all'])")).forEach(p => p.remove());

  [...new Set(repos.map(r => r.language))].sort().forEach(lang => {
    const btn = document.createElement("button");
    btn.className = "filter-pill";
    btn.dataset.lang = lang;
    btn.innerHTML = `<span class="lang-dot" style="background:${getLangColor(lang)}"></span>${lang}`;
    container.appendChild(btn);
  });
}

/* ─────────────────────────────────────────────
   Filter / search state
───────────────────────────────────────────── */
let activeLang  = "all";
let pinnedOnly  = false;
let searchQuery = "";

function applyFilters() {
  const cards = document.querySelectorAll(".repo-card");
  const no    = document.getElementById("noResults");
  let visible = 0;

  cards.forEach(card => {
    const show =
      (activeLang === "all" || card.dataset.lang === activeLang) &&
      card.dataset.name.includes(searchQuery.toLowerCase()) &&
      (!pinnedOnly || card.dataset.pinned === "1");
    card.classList.toggle("hidden", !show);
    if (show) visible++;
  });

  const countEl = document.getElementById("visibleCount");
  if (countEl) countEl.textContent = visible;
  if (no) no.style.display = visible === 0 ? "block" : "none";
}

/* ─────────────────────────────────────────────
   Schedule auto-refresh when current cache expires
───────────────────────────────────────────── */
function scheduleCacheRefresh(cache) {
  const remaining = Math.max(0,
    CONFIG.cacheDuration * 60 * 1000 - (Date.now() - cache.timestamp)
  );
  setTimeout(async () => {
    setStatusIndicator("syncing");
    try {
      const fresh = await fetchFromGitHub();
      writeCache(fresh);
      renderCards(fresh);
      setStatusIndicator("live");
      scheduleCacheRefresh(readCache()); // reschedule for next cycle
    } catch {
      setStatusIndicator("stale");
    }
  }, remaining);
}

/* ─────────────────────────────────────────────
   Main init
───────────────────────────────────────────── */
async function initRepos(forceRefresh = false) {
  const cache = readCache();

  if (!forceRefresh && isCacheFresh(cache)) {
    // ✅ Fresh — render from cache, schedule bg refresh when it expires
    renderCards(cache.repos);
    setStatusIndicator("live");
    scheduleCacheRefresh(cache);
    return;
  }

  if (!forceRefresh && cache) {
    // ⚠️ Stale — show old data instantly, then silently update in background
    renderCards(cache.repos);
    setStatusIndicator("syncing");
    try {
      const fresh = await fetchFromGitHub();
      writeCache(fresh);
      renderCards(fresh);
      setStatusIndicator("live");
      scheduleCacheRefresh(readCache());
    } catch (err) {
      setStatusIndicator("stale");
      console.warn("Background refresh failed, showing stale cache:", err.message);
    }
    return;
  }

  // ❌ No cache — skeletons → fetch → render
  showSkeletons(6);
  setStatusIndicator("loading");
  try {
    const repos = await fetchFromGitHub();
    writeCache(repos);
    renderCards(repos);
    setStatusIndicator("live");
    scheduleCacheRefresh(readCache());
  } catch (err) {
    parseAndHandleError(err);
    setStatusIndicator("error");
  }
}

/* ─────────────────────────────────────────────
   Event bindings
───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initRepos();

  document.getElementById("filterPills")?.addEventListener("click", e => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;
    document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    activeLang = pill.dataset.lang;
    applyFilters();
  });

  document.getElementById("repoSearch")?.addEventListener("input", function () {
    searchQuery = this.value.trim();
    applyFilters();
  });

  document.getElementById("pinnedToggle")?.addEventListener("click", function () {
    pinnedOnly = !pinnedOnly;
    this.classList.toggle("active", pinnedOnly);
    applyFilters();
  });

  // Manual force-refresh
  document.getElementById("refreshBtn")?.addEventListener("click", () => {
    localStorage.removeItem(CACHE_KEY);
    initRepos(true);
  });
});