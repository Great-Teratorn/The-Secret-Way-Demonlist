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





// GLOBAL CROSS-PAGE LIST SEARCH ARCHITECTUREwindow.toggleSearch = function() {    const searchBox = document.querySelector('.search-box');    const input = document.getElementById('levelSearch');    if (!searchBox || !input) return;        searchBox.classList.toggle('active');        if (searchBox.classList.contains('active')) {        input.focus();    } else {        input.value = '';    }};
window.handleWelcomeSearch = function(event) {    if (event.key === 'Enter') {        const query = event.target.value.trim();        if (query.length > 0) {            localStorage.setItem('pendingListSearch', query);            window.location.hash = '/list';        }    }};
function checkPendingSearch() {    const pendingQuery = localStorage.getItem('pendingListSearch');    if (pendingQuery && window.location.hash.includes('/list')) {        localStorage.removeItem('pendingListSearch');                let attempts = 0;        const interval = setInterval(() => {            const levelButtons = document.querySelectorAll('.list button, .list-container a, .list a, [class*="item"] button');            attempts++;                        if (levelButtons.length > 0) {                clearInterval(interval);                levelButtons.forEach(button => {                    const textContent = button.textContent.toLowerCase();                    if (textContent.includes(pendingQuery.toLowerCase())) {                        button.style.setProperty('display', 'flex', 'important');                    } else {                        button.style.setProperty('display', 'none', 'important');                    }                });            }            if (attempts > 20) clearInterval(interval);        }, 100);    }}
window.addEventListener('hashchange', checkPendingSearch);window.addEventListener('load', checkPendingSearch);