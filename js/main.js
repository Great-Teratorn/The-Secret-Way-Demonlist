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



/* PERSISTENT GLOBAL PREDICTIVE DISCOVERY MODULE */var searchDbMatrix = [];function initializeSearchIndex() {    searchDbMatrix = [];    var basePath = window.location.origin + window.location.pathname;    if (basePath.slice(-1) !== '/') { basePath += '/'; }        fetch(basePath + 'data/list.json').then(function(r) { return r.json(); }).then(function(data) {        data.forEach(function(lvl) {            searchDbMatrix.push({ name: lvl.name, type: 'Level', route: '/list' });            if (lvl.author) { searchDbMatrix.push({ name: lvl.author, type: 'Creator', route: '/list' }); }            if (lvl.verifier) { searchDbMatrix.push({ name: lvl.verifier, type: 'Verifier', route: '/list' }); }        });    }).catch(function(e) {});
    fetch(basePath + 'data/leaderboard.json').then(function(r) { return r.json(); }).then(function(data) {        data.forEach(function(p) {            searchDbMatrix.push({ name: p.name, type: 'Player', route: '/leaderboard' });        });    }).catch(function(e) {});}initializeSearchIndex();
document.addEventListener('click', function(e) {    if (e.target.closest('#welcomeSearchBtn')) {        e.preventDefault();        var box = document.getElementById('welcomeSearchBox');        var inp = document.getElementById('levelSearch');        if (box && inp) {            box.classList.toggle('active');            if (box.classList.contains('active')) { inp.focus(); } else { inp.value = ''; var dd = document.getElementById('searchDropdownMenu'); if (dd) { dd.style.display = 'none'; } }        }    }});
window.handleSearchTyping = function(val) {    var dropdown = document.getElementById('searchDropdownMenu');    if (!dropdown) { return; }    var query = val.toLowerCase().trim();    if (query.length < 2) { dropdown.style.display = 'none'; return; }        var matches = searchDbMatrix.filter(function(item) {        return item.name.toLowerCase().indexOf(query) !== -1;    });
    var uniqueMatches = matches.filter(function(v, i, a) {        return a.findIndex(function(t) { return t.name === v.name && t.type === v.type; }) === i;    }).slice(0, 6);
    if (uniqueMatches.length === 0) { dropdown.style.display = 'none'; return; }
    var html = '';    uniqueMatches.forEach(function(item) {        html += '<div class="suggestion-row" onclick="localStorage.setItem(\'listSearchTarget\', \'' + item.name.replace(/'/g, "\\'") + '\'); document.getElementById(\'searchDropdownMenu\').style.display=\'none\'; document.getElementById(\'levelSearch\').value=\'\'; window.location.hash=\'' + item.route + '\';" style="display:flex !important; justify-content:space-between !important; padding:12px 16px !important; cursor:pointer !important; background:#14141c !important; border-bottom:1px solid rgba(255,255,255,0.05) !important; text-align:left !important;"><span class="suggestion-name" style="color:#fff !important; font-size:0.9rem !important; font-weight:500 !important;">' + item.name + '</span><span class="suggestion-type" style="color:#00e676 !important; font-size:0.7rem !important; font-weight:bold !important; text-transform:uppercase !important; background:rgba(255,255,255,0.15) !important; padding:2px 8px !important; border-radius:4px !important;">' + item.type + '</span></div>';    });    dropdown.innerHTML = html;    dropdown.style.setProperty('display', 'block', 'important');};
window.handleSearchEnter = function(val) {    if (val.trim().length > 0) {        var inputVal = val.trim();        var matchedItem = searchDbMatrix.find(function(i) { return i.name.toLowerCase() === inputVal.toLowerCase(); });        localStorage.setItem('listSearchTarget', inputVal);        var destRoute = matchedItem ? matchedItem.route : '/list';        window.location.hash = destRoute;    }};
window.processSearchHighlight = function() {    var target = localStorage.getItem('listSearchTarget');    if (!target) { return; }    var query = target.toLowerCase().trim();    localStorage.removeItem('listSearchTarget');    var attempts = 0;    var loop = setInterval(function() {        attempts++;        var isLeaderboard = window.location.hash.includes('/leaderboard');        var targetClass = isLeaderboard ? 'td, th, .player, [class*="player"]' : '.list button, .list-container a, .list a, [class*="item"] button';        var elements = document.querySelectorAll(targetClass);        if (elements.length > 0) {            clearInterval(loop);            elements.forEach(function(el) {                if (el.textContent.toLowerCase().indexOf(query) !== -1) {                    el.style.setProperty('border', '2px dashed #00e676', 'important');                    el.style.setProperty('background', 'rgba(0, 230, 118, 0.15)', 'important');                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });                    if (typeof el.click === 'function') { el.click(); }                }            });        }        if (attempts > 20) { clearInterval(loop); }    }, 150);};
window.addEventListener('hashchange', function() { window.processSearchHighlight(); });window.addEventListener('load', function() { window.processSearchHighlight(); });

