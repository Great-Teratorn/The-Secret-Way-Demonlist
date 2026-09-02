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

/* UNIVERSAL LIST FOCUS DISCOVERY ROTATOR */function checkIncomingSearch() { const pendingQuery = localStorage.getItem('pendingListSearch'); if (!pendingQuery) return; const query = pendingQuery.toLowerCase().trim(); localStorage.removeItem('pendingListSearch'); let attempts = 0; const searchInterval = setInterval(function() { attempts++; const elements = document.querySelectorAll('.list button, .list-container a, .list a, td, th, .player-container button, .player, h3, [class*="item"] button, .player-cell'); if (elements.length > 0) { let clickedAny = false; elements.forEach(function(element) { const text = element.textContent.toLowerCase(); if (text.includes(query)) { clearInterval(searchInterval); element.style.setProperty('border', '2px dashed #00e676', 'important'); element.style.setProperty('background', 'rgba(0, 230, 118, 0.15)', 'important'); element.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (!clickedAny && typeof element.click === 'function') { element.click(); clickedAny = true; } } }); if (clickedAny) clearInterval(searchInterval); } if (attempts > 30) clearInterval(searchInterval); }, 150); }window.addEventListener('hashchange', checkIncomingSearch); window.addEventListener('load', checkIncomingSearch);