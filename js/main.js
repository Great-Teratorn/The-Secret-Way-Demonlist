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


// WATCH FOR INCOMING SEARCHES FROM THE WELCOME PAGEfunction checkIncomingSearch() {    const pendingQuery = localStorage.getItem('pendingListSearch');    if (pendingQuery && window.location.hash.includes('/list')) {        localStorage.removeItem('pendingListSearch'); // Clear data                let attempts = 0;        const interval = setInterval(() => {            const levelButtons = document.querySelectorAll('.list button, .list-container a, .list a, [class*="item"] button');            attempts++;                        if (levelButtons.length > 0) {                clearInterval(interval);                levelButtons.forEach(button => {                    const textContent = button.textContent.toLowerCase();                    if (textContent.includes(pendingQuery.toLowerCase())) {                        button.style.setProperty('display', 'flex', 'important');                    } else {                        button.style.setProperty('display', 'none', 'important');                    }                });            }            if (attempts > 20) clearInterval(interval);        }, 100);    }}
window.addEventListener('hashchange', checkIncomingSearch);window.addEventListener('load', checkIncomingSearch);





