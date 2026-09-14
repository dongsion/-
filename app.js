const STORAGE_KEY = "cup-sleeve-archive-v2";
const FAVORITES_KEY = "cup-sleeve-favorites-v2";

const defaultSleeves = [];

const state = {
  sleeves: load(STORAGE_KEY, defaultSleeves),
  favorites: load(FAVORITES_KEY, []),
  view: "homeView",
  brand: "全部品牌",
  pendingBrand: "全部品牌",
  search: "",
  imageData: ""
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
function load(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } }
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
function formatDate(value) { if (!value) return ""; return value.replaceAll("-", "."); }

function artSvg(item) {
  const [a, b, c] = item.colors || ["#69a5c9", "#f1c83c", "#f3c6cf"];
  const shapes = {
    characters: `<circle cx="80" cy="62" r="25" fill="${b}"/><circle cx="119" cy="65" r="25" fill="${c}"/><path d="M55 91q36-22 90 0l-7 22H61Z" fill="${a}"/><circle cx="72" cy="62" r="4" fill="#4b3b37"/><circle cx="129" cy="64" r="4" fill="#4b3b37"/><path d="M45 109h110" stroke="#fff" stroke-width="4" opacity=".8"/>`,
    cat: `<path d="M51 45l17 8q28-20 58 0l19-9-2 35q-8 34-43 34T56 79Z" fill="${a}"/><path d="M65 69q22 15 46 0" stroke="${b}" stroke-width="7" fill="none"/><path d="M83 63h4m18 0h4" stroke="#4b3b37" stroke-width="4" stroke-linecap="round"/><path d="M78 83q10 7 20 0" stroke="#4b3b37" stroke-width="3" fill="none"/>`,
    dog: `<path d="M50 42l19 9q29-16 60 2l17-13-1 55q-35 26-91 0Z" fill="${a}"/><path d="M73 52q-7 25 15 29 30 6 28-28" fill="${c}"/><circle cx="88" cy="67" r="4" fill="#333"/><circle cx="105" cy="67" r="4" fill="#333"/><path d="M91 79q6 7 12 0" stroke="#333" stroke-width="3" fill="none"/>`,
    bear: `<path d="M60 45q-4-24 14-24 11 1 12 12 12-10 25-12 16 0 11 24 13 12 9 40-23 22-49 0-1-28 10-40Z" fill="${a}"/><circle cx="84" cy="69" r="4"/><circle cx="111" cy="69" r="4"/><ellipse cx="98" cy="80" rx="9" ry="6" fill="${b}"/>`,
    tennis: `<path d="M39 51q59-26 122 0l-12 58q-49 17-99 0Z" fill="${a}"/><circle cx="99" cy="78" r="26" fill="${b}"/><path d="M80 62q24 9 38 31M79 92q21-14 42-25" stroke="#fff" stroke-width="3" fill="none"/><path d="M60 111h76" stroke="${c}" stroke-width="6"/>`,
    city: `<path d="M43 106V70h15V55h16v51H43Zm49 0V42h18v64H92Zm30 0V62h18v44h-18Z" fill="${b}"/><path d="M34 110h132" stroke="${c}" stroke-width="9"/><circle cx="80" cy="34" r="10" fill="${a}"/>`,
    tea: `<path d="M58 42h76v41q0 30-38 30T58 83Z" fill="${a}"/><path d="M134 58h10q16 0 16 15t-16 15h-10" fill="none" stroke="${b}" stroke-width="8"/><path d="M79 36q-4-13 5-18m15 18q-4-13 5-18" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`
  };
  return `<svg class="art" viewBox="0 0 198 140" role="img" aria-label="${escapeHtml(item.name)}"><path d="M31 40Q99 22 167 40l-7 73q-61 18-122 0Z" fill="${a}" opacity=".16"/><path d="M40 42q59-18 118 0l-6 70q-55 14-106 0Z" fill="#fff" opacity=".9"/>${shapes[item.kind] || shapes.characters}<path d="M47 116q50 13 104 0" stroke="#7c7770" stroke-width="2" opacity=".35" fill="none"/></svg>`;
}

