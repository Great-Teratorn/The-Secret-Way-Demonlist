import { fetchList } from '../content.js';
import { getThumbnailFromId, getYoutubeIdFromUrl, shuffle } from '../util.js';

import Spinner from '../components/Spinner.js';
import Btn from '../components/Btn.js';

export default {
    components: { Spinner, Btn },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-roulette">
            <div class="sidebar">
                
                <form class="options">
                    <div class="check">
                        <input type="checkbox" id="main" value="Main List" v-model="useMainList">
                        <label for="main">Main List</label>
                    </div>
                    <div class="check">
                        <input type="checkbox" id="extended" value="Extended List" v-model="useExtendedList">
                        <label for="extended">Extended List</label>
                    </div>
                    
                            <div style="margin: 15px 0 20px 0; display: flex; flex-direction: column; gap: 8px;">
            <p style="margin: 0 0 4px 0; font-weight: bold; color: #39ff14; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
                Choose Game Mode:
            </p>
            <div class="check" style="margin-bottom: 2px;">
                <input type="radio" id="classic" name="roulette-mode" value="classic" v-model="gameMode" style="cursor: pointer; accent-color: #39ff14;">
                <label for="classic" style="padding-left: 8px; cursor: pointer;">Classic Random Roulette (1% to 100%)</label>
            </div>
            <div class="check" style="margin-bottom: 2px;">
                <input type="radio" id="linear" name="roulette-mode" value="linear" v-model="gameMode" style="cursor: pointer; accent-color: #39ff14;">
                <label for="linear" style="padding-left: 8px; cursor: pointer;">Standard Progression (#150 to #1)</label>
            </div>
            <div class="check" style="margin-bottom: 2px;">
                <input type="radio" id="survival" name="roulette-mode" value="survival" v-model="gameMode" style="cursor: pointer; accent-color: #39ff14;">
                <label for="survival" style="padding-left: 8px; cursor: pointer;">Secret Way Survival (Entry %)</label>
            </div>
        </div>

                    
                    <Btn @click.native.prevent="onStart">{{ levels.length === 0 ? 'Start' : 'Restart'}}</Btn>
                </form>
                <p class="type-label-md" style="color: #aaa">
                    The roulette saves automatically.
                </p>
                <form class="save">
                    <p>Manual Load/Save</p>
                    <div class="btns">
                        <Btn @click.native.prevent="onImport">Import</Btn>
                        <Btn :disabled="!isActive" @click.native.prevent="onExport">Export</Btn>
                    </div>
                </form>
            </div>
            <section class="levels-container">
                <div class="levels">
                    <template v-if="levels.length > 0">
                        <!-- Completed Levels -->
                        <div class="level" v-for="(level, i) in levels.slice(0, progression.length)">
                            <a :href="level.video" class="video">
                                <img :src="getThumbnailFromId(getYoutubeIdFromUrl(level.video))" alt="">
                            </a>
                            <div class="meta">
                                <p>#{{ level.rank }}</p>
                                <h2>{{ level.name }}</h2>
                                <p style="color: #00b54b; font-weight: 700">{{ progression[i] }}%</p>
                            </div>
                        </div>
                        <!-- Current Level -->
                        <div class="level" v-if="!hasCompleted">
                            <a :href="currentLevel.video" target="_blank" class="video">
                                <img :src="getThumbnailFromId(getYoutubeIdFromUrl(currentLevel.video))" alt="">
                            </a>
                            <div class="meta">
                                <p>#{{ currentLevel.rank }}</p>
                                <h2>{{ currentLevel.name }}</h2>
                                <p>{{ currentLevel.id }}</p>
                            </div>
                            <form class="actions" v-if="!givenUp">
                                <input type="number" v-model="percentage" :placeholder="placeholder" :min="placeholder" max="100">

                                <Btn @click.native.prevent="onDone">Done</Btn>
                                <Btn @click.native.prevent="onGiveUp" style="background-color: #e91e63;">Give Up</Btn>
                            </form>
                        </div>
                        <!-- Results -->
                        <div v-if="givenUp || hasCompleted" class="results">
                            <h1>Results</h1>
                            <p>Number of levels: {{ progression.length }}</p>
                            <p>Highest percent: {{ currentPercentage }}%</p>
                            <Btn v-if="currentPercentage < 99 && !hasCompleted" @click.native.prevent="showRemaining = true">Show remaining levels</Btn>
                        </div>
                        <!-- Remaining Levels -->
                        <template v-if="givenUp && showRemaining">
                            <div class="level" v-for="(level, i) in levels.slice(progression.length + 1, levels.length - currentPercentage + progression.length)">
                                <a :href="level.video" target="_blank" class="video">
                                    <img :src="getThumbnailFromId(getYoutubeIdFromUrl(level.video))" alt="">
                                </a>
                                <div class="meta">
                                    <p>#{{ level.rank }}</p>
                                    <h2>{{ level.name }}</h2>
                                    <p style="color: #d50000; font-weight: 700">{{ currentPercentage + 2 + i }}%</p>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </section>
            <div class="toasts-container">
                <div class="toasts">
                    <div v-for="toast in toasts" class="toast">
                        <p>{{ toast }}</p>
                    </div>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        loading: false,
        levels: [],
        progression: [], // list of percentages completed
        percentage: undefined,
        givenUp: false,
        showRemaining: false,
        useMainList: true,
        useExtendedList: true,
        gameMode: 'classic',
        toasts: [],
        fileInput: undefined,
    }),
    mounted() {
        // Create File Input
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.multiple = false;
        this.fileInput.accept = '.json';
        this.fileInput.addEventListener('change', this.onImportUpload);

        // Load progress from local storage
        const roulette = JSON.parse(localStorage.getItem('roulette'));

        if (!roulette) {
            return;
        }

        this.levels = roulette.levels;
        this.progression = roulette.progression;
    },
    computed: {
        currentLevel() {
            return this.levels[this.progression.length];
        },
        currentPercentage() {
            return this.progression[this.progression.length - 1] || 0;
        },
                            placeholder() {
            if (this.gameMode === 'survival') {
                // Survival Mode: Output the active requirement loaded from your JSON
                return this.percentage || 1;
            }
            // Classic & Linear fix: Check last logged score history and add 1
            if (this.progression.length > 0) {
                return this.progression[this.progression.length - 1] + 1;
            }
            return 1;
        },


        
        hasCompleted() {
            return (
                this.progression[this.progression.length - 1] >= 100 ||
                this.progression.length === this.levels.length
            );
        },
        isActive() {
            return (
                this.progression.length > 0 &&
                !this.givenUp &&
                !this.hasCompleted
            );
        },
    },
    methods: {
        shuffle,
        getThumbnailFromId,
        getYoutubeIdFromUrl,
        async onStart() {
            if (this.isActive) {
                this.showToast('Give up before starting a new roulette.');
                return;
            }

            if (!this.useMainList && !this.useExtendedList) {
                return;
            }

            this.loading = true;

            const fullList = await fetchList();

            if (fullList.filter(([_, err]) => err).length > 0) {
                this.loading = false;
                this.showToast(
                    'List is currently broken. Wait until it\'s fixed to start a roulette.',
                );
                return;
            }

            const fullListMapped = fullList.map(([lvl, _], i) => ({
                rank: i + 1,
                id: lvl.id,
                name: lvl.name,
                video: lvl.verification,
            }));
            const list = [];
            if (this.useMainList) list.push(...fullListMapped.slice(0, 75));
            if (this.useExtendedList) {
                list.push(...fullListMapped.slice(75, 150));
            }

            // random 100 levels
                        // Setup levels based on chosen game mode using the pre-loaded data
        if (this.gameMode === 'linear') {
            // Mode 2: Standard Progression (Start at #150 and climb up to #1)
            this.levels = list.slice().reverse(); 
        } else {
            // Mode 1 & 3: Classic Random & Secret Way Survival remain fully randomized
            this.levels = shuffle(list).slice(0, 100);
        }




                this.showRemaining = false;
        this.givenUp = false;
        this.progression = [];

        // Setup initial target percentage
        if (this.gameMode === 'survival') {
            try {
                // Fetch the very first level's JSON file to boot up the requirements
                const response = await fetch(`data/${this.levels[0].name}.json`);
                const firstLevelData = await response.json();
                this.percentage = firstLevelData.secret_way_at || 1;
            } catch (err) {
                this.percentage = 1;
            }
        } else {
            this.percentage = 1;
        }



            this.loading = false;
        },
        save() {
            localStorage.setItem(
                'roulette',
                JSON.stringify({
                    levels: this.levels,
                    progression: this.progression,
                }),
            );
        },
        
            async onDone() {
        if (!this.percentage) {
            return;
        }

        let requiredPercentage = this.placeholder;

        if (
            this.percentage < requiredPercentage || 
            this.percentage > 100
        ) {
            this.showToast(`Invalid percentage. You must reach at least ${requiredPercentage}%!`);
            return;
        }

        this.progression.push(this.percentage);
        let lastBeatenScore = this.percentage;

        // Calculate the next target percentage criteria
        if (this.gameMode === 'survival') {
            const nextLevelData = this.levels[this.progression.length];
            if (nextLevelData) {
                try {
                    // Peek into the specific level file (e.g. data/xo.json) right on the fly!
                    const response = await fetch(`data/${nextLevelData.name}.json`);
                    const detailedLevel = await response.json();
                    
                    // Force the background requirements tracker to update to your exact custom JSON property
                    this.percentage = detailedLevel.secret_way_at || 1;
                } catch (err) {
                    console.error("Error fetching level details:", err);
                    this.percentage = 1; // Safety fallback
                }
            } else {
                this.percentage = undefined; // Game completely finished!
            }
        } else {
            // Classic & Linear Mode: Incremental format looks at your last score and adds 1
            if (lastBeatenScore >= 100) {
                this.percentage = undefined; 
            } else {
                this.percentage = lastBeatenScore + 1;
            }
        }

        this.save();
    },

        onGiveUp() {
            this.givenUp = true;

            // Save progress
            localStorage.removeItem('roulette');
        },
        onImport() {
            if (
                this.isActive &&
                !window.confirm('This will overwrite the currently running roulette. Continue?')
            ) {
                return;
            }

            this.fileInput.showPicker();
        },
        async onImportUpload() {
            if (this.fileInput.files.length === 0) return;

            const file = this.fileInput.files[0];

            if (file.type !== 'application/json') {
                this.showToast('Invalid file.');
                return;
            }

            try {
                const roulette = JSON.parse(await file.text());

                if (!roulette.levels || !roulette.progression) {
                    this.showToast('Invalid file.');
                    return;
                }

                this.levels = roulette.levels;
                this.progression = roulette.progression;
                this.save();
                this.givenUp = false;
                this.showRemaining = false;
                this.percentage = undefined;
            } catch {
                this.showToast('Invalid file.');
                return;
            }
        },
        onExport() {
            const file = new Blob(
                [JSON.stringify({
                    levels: this.levels,
                    progression: this.progression,
                })],
                { type: 'application/json' },
            );
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file);
            a.download = 'tsl_roulette';
            a.click();
            URL.revokeObjectURL(a.href);
        },
        showToast(msg) {
            this.toasts.push(msg);
            setTimeout(() => {
                this.toasts.shift();
            }, 3000);
        },
    },
};
