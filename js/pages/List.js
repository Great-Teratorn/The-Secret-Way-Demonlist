import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                                    <table class="list" v-if="list">
                        <template v-for="([level, err], i) in list">
                            <tr :key="i" v-if="($route.path === '/' && i < 150) || ($route.path === '/extended' && i >= 150) || ($route.path === '/legacy' && level && level.dateFallen) || ($route.path === '/unverified')">
                                <td class="rank">
                                    <!-- Show rank number on Main and Extended, show text on Legacy -->
                                    <p v-if="$route.path !== '/legacy' && $route.path !== '/unverified'" class="type-label-lg">#{{ i + 1 }}</p>
                                    <p v-else-if="$route.path === '/legacy'" class="type-label-lg" style="color: #a29bfe; font-size: 0.9rem; font-weight: bold; text-transform: uppercase;">Fallen</p>
                                </td>
                                <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                                    <button @click="selected = i" style="display: flex; align-items: center; gap: 15px; width: 100%; text-align: left;">
                                        <span class="type-label-lg">{{ level?.name || ($route.path === '/unverified' ? level?.name || 'Loading...' : 'Error (' + err + ')') }}</span>

                                        <!-- Added: Shows the fallback date next to the name on the legacy list -->
                                        <span v-if="$route.path === '/legacy' && level?.dateFallen" class="type-label-sm" style="color: #94a3b8; font-style: italic; margin-left: auto; padding-right: 15px;">
                                            Fell off: {{ level.dateFallen }}
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </table>

            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to Copy' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> to qualify</p>
                    <p v-else-if="selected +1 <= 150"><strong>100%</strong> to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                    <p>Great Teratorn is responsible for this website's existence!</p>
                      </div>
                    <template v-if="editors">
                        <h3>List Staff</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Submission Requirements</h3>
                    <p>
                        Achieved the record without using hacks (however, FPS bypass is allowed, up to 360fps). 
                    </p>
                    <p>
                        Achieved the record on the level that is listed on the site - please check the level ID before you submit a record. 
                    </p>
                    <p>
                        The secret way(s) must be used correctly as shown in the video. Otherwise, the record is invalid. 
                    </p>
                    <p>
                        Clicks or taps must be clearly visible in the recording to reinforce legitimacy. Audible clicks are preferred but not compulsory. 
                    </p>
                    <p>
                        The recording must show the player hit the endwall, or the completion will be invalidated.
                    </p>
                    
                    <p>
                        Do not use easy modes, only a record of the unmodified level qualifies. LDM/ULDM is allowed - only if part of the level. Custom version will lead to the record being invalidated.  
                    </p>
                    <p>
                    A raw, unedited footage link must be provided upon request.
                    </p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return this.list[this.selected]?.[0] || this.list[this.selected];

        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
   
    
    // 🆕 ADD THIS WATCHER BLOCK: Forces Vue to reload data when switching tabs
    watch: {
        async $route() {
            this.list = await fetchList();
        }
    },

    

    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            
            this.list = this.list.filter(([_, err]) => !err).map(([data, _]) => data);
            
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
console.log("=== DEBUG LIST ACTIVE STATE ===");
    console.log("Raw list array:", this.list);
    console.log("Errors array:", this.errors);
        
    
    
    },
    methods: {
        embed,
        score,
    },
};