function filteredSleeves() {
  return state.sleeves.filter((item) => {
    const brandMatch = state.brand === "全部品牌" || item.brand === state.brand;
    const query = state.search.trim().toLowerCase();
    const searchMatch = !query || `${item.name} ${item.brand} ${item.enBrand}`.toLowerCase().includes(query);
    return brandMatch && searchMatch;
  });
}

function renderHome() {
  const list = filteredSleeves();
  $("#totalCount").textContent = state.sleeves.length;
  $(".home-intro h1").innerHTML = state.sleeves.length ? `把喜欢的杯套，<br /><em>好好收藏。</em>` : `从第一只杯套，<br /><em>开始收藏。</em>`;
  $("#activeFilter").hidden = state.brand === "全部品牌";
  $("#activeFilter").textContent = `当前筛选：${state.brand}  ×`;
  const groups = [...new Set(list.map((item) => item.brand))];
  if (!list.length) { $("#collectionList").innerHTML = `<div class="empty-state"><div class="empty-heart">♡</div><p>没有找到匹配的杯套</p><button class="primary-button" id="resetSearch">看看全部收藏</button></div>`; $("#resetSearch").onclick = () => { state.brand = "全部品牌"; state.search = ""; $("#searchInput").value = ""; renderHome(); }; return; }
  $("#collectionList").innerHTML = groups.map((brand) => {
    const items = list.filter((item) => item.brand === brand);
    const en = items[0]?.enBrand || "";
    return `<section class="brand-section"><div class="brand-heading"><div><h2>${escapeHtml(brand)}</h2><p>${escapeHtml(en)}</p></div><span class="count">${items.length} 件</span></div><div class="sleeve-grid">${items.map(cardHtml).join("")}</div></section>`;
  }).join("");
  $$(".sleeve-card").forEach((card) => card.addEventListener("click", (event) => { if (!event.target.closest(".favorite-toggle")) openDetail(card.dataset.id); }));
  $$(".favorite-toggle").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); toggleFavorite(button.dataset.id); }));
}

function visualHtml(item) { return item.image ? `<img class="art custom-art" src="${item.image}" alt="${escapeHtml(item.name)}" />` : artSvg(item); }
function cardHtml(item) { const saved = state.favorites.includes(item.id); return `<article class="sleeve-card" data-id="${escapeHtml(item.id)}"><div class="art-wrap ${item.image ? "photo-board" : ""}" style="background: ${item.image ? "#f1f0eb" : `linear-gradient(135deg, ${item.colors[0]}18, #eeefef 65%)`}">${visualHtml(item)}<button class="favorite-toggle ${saved ? "saved" : ""}" data-id="${escapeHtml(item.id)}" aria-label="${saved ? "取消收藏" : "收藏"}">${saved ? "♥" : "♡"}</button></div><div class="card-body"><h3>${escapeHtml(item.name)}</h3><div class="card-meta"><span class="tag ${item.tag === "常规款" ? "normal" : ""}">${escapeHtml(item.tag)}</span><span>${escapeHtml(item.date)}</span></div></div></article>`; }

function renderFavorites() { const items = state.sleeves.filter((item) => state.favorites.includes(item.id)); $("#favoriteCount").textContent = items.length; $("#favoritesList").innerHTML = items.length ? `<div class="sleeve-grid">${items.map(cardHtml).join("")}</div>` : `<div class="empty-state"><div class="empty-heart">♡</div><p>还没有收藏的杯套</p><button class="primary-button" id="goHomeButton">去首页逛逛</button></div>`; $$("#favoritesList .sleeve-card").forEach((card) => card.addEventListener("click", (event) => { if (!event.target.closest(".favorite-toggle")) openDetail(card.dataset.id); })); $$("#favoritesList .favorite-toggle").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); toggleFavorite(button.dataset.id); })); $("#goHomeButton")?.addEventListener("click", () => switchView("homeView")); }

function renderRanking() { const own = state.sleeves.filter((item) => item.custom).length; $("#profileStats").textContent = `已收藏 ${state.favorites.length} 件 · 上传 ${own} 件`; const ranks = own ? [{ name: "我的收藏", desc: "本地档案", count: own, mark: "藏" }] : []; $("#rankingList").innerHTML = ranks.length ? ranks.map((rank, index) => `<div class="rank-row"><div class="rank-no ${index < 3 ? "top" : ""}">${index + 1}</div><div class="profile-avatar" style="width:34px;height:34px;border-radius:10px;font-size:12px;background:var(--navy);color:white">${rank.mark}</div><div class="rank-name"><strong>${rank.name}</strong><span>${rank.desc}</span></div><div class="rank-count">${rank.count}</div></div>`).join("") : `<div class="ranking-empty"><strong>0</strong><span>暂时还没有贡献者</span><small>上传第一只杯套，就能出现在这里</small></div>`; }

function switchView(viewId) { state.view = viewId; $$(".view").forEach((view) => view.classList.toggle("active", view.id === viewId)); $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === viewId)); if (viewId === "homeView") renderHome(); if (viewId === "favoritesView") renderFavorites(); if (viewId === "rankingView") renderRanking(); window.scrollTo({ top: 0, behavior: "smooth" }); }
function toggleFavorite(id) { const index = state.favorites.indexOf(id); if (index >= 0) { state.favorites.splice(index, 1); showToast("已取消收藏"); } else { state.favorites.push(id); showToast("已加入收藏"); } save(FAVORITES_KEY, state.favorites); renderHome(); if (state.view === "favoritesView") renderFavorites(); }
function openDetail(id) { const item = state.sleeves.find((entry) => entry.id === id); if (!item) return; const deleteButton = item.custom ? `<button class="detail-delete" id="detailDelete">删除这只杯套</button>` : ""; $("#detailContent").innerHTML = `<div class="detail-art ${item.image ? "photo-board" : ""}" style="background:${item.image ? "#f1f0eb" : `linear-gradient(135deg, ${item.colors[0]}25, #eeefef)`}">${visualHtml(item)}</div><div class="detail-body"><span class="tag ${item.tag === "常规款" ? "normal" : ""}">${escapeHtml(item.tag)}</span><h2>${escapeHtml(item.name)}</h2><span class="detail-brand">${escapeHtml(item.brand)} · ${escapeHtml(item.enBrand || "")}</span><p>${escapeHtml(item.story || "这枚杯套还没有故事，等你来补充。")}</p><div class="detail-date">发行时间 · ${escapeHtml(item.date)}</div>${deleteButton}</div>`; $("#detailModal").hidden = false; $("#detailDelete")?.addEventListener("click", () => deleteSleeve(item.id)); }
function deleteSleeve(id) { const item = state.sleeves.find((entry) => entry.id === id); if (!item) return; if (!confirm(`确认删除「${item.name}」吗？\n\n删除后这只杯套将从收藏馆和收藏列表中移除，无法撤销。`)) return; state.sleeves = state.sleeves.filter((entry) => entry.id !== id); state.favorites = state.favorites.filter((favoriteId) => favoriteId !== id); save(STORAGE_KEY, state.sleeves); save(FAVORITES_KEY, state.favorites); closeModal($("#detailModal")); renderHome(); if (state.view === "favoritesView") renderFavorites(); if (state.view === "rankingView") renderRanking(); showToast("已删除这只杯套"); }
function closeModal(element) { element.hidden = true; }
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2100); }
function restoreBackup(file) { if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const backup = JSON.parse(reader.result); if (!backup || !Array.isArray(backup.sleeves) || !Array.isArray(backup.favorites)) throw new Error("invalid"); if (!confirm(`确认用这份备份覆盖当前本地数据吗？\n\n备份包含 ${backup.sleeves.length} 个杯套、${backup.favorites.length} 个收藏。\n当前本地数据会被替换，无法撤销。`)) return; state.sleeves = backup.sleeves; state.favorites = backup.favorites.filter((id) => state.sleeves.some((item) => item.id === id)); save(STORAGE_KEY, state.sleeves); save(FAVORITES_KEY, state.favorites); state.brand = "全部品牌"; state.search = ""; $("#searchInput").value = ""; renderHome(); renderFavorites(); renderRanking(); showToast("恢复成功，已用备份替换本地数据"); } catch { showToast("不是有效的收藏馆备份文件"); } finally { $("#restoreInput").value = ""; } }; reader.readAsText(file, "UTF-8"); }

