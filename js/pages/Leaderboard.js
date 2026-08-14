import { fetchLeaderboard, fetchWeeklyLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        mainLeaderboardCache: [],
        weeklyLeaderboardCache: [],
        loading: true,
        selected: 0,
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                                        <div class="board-container">
                            <!-- Toggle Buttons Inserted Here -->
                            <div class="leaderboard-toggle" style="display: flex; gap: 12px; margin-bottom: 25px;">
    <!-- Main Leaderboard Button -->
    <button @click="toggleLeaderboard(false)" 
            :style="{ 
                'background-color': !isWeekly ? '#22c55e' : '#1e1b4b', 
                'color': !isWeekly ? '#000' : '#a29bfe',
                'border': !isWeekly ? '2px solid #4ade80' : '2px solid #4338ca',
                'font-weight': 'bold',
                'padding': '10px 20px',
                'border-radius': '8px',
                'cursor': 'pointer',
                'transition': 'all 0.2s ease'
            }">
        Main Leaderboard
    </button>

    <!-- Weekly Leaderboard Button -->
    <button @click="toggleLeaderboard(true)" 
            :style="{ 
                'background-color': isWeekly ? '#22c55e' : '#1e1b4b', 
                'color': isWeekly ? '#000' : '#dedcf9',
                'border': isWeekly ? '2px solid #4ade80' : '2px solid #4338ca',
                'font-weight': 'bold',
                'padding': '10px 20px',
                'border-radius': '8px',
                'cursor': 'pointer',
                'transition': 'all 0.2s ease'
            }">
        Weekly Demons
    </button>
</div>


                            
                            <table class="board">

                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ ientry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container">
                    <div class="player">
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>
                        <h2 v-if="entry.verified.length > 0">Verified ({{ entry.verified.length}})</h2>
                        <table class="table">
                            <tr v-for="score in entry.verified">
                                <td class="rank">
                                    <p>{{ isWeekly ? '' : '#' + score.rank }}</p>

                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}
                                    <!-- Added: Shows the weekly date right next to the level name -->
                                    <span v-if="isWeekly && score.weeklyDate" style="color: #a29bfe; font-size: 0.85rem; font-style: italic; margin-left: 10px;">
                                        ({{ score.weeklyDate }})
                                    </span>
                                    </a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table class="table">
                            <tr v-for="score in entry.completed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.progressed.length > 0">Progressed ({{entry.progressed.length}})</h2>
                        <table class="table">
                            <tr v-for="score in entry.progressed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
    const [mainList, mainErrs] = await fetchLeaderboard();
    const [weeklyList, weeklyErrs] = await fetchWeeklyLeaderboard();

    this.mainLeaderboardCache = mainList;
    this.weeklyLeaderboardCache = weeklyList;

    // Default state loads main list onto the screen
    this.leaderboard = this.mainLeaderboardCache;
    this.err = mainErrs;
    this.loading = false;
},

        methods: {
        localize,
        toggleLeaderboard(showWeekly) {
            this.isWeekly = showWeekly;
            this.leaderboard = showWeekly ? this.weeklyLeaderboardCache : this.mainLeaderboardCache;
            this.selected = 0;
        }
    },

};
