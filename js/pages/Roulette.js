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
                const currentLevel = this.levels[this.progression.length];
                return currentLevel ? (currentLevel.secret_way_at || 1) : 1;
            }
            // Classic & Linear fix: If you have beaten levels, check your last logged score and add 1!
            if (this.progression.length > 0) {
                return this.progression[this.progression.length - 1] + 1;
            }
            // Fallback for the very first level of the run
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
                // 1. Arrange the level list structure first
        let chosenList = [];
        if (this.gameMode === 'linear') {
            chosenList = list.slice().reverse(); 
        } else {
            chosenList = shuffle(list).slice(0, 100);
        }

        // 2. Fetch the full detailed data for each level to unlock 'secret_way_at' properties
        this.levels = await Promise.all(
            chosenList.map(async (levelName) => {
                try {
                    // Pulls the real data file (like data/xo.json) right into your game memory
                    const response = await fetch(`data/${levelName}.json`);
                    return await response.json();
                } catch (err) {
                    console.error("Error loading level details:", err);
                    return { name: levelName, secret_way_at: 1 }; // Fallback safety
                }
            })
        );



        this.showRemaining = false;
        this.givenUp = false;
        this.progression = [];

        // Setup target percentage
        if (this.gameMode === 'survival') {
            // Mode 3: Requires reaching the first level's secret way entrance percent
            this.percentage = this.levels[0].secret_way_at || 1;
        } else {
            // Mode 1 & 2: Traditional incremental tracking starts at 1%
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
        onDone() {
                        if (!this.percentage) {
                return;
            }

            // Syncs the verification rules to match whatever is showing in the placeholder box
            let requiredPercentage = this.placeholder;

            if (
                this.percentage < requiredPercentage || 
                this.percentage > 100
            ) {
                this.showToast(`Invalid percentage. You must reach at least ${requiredPercentage}%!`);
                return;
            }



                            // 1. Log the percentage they just successfully scored
        this.progression.push(this.percentage);
        
        // Save the score they just beat into a temp variable before resetting
        let lastBeatenScore = this.percentage;

        // 2. Calculate the next target percentage criteria
        if (this.gameMode === 'survival') {
            // Secret Way Survival: Grab the next level array object based on progress counter
            const nextLevel = this.levels[this.progression.length];
            if (nextLevel) {
                this.percentage = nextLevel.secret_way_at || 1;
            } else {
                this.percentage = undefined; // Game completely finished!
            }
        } else {
            // Classic & Linear Mode: Incremental format looks at your last score and adds 1!
            // E.g., if you scored 5%, the next minimum goal instantly becomes 6%
            if (lastBeatenScore >= 100) {
                this.percentage = undefined; // Hit 100%, game finished!
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