function openBrandModal() { state.pendingBrand = state.brand; $("#brandOptions").innerHTML = ["全部品牌", ...new Set(state.sleeves.map((item) => item.brand))].map((brand) => `<button class="brand-option ${state.pendingBrand === brand ? "selected" : ""}" data-brand="${escapeHtml(brand)}">${escapeHtml(brand)}</button>`).join(""); $$(".brand-option").forEach((button) => button.addEventListener("click", () => { state.pendingBrand = button.dataset.brand; $$(".brand-option").forEach((item) => item.classList.toggle("selected", item === button)); })); $("#brandModal").hidden = false; }

function submitUpload(event) { event.preventDefault(); if (!state.imageData) { showToast("请先选择一张杯套图片"); return; } const sleeve = { id: `custom-${Date.now()}`, brand: $("#brandInput").value, enBrand: "My Archive", name: $("#sleeveName").value.trim(), date: formatDate($("#dateInput").value), tag: $("#tagInput").value, story: $("#storyInput").value.trim() || "这是一枚值得留下来的杯套。", colors: ["#b9c8d9", "#e5b66c", "#f1d9cf"], kind: "characters", custom: true, image: state.imageData }; state.sleeves.unshift(sleeve); save(STORAGE_KEY, state.sleeves); showToast("上传成功，已加入你的收藏馆"); event.target.reset(); $("#imagePreview").hidden = true; $("#imagePicker").classList.remove("has-image"); state.imageData = ""; switchView("homeView"); }

$("#searchInput").addEventListener("input", (event) => { state.search = event.target.value; renderHome(); }); $("#restoreButton").addEventListener("click", () => $("#restoreInput").click()); $("#restoreInput").addEventListener("change", (event) => restoreBackup(event.target.files?.[0])); $("#brandFilterButton").addEventListener("click", openBrandModal); $("#cancelBrand").addEventListener("click", () => closeModal($("#brandModal"))); $("#confirmBrand").addEventListener("click", () => { state.brand = state.pendingBrand; closeModal($("#brandModal")); renderHome(); }); $("#activeFilter").addEventListener("click", () => { state.brand = "全部品牌"; renderHome(); }); $("#closeDetail").addEventListener("click", () => closeModal($("#detailModal"))); $("#detailModal").addEventListener("click", (event) => { if (event.target.id === "detailModal") closeModal(event.target); }); $("#uploadForm").addEventListener("submit", submitUpload); $("#dateInput").value = new Date().toISOString().slice(0, 10); $("#imageInput").addEventListener("change", (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { state.imageData = reader.result; $("#imagePreview").src = state.imageData; $("#imagePreview").hidden = false; $("#imagePicker").classList.add("has-image"); }; reader.readAsDataURL(file); }); $("#clearFavorites").addEventListener("click", () => { if (!state.favorites.length) { showToast("还没有收藏内容"); return; } state.favorites = []; save(FAVORITES_KEY, state.favorites); renderFavorites(); showToast("已清空收藏"); }); $("#backupButton").addEventListener("click", () => { const blob = new Blob([JSON.stringify({ sleeves: state.sleeves, favorites: state.favorites }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `杯套收藏馆备份-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url); showToast("备份文件已下载"); }); $("#feedbackButton").addEventListener("click", () => showToast("自用版暂未接入反馈服务")); $("#editProfile").addEventListener("click", () => showToast("自用版档案名称固定为“我的收藏”")); $("#menuButton").addEventListener("click", () => showToast("这是一个纯前端自用版，数据只保存在本机")); $$(".nav-item").forEach((item) => item.addEventListener("click", () => switchView(item.dataset.view))); setInterval(() => { $("#statusTime").textContent = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }); }, 30000);
renderHome();
