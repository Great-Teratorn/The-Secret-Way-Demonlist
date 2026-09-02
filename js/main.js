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

/* UNIVERSAL SEARCH ENGINE & PREDICTIVE DROPDOWN CONTROLLER */var globalSearchDB = []; function buildGlobalDB() { var x1 = new XMLHttpRequest(); x1.open('GET', './data/list.json', true); x1.onload = function() { if (x1.status === 200) { try { JSON.parse(x1.responseText).forEach(function(l) { globalSearchDB.push({ name: l.name, type: 'Level', route: '/list' }); if (l.author) globalSearchDB.push({ name: l.author, type: 'Creator', route: '/list' }); if (l.verifier) globalSearchDB.push({ name: l.verifier, type: 'Verifier', route: '/list' }); }); } catch(e){} } }; x1.send(); var x2 = new XMLHttpRequest(); x2.open('GET', './data/leaderboard.json', true); x2.onload = function() { if (x2.status === 200) { try { JSON.parse(x2.responseText).forEach(function(p) { globalSearchDB.push({ name: p.name, type: 'Player', route: '/leaderboard' }); }); } catch(e){} } }; x2.send(); } buildGlobalDB();window.toggleNativeSearch = function() { var box = document.getElementById('welcomeSearchBox'); var inp = document.getElementById('levelSearch'); if (!box || !inp) return; box.classList.toggle('active'); if (box.classList.contains('active')) { inp.focus(); } else { inp.value = ''; document.getElementById('searchDropdownMenu').style.setProperty('display', 'none', 'important'); } };window.handleNativeTyping = function(val) { var dd = document.getElementById('searchDropdownMenu'); if (!dd) return; var raw = val.toLowerCase().trim(); if (raw.length < 2) { dd.style.setProperty('display', 'none', 'important'); return; } var filtered = globalSearchDB.filter(function(item) { return item.name.toLowerCase().indexOf(raw) !== -1; }).filter(function(v, i, a) { return a.findIndex(function(t) { return t.name === v.name && t.type === v.type; }) === i; }).slice(0, 6); if (filtered.length === 0) { dd.style.setProperty('display', 'none', 'important'); return; } var html = ''; filtered.forEach(function(item) { html += '<div class="suggestion-row" onclick="window.clickNativeSuggestion(\'' + item.name.replace(/'/g, "\\'") + '\', \'' + item.route + '\')"><span class="suggestion-name">' + item.name + '</span><span class="suggestion-type">' + item.type + '</span></div>'; }); dd.innerHTML = html; dd.style.setProperty('display', 'block', 'important'); };window.clickNativeSuggestion = function(name, route) { localStorage.setItem('pendingListSearch', name); var dd = document.getElementById('searchDropdownMenu'); if (dd) dd.style.setProperty('display', 'none', 'important'); var inp = document.getElementById('levelSearch'); if (inp) inp.value = ''; window.location.hash = route; };window.handleNativeEnter = function() { var inp = document.getElementById('levelSearch'); if (inp && inp.value.trim().length > 0) { localStorage.setItem('pendingListSearch', inp.value.trim()); window.location.hash = '/list'; } };function checkIncomingSearch() { var pending = localStorage.getItem('pendingListSearch'); if (!pending) return; var query = pending.toLowerCase().trim(); localStorage.removeItem('pendingListSearch'); var attempts = 0; var interval = setInterval(function() { attempts++; var els = document.querySelectorAll('.list button, .list-container a, .list a, td, th, .player-container button, .player, h3, [class*="item"] button, .player-cell'); if (els.length > 0) { clearInterval(interval); els.forEach(function(el) { if (el.textContent.toLowerCase().indexOf(query) !== -1) { el.style.setProperty('border', '2px dashed #00e676', 'important'); el.style.setProperty('background', 'rgba(0, 230, 118, 0.15)', 'important'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (typeof el.click === 'function') el.click(); } }); } if (attempts > 30) clearInterval(interval); }, 150); }window.addEventListener('hashchange', checkIncomingSearch); window.addEventListener('load', checkIncomingSearch);