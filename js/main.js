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


/* ADVANCED GLOBAL ROUTER SYSTEM */function checkIncomingSearch() { const pendingQuery = localStorage.getItem('pendingListSearch'); if (!pendingQuery) return; const query = pendingQuery.toLowerCase().trim(); if (window.location.hash.includes('/list')) { const isPlayerQuery = ['player', 'leaderboard', 'top', 'points', 'score'].some(function(k) { return query.includes(k); }); if (isPlayerQuery) { window.location.hash = '/leaderboard'; return; } } localStorage.removeItem('pendingListSearch'); let attempts = 0; const searchInterval = setInterval(function() { attempts++; const elements = document.querySelectorAll('.list button, .list-container a, .list a, td, th, .player-container button, .player, h3, [class*="item"]'); if (elements.length > 0) { clearInterval(searchInterval); elements.forEach(function(element) { const text = element.textContent.toLowerCase(); if (text.includes(query)) { element.style.setProperty('border', '2px dashed #00e676', 'important'); element.style.setProperty('background', 'rgba(0, 230, 118, 0.15)', 'important'); element.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (typeof element.click === 'function') { element.click(); } } }); if (window.location.hash.includes('/list')) { const listItems = document.querySelectorAll('.list button, .list-container a, .list a'); listItems.forEach(function(item) { if (!item.textContent.toLowerCase().includes(query)) { item.style.setProperty('display', 'none', 'important'); } }); } } if (attempts > 30) clearInterval(searchInterval); }, 150); }window.addEventListener('hashchange', checkIncomingSearch); window.addEventListener('load', checkIncomingSearch);