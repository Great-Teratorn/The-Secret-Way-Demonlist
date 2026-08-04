import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';
import Welcome from './pages/Welcome.js';

export default [
    { path: '/welcome', component: Welcome },
    { path: '/main', component: List },
    { path: '/', component: Welcome },
    { path: '/extended', component: List },
    { path: '/legacy', component: List },
    { path: '/unverified', component: List},
    { path: '/leaderboard', component: Leaderboard },
    { path: '/roulette', component: Roulette },
];
