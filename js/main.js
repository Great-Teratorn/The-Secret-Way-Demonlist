import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
});

const app = Vue.createApp({
    data: () => ({ store }),
});
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);

app.mount('#app');

/* PERSISTENT GLOBAL PREDICTIVE DISCOVERY MODULE */var globalDb = [];
function scrapePageData() {    globalDb = [];    var items = document.querySelectorAll('.list button, .list-container a, .list a, [class*="item"] button, .player-cell, td, th');    items.forEach(function(el) {        var text = el.textContent.trim();        if (text.length > 1 && !/^\d+$/.test(text)) {            var type = window.location.hash.includes('/leaderboard') ? 'Player' : 'Item';            globalDb.push({ name: text, type: type, route: window.location.hash });        }    });}
window.addEventListener('hashchange', function() {     setTimeout(scrapePageData, 500); });
setTimeout(scrapePageData, 1000);
document.addEventListener('click', function(e) {     if (e.target.closest('#welcomeSearchBtn')) {         e.preventDefault();         var box = document.getElementById('welcomeSearchBox');         var inp = document.getElementById('levelSearch');         if (box && inp) {             box.classList.toggle('active');             if (box.classList.contains('active')) {                 inp.focus();                 scrapePageData();             } else {                 inp.value = '';                 var dd = document.getElementById('searchDropdownMenu');                 if (dd) dd.style.setProperty('display', 'none', 'important');             }         }     }     if (e.target.closest('.suggestion-row')) {         var row = e.target.closest('.suggestion-row');         localStorage.setItem('pendingListSearch', row.getAttribute('data-name'));         var dd = document.getElementById('searchDropdownMenu');         if (dd) dd.style.setProperty('display', 'none', 'important');         var inp = document.getElementById('levelSearch');         if (inp) inp.value = '';         window.location.hash = row.getAttribute('data-route');     } });
document.addEventListener('input', function(e) {     if (e.target && e.target.id === 'levelSearch') {         var dd = document.getElementById('searchDropdownMenu');         if (!dd) return;         var raw = e.target.value.toLowerCase().trim();         if (raw.length < 2) {             dd.style.setProperty('display', 'none', 'important');             return;         }         if (globalDb.length === 0) scrapePageData();         var filtered = globalDb.filter(function(item) {             return item.name.toLowerCase().indexOf(raw) !== -1;         }).filter(function(v, i, a) {             return a.findIndex(function(t) { return t.name === v.name; }) === i;         }).slice(0, 6);                 if (filtered.length === 0) {             dd.style.setProperty('display', 'none', 'important');             return;         }         var html = '';         filtered.forEach(function(item) {             html += '<div class="suggestion-row" data-name="' + item.name.replace(/"/g, '&quot;') + '" data-route="' + item.route + '" style="display: flex !important; justify-content: space-between !important; padding: 12px 16px !important; cursor: pointer !important; background: #14141c !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; pointer-events: auto !important;"><span class="suggestion-name" style="color: #fff !important; font-size: 0.9rem !important;">' + item.name + '</span><span class="suggestion-type" style="color: #00e676 !important; font-size: 0.7rem !important; text-transform: uppercase !important;">' + item.type + '</span></div>';         });         dd.innerHTML = html;         dd.style.setProperty('display', 'block', 'important');     } });
document.addEventListener('keydown', function(e) {     if (e.target && e.target.id === 'levelSearch' && e.key === 'Enter') {         var query = e.target.value.trim();         if (query.length > 0) {             localStorage.setItem('pendingListSearch', query);             window.location.hash = '/list';         }     } });
function runIncomingSearch() {     var pending = localStorage.getItem('pendingListSearch');     if (!pending) return;     var query = pending.toLowerCase().trim();     localStorage.removeItem('pendingListSearch');     var attempts = 0;     var interval = setInterval(function() {         attempts++;         var route = window.location.hash;         var isLeaderboard = route.includes('/leaderboard');         var targetClass = isLeaderboard ? 'td, th, .player, [class*="player"]' : '.list button, .list-container a, .list a, [class*="item"] button';         var els = document.querySelectorAll(targetClass);         if (els.length > 0) {             clearInterval(interval);             els.forEach(function(el) {                 if (el.textContent.toLowerCase().indexOf(query) !== -1) {                     el.style.setProperty('border', '2px dashed #00e676', 'important');                     el.style.setProperty('background', 'rgba(0, 230, 118, 0.15)', 'important');                     el.scrollIntoView({ behavior: 'smooth', block: 'center' });                     if (typeof el.click === 'function') el.click();                 }             });         }         if (attempts > 30) clearInterval(interval);     }, 150); }
window.addEventListener('hashchange', runIncomingSearch);window.addEventListener('load', runIncomingSearch);