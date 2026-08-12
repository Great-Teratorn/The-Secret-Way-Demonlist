import { fetchList } from '../content.js';import { getThumbnailFromId, getYoutubeIdFromUrl, shuffle } from '../util.js';import Spinner from '../components/Spinner.js';import Btn from '../components/Btn.js';
export default {    components: { Spinner, Btn },        template: `
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
                            <label for="linear" style="padding-left: 8px; cursor: pointer;">Standard Progression (Custom Range)</label>
                        </div>
                        <div class="check" style="margin-bottom: 2px;">
                            <input type="radio" id="survival" name="roulette-mode" value="survival" v-model="gameMode" style="cursor: pointer; accent-color: #39ff14;">
                            <label for="survival" style="padding-left: 8px; cursor: pointer;">Secret Way Survival (Entry %)</label>
                        </div>
                    </div>

                    <!-- Custom Range Controls (Clean inline structure matching native look) -->
                    <div style="margin: 0 0 20px 0; border-top: 1px solid #333; padding-top: 15px;">
                        <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 0.75rem; color: #aaa; margin-bottom: 4px;">Min Rank</label>
                                <input type="number" v-model.number="minRank" min="1" max="150" style="width: 100%; padding: 6px; background: rgba(0,0,0,0.3); border: 1px solid #444; color: #fff; border-radius: 4px;">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 0.75rem; color: #aaa; margin-bottom: 4px;">Max Rank</label>
                                <input type="number" v-model.number="maxRank" min="1" max="150" style="width: 100%; padding: 6px; background: rgba(0,0,0,0.3); border: 1px solid #444; color: #fff; border-radius: 4px;">
                            </div>
                        </div>

                        <!-- Direction Selector for Standard Progression -->
                        <div v-if="gameMode === 'linear'">
                            <label style="display: block; font-size: 0.75rem; color: #aaa; margin-bottom: 4px;">Progression Order</label>
                            <select v-model="progressionOrder" style="width: 100%; padding: 6px; background: #111; border: 1px solid #444; color: #fff; border-radius: 4px; cursor: pointer;">
                                <option value="descending">Descending (#1 to #150)</option>
                                <option value="ascending">Ascending (#150 to #1)</option>
                            </select>
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
                            <div class="level" v-for="(level, i) in remaining">
                                <a :href="level.video" target="_blank" class="video">
                                    <img :src="getThumbnailFromId(getYoutubeIdFromUrl(level.video))" alt="">
                                </a>
                                <div class="meta">
                                    <p>#{{ level.rank }}</p>
                                    <h2>{{ level.name }}</h2>
                                    <p style="color: #d50000; font-weight: 700">{{ gameMode === 'survival' ? (level?.secret_way_at ? level.secret_way_at + '%' : 'Secret Way') : ((currentPercentage || progression.length) + i + 1) + '%' }}</p>
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
    data: () => ({        loading: false, levels: [], progression: [], percentage: undefined,        givenUp: false, showRemaining: false, useMainList: true, useExtendedList: true,        gameMode: 'classic', survivalTarget: 1, toasts: [], fileInput: undefined,        minRank: 1, maxRank: 150, progressionOrder: 'descending'    }),
    mounted() {
        this.useMainList = true;
        this.useExtendedList = true;
        this.gameMode = 'classic';
        
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.multiple = false;
        this.fileInput.accept = '.json';
        this.fileInput.addEventListener('change', this.onImportUpload);

        const roulette = JSON.parse(localStorage.getItem('roulette'));
        if (!roulette) return;

        this.levels = roulette.levels || [];
        this.progression = roulette.progression || [];
        
        if (roulette.minRank !== undefined) this.minRank = roulette.minRank;
        if (roulette.maxRank !== undefined) this.maxRank = roulette.maxRank;
        if (roulette.progressionOrder !== undefined) this.progressionOrder = roulette.progressionOrder;
    },
    computed: {
        currentLevel() {
            return this.levels[this.progression.length];
        },
        currentPercentage() {
            return this.progression[this.progression.length - 1] || 0;
        },
        placeholder() {
            if (!this.gameMode) return 1;
            if (this.gameMode === 'survival') return this.survivalTarget || 1;
            if (this.progression && this.progression.length > 0) {
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
        remaining() {
            if (!this.levels || this.levels.length === 0) return [];
            return this.levels.slice(this.progression.length);
        },
        isActive() {
            return (
                this.progression.length > 0 &&
                !this.givenUp &&
                !this.hasCompleted
            );
        },
    },
methods: {        shuffle,        getThumbnailFromId,        getYoutubeIdFromUrl,        async onStart() {            if (this.isActive) {                this.showToast('Give up before starting a new roulette.');                return;            }            if (!this.useMainList && !this.useExtendedList) return;
            this.loading = true;            const fullListRaw = await fetchList();            const fullList = JSON.parse(JSON.stringify(fullListRaw || []));
            if (fullList.filter(([_, err]) => err).length > 0) {                this.loading = false;                this.showToast("List is broken. Wait until it's fixed to start.");                return;            }
            const fullListMapped = (fullList || []).map((item, i) => {                const lvl = Array.isArray(item) ? item[0] : item;                return {                    rank: i + 1,                    id: lvl?.id || i,                    name: typeof lvl === 'string' ? lvl : (lvl?.name || 'Unknown Level'),                    video: lvl?.verification || lvl?.video || '',                };            });
            const min = Math.max(1, parseInt(this.minRank) || 1);            const max = Math.min(fullListMapped.length, parseInt(this.maxRank) || 150);            const rangedPool = fullListMapped.filter(lvl => lvl.rank >= min && lvl.rank <= max);
            const list = [];            rangedPool.forEach(lvl => {                if (lvl.rank <= 75 && this.useMainList) {                    list.push(lvl);                } else if (lvl.rank > 75 && this.useExtendedList) {                    list.push(lvl);                }            });
            const safeListCopy = JSON.parse(JSON.stringify(list));
            if (this.gameMode === 'linear') {                if (this.progressionOrder === 'ascending') {                    this.levels = safeListCopy.sort((a, b) => b.rank - a.rank);                } else {                    this.levels = safeListCopy.sort((a, b) => a.rank - b.rank);                }            } else {                this.levels = shuffle([...safeListCopy]).slice(0, 100);            }
            this.showRemaining = false;            this.givenUp = false;            this.progression = [];
            if (this.gameMode === 'survival') {                await Promise.all(                    this.levels.map(async (lvl) => {                        try {                            let lvlName = lvl.name || '';                            lvlName = lvlName.toLowerCase().replace(/\s+/g, '-');                            const res = await fetch(`data/${lvlName}.json`);                            if (res.ok) {                                const data = await res.json();                                lvl.secret_way_at = data.secret_way_at || 1;                            } else {                                lvl.secret_way_at = 1;                            }                        } catch (e) {                            lvl.secret_way_at = 1;                        }                    })                );            }
            if (this.gameMode === 'survival' && this.levels.length > 0) {                try {                    let firstLevelName = this.levels[0].name || this.levels[0].level || "";                    firstLevelName = firstLevelName.toLowerCase().replace(/\s+/g, '-');                    const response = await fetch(`data/${firstLevelName}.json`);                    if (response.ok) {                        const firstLevelData = await response.json();                        this.survivalTarget = firstLevelData.secret_way_at || 1;                    } else {                        this.survivalTarget = 1;                    }                    this.percentage = undefined;                } catch (err) {                    this.survivalTarget = 1;                    this.percentage = undefined;                }            } else {                this.percentage = undefined;            }
            this.save();            this.loading = false;        },        save() {            localStorage.setItem(                'roulette',                JSON.stringify({                    levels: this.levels,                    progression: this.progression,                    minRank: this.minRank,                    maxRank: this.maxRank,                    progressionOrder: this.progressionOrder                }),            );        },        async onDone() {            if (!this.percentage) return;            let requiredPercentage = this.placeholder;
            if (this.percentage < requiredPercentage || this.percentage > 100) {                this.showToast(`Invalid percentage. Reach at least ${requiredPercentage}%!`);                return;            }
            this.progression.push(this.percentage);            this.percentage = undefined;
            if (this.gameMode === 'survival') {                const nextLevelData = this.levels[this.progression.length];                if (nextLevelData) {                    try {                        let levelName = "";                        if (typeof nextLevelData === 'string') {                            levelName = nextLevelData;                        } else if (nextLevelData && typeof nextLevelData === 'object') {                            levelName = nextLevelData.level || nextLevelData.name || (nextLevelData.level && nextLevelData.level.name) || "";                        }                        if (typeof levelName === 'object' && levelName !== null) {                            levelName = levelName.name || levelName.level || "";                        }
                        levelName = levelName.toLowerCase().replace(/\s+/g, '-');                        const response = await fetch(`data/${levelName}.json`);                        if (!response.ok) {                            this.survivalTarget = 1;                            this.save();                            return;                        }                        const detailedLevel = await response.json();                        this.survivalTarget = detailedLevel.secret_way_at || 1;                    } catch (err) {                        this.survivalTarget = 1;                    }                } else {                    this.survivalTarget = 1;                }            }            this.save();        },        onGiveUp() {            this.givenUp = true;            localStorage.removeItem('roulette');        },        onImport() {            if (this.isActive && !window.confirm('Overwrite current running roulette?')) return;            this.fileInput.showPicker();        },        async onImportUpload() {            if (this.fileInput.files.length === 0) return;            const file = this.fileInput.files[0];            try {                const roulette = JSON.parse(await file.text());                if (!roulette.levels || !roulette.progression) {                    this.showToast('Invalid file structure.');                    return;                }                this.levels = roulette.levels;                this.progression = roulette.progression;                if (roulette.minRank !== undefined) this.minRank = roulette.minRank;                if (roulette.maxRank !== undefined) this.maxRank = roulette.maxRank;                if (roulette.progressionOrder !== undefined) this.progressionOrder = roulette.progressionOrder;
                this.save();                this.givenUp = false;                this.showRemaining = false;                this.percentage = undefined;            } catch {                this.showToast('Invalid file parsing error.');            }        },        onExport() {            const file = new Blob(                [JSON.stringify({                    levels: this.levels,                    progression: this.progression,                    minRank: this.minRank,                    maxRank: this.maxRank,                    progressionOrder: this.progressionOrder                })],                { type: 'application/json' },            );            const a = document.createElement('a');            a.href = URL.createObjectURL(file);            a.download = 'tsl_roulette';            a.click();            URL.revokeObjectURL(a.href);        },        showToast(msg) {            this.toasts.push(msg);            setTimeout(() => { this.toasts.shift(); }, 3000);        },    },};