import { embed } from "../util.js";

export default {
    template: `
        <div style="width: 100%; height: calc(100vh - 56px); overflow-y: auto; color: #fff; font-family: sans-serif;">
                                    <div style="padding: 40px 20px; max-width: 900px; margin: 0 auto;">

                                    <!-- WELCOME PAGE UTILITY WIDGETS HOLDER -->
            <div class="welcome-widgets-grid">
                
                <!-- LEFT SIDE: EXPANDABLE SEARCH BAR WITH LIVE RESULTS FEED -->
                <div class="search-widget-column">
                    <div class="search-box" :class="{ active: isSearchActive }">
                        <input 
                            type="text" 
                            v-model="searchQuery" 
                            placeholder="Search levels, creators, or players..." 
                            @input="handleLiveTyping"
                            @keydown.down.prevent="moveHighlight(1)"
                            @keydown.up.prevent="moveHighlight(-1)"
                            @keydown.enter="selectHighlighted"
                            ref="searchInput"
                        >
                        <button class="search-btn" @click="toggleSearchBox">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>

                        <!-- DROPDOWN POPUP FEED -->
                        <div v-if="suggestions.length > 0 && isSearchActive" class="search-suggestions-dropdown">
                            <div 
                                v-for="(item, idx) in suggestions" 
                                :key="idx" 
                                class="suggestion-row"
                                :class="{ 'highlighted-row': idx === highlightIndex }"
                                @click="clickSuggestion(item)"
                            >
                                <span class="suggestion-name">{{ item.name }}</span>
                                <span class="suggestion-type">{{ item.type }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT SIDE: RESERVED SPACE FOR WAYBACK MACHINE -->
                <div class="wayback-widget-column">
                    <div class="wayback-placeholder-text">Wayback Archive Coming Soon...</div>
                </div>

            </div>





            <!-- Main Title Header -->
            <div style="margin-bottom: 30px;">

                    <h1 style="font-size: 2.2rem; margin: 0 0 5px 0; font-weight: bold; text-transform: uppercase; color: #fff;">
                        Welcome to The Secret Way Demonlist!
                    </h1>
                    <p style="color: #a29bfe; font-size: 1rem; margin: 0;">
                        The official hub for tracking the community's hardest secret way achievements.
                    </p>
                </div>

                <!-- General Information Box -->
                <div style="background: rgba(20, 15, 35, 0.8); padding: 25px; border-radius: 8px; border: 1px solid #4a3f75; margin-bottom: 25px;">
                    <h2 style="font-size: 1.5rem; margin: 0 0 12px 0; color: #e0d4ff;">Introduction - TSWD was Jackypoo's idea!</h2>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 15px 0;">
                        Hi everyone! This demonlist ranks the most difficult secret way levels within our community. Submissions are thoroughly inspected based on verification validity, mechanical difficulty, and strict submission guidelines. Secret ways must skip at least 30% of the level, however we do have 'Cool Secret Ways' which only require 20% - if you deem your secret way to be 'cool', request it in our <a href="https://discord.gg/rCEZZA9kZD" target="_blank" style="color: #9023d8; text-decoration: underline; font-weight: bold;">Discord Server</a>, and through polls, the community will decide if it should get added to the Demonlist or not!
                    </p>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0;">
                        Navigate using the top tabs to check out the Main Demonlist, Extended List, historic levels preserved in the Legacy List, the Unverified List which simply awaits new players to challenge and conquer its undefeated levels, our weekly demon challenge - and so much more! What will you choose to do here? Scroll down for more info and check us out!            ~Great Teratorn
                    </p>
                    
                </div>

                <!-- First Video Player (Introduction Video) -->
                <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; margin-bottom: 25px;">
                    <iframe class="video" id="videoframe1" :src="video1" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" frameborder="0" allowfullscreen></iframe>
                </div>


                <!-- Information Box -->
                <div style="background: rgba(15, 10, 25, 0.6); padding: 25px; border-radius: 8px; border-left: 4px solid #8a2be2; margin-bottom: 35px;">
                    <h3 style="font-size: 1.2rem; margin: 0 0 12px 0; color: #fff;">General Information</h3>
                    <ul style="padding-left: 20px; margin: 0; line-height: 1.7; color: #dde3ea; font-size: 1rem; font-weight: 500;">
                        <li style="margin-bottom: 8px;">The Main List contains the top 150 hardest secret way demon levels. The top 1 level is worth 150 points, and the points decrease by 1 with each level going down. So the top 2 level will be worth 149 points, and so on.</li>
                        <li>The Extended List contains all the secret way demons which are easier than the top 150. They are not worth any points.</li>
                        <li>The Legacy List is reserved solely for the levels which have fallen off the Main List, including the date which they lost their mightiness. So some levels will be both in the Extended and Legacy Lists. Legacy List levels are also not worth any points.</li>
                        <li>The Unverified List contains showcases of secret way levels which have not been verified yet. Any player can beat those secret way levels so that they can get added to the Main/Extended List.</li>
                        <li>The Anomalies List contains secret ways which are not accessible to all players, for instance a specific FPS being required to beat them. While they are not worth any points, they are there to check out and have fun with, so that they are not lost to history.</li>
                        <li>The Weekly Demon List is a weekly challenge where a level out of the top 150 is randomly selected and chosen for that week. Submit a record beating it and gain points on the Weekly Demons Leaderboard! Each week is worth 1 point, so every time you play, your points will accumulate - who are you going to compete with? NOTE: if you have already beaten that level, you must re-beat it for the Weekly Points. Each weekly demon is also declared in our <a href="https://discord.gg/rCEZZA9kZD" target="_blank" style="color: #9023d8; text-decoration: underline; font-weight: bold;">Discord Server</a>.</li>
                        <li>The Leaderboard presents the best secret way players out there! It includes their rank, their points and which levels they have verified or completed. It is split into the Main Leaderboard (Main Demonlist) and the Weekly Demons Leaderboard. Compete with other players in both to attempt to become the #1 Secret Way Player - unlocks a special role in our <a href="https://discord.gg/rCEZZA9kZD" target="_blank" style="color: #9023d8; text-decoration: underline; font-weight: bold;">Discord Server</a>!</li>
                        <li>Clicking the Discord logo in the top purple bar leads you to our <a href="https://discord.gg/rCEZZA9kZD" target="_blank" style="color: #9023d8; text-decoration: underline; font-weight: bold;">Discord Server</a> - please join, there is genuinely so much to do there! If you want any questions answered or want to offer something to our community, this is the place to do so :D</li>
                        <li>If you want to submit a completion or a verification of a secret way level, or a weekly demon completion: clicking the 'Submit Record' button in the top navbar opens up a form where you can fill out your secret way request, so that a new level can potentially get added to the Demonlist, or so that you can receive points if the level is already on there. The form provides a guide. </li>
                        <li>But most importantly, have fun and enjoy your time here! We can't wait for you to contribute!</li>
                    </ul>
                </div>
                
              
            <!-- Roulette Box -->
                <div style="background: rgba(20, 15, 35, 0.8); padding: 25px; border-radius: 8px; border: 1px solid #4a3f75; margin-bottom: 25px;">
                    <h2 style="font-size: 1.5rem; margin: 0 0 12px 0; color: #e0d4ff;">Roulette</h2>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 15px 0;">
                        For the Classic Random Roulette: players are assigned a random secret way demon and must get at least 1% on it. For each next random level, the required score goes up by 1%, repeating until they reach a goal of 100%. If you achieve a higher percentage than the required, you just continue on from that percentage.
                    </p>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 16px 0;">
                        For Standard Progression: same principle as the Classic Roulette, but it is no longer random. The levels go in order, so you can work your way through the levels consistently. 
                    </p>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 16px 0;">
                        For Secret Way Survival (Random): a secret way demon is randomly selected but each time, you have to meet the required percentage given - it is the first percentage of the secret way in that level. This allows you to actually reach the secret way i that level and experience it. 
                    </p>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 16px 0;">
                        For Secret Way Progression (Sequential): same as Secret Way Survival, but the secret ways are in order. This can motivate you to beat every secret way as you play every single level. After all, you are competing with others - don't you want to reach the top?
                    </p>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 16px 0;">
                        NOTE: additional features include a range - you can pick between which levels you want to play with in the roulette e.g. top 25 to top 75. The default is top 1 to top 150 - but you can also play with levels in the Extended List, and still customise your range!
                    </p>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 16px 0;">
                        NOTE: the Progression gamemodes also have a feature where you can pick what direction the level order goes - ascending or descending, depending on your difficulty preferences. Give the Roulette a go, and have fun!
                    </p>
                    
                </div>

<!-- Origins Heading -->
                <div style="margin-top: 20px;">
                    <h2 style="font-size: 1.6rem; margin: 0 0 15px 0; color: #e0d4ff; font-weight: bold; text-transform: uppercase;">
                        Origins
                    </h2>

                    <!-- Second Video Player (Origins Video) -->
                    <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; margin-bottom: 25px;">
                    <iframe class="video" id="videoframe2" :src="video2" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" frameborder="0" allowfullscreen></iframe>
                </div>


                    <!-- Origins Box -->
                <div style="background: rgba(20, 15, 35, 0.8); padding: 25px; border-radius: 8px; border: 1px solid #4a3f75; margin-bottom: 25px;">
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 15px 0;">
                        This was where it all began. It was an idea in Jackypoo's mind, and together with our moderators, we made it a reality. What began as a simple Discord server and a simplistic Google Site evolved into this. Before the details, the submissions, the designs - it was just a List. And we are all so happy this idea was brought to life, and the opportunities that are yet to come. We hope you enjoy your time here as much as us :)
                    </p>
                    <p style="margin: 20px 0 0 0; padding: 0; color: #ffffff; font-size: 1rem; line-height: 1.7;">Click here to check out our original Google Site:<a href="https://sites.google.com/view/the-secret-way-demonlist/demonlist" target="_blank" style="display: inline-block; padding: 6px 14px; background-color: #2563eb; color: #ffffff; font-weight: bold; border-radius: 4px; text-decoration: none; font-size: 0.9rem; margin-left: 8px; vertical-align: middle; transition: opacity 0.2s;">Google Site</a></p>
                </div>

<!-- CONTACT WRAPPER BOX -->
<div style="background: rgba(10, 10, 10, 0.75); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 25px; margin-top: 40px; margin-bottom: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);">
    
    <!-- Contact Note Content -->
    <p style="text-align: center; color: #ffffff; font-size: 0.95rem; line-height: 1.6; margin: 0 0 25px 0;">
        <strong style="color: #39ff14; font-size: 1.05rem; text-shadow: 0 0 8px rgba(57,255,20,0.3);">Have any questions or need to reach out to us?</strong><br>
        If you need to contact us regarding submissions, list issues, or feedback - please message us directly through our <a href="https://discord.gg/rCEZZA9kZD" target="_blank" style="text-decoration: underline;">Discord Server</a>.
    </p>

     <!-- Site Counter -->
    <div class="site-counter" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; text-align: center;">
        <p style="font-size: 0.8rem; color: #39ff14; margin-bottom: 8px; width: 100%;">Total Site Visits</p>
        <img src="https://hits.sh/great-teratorn.github.io/The-Secret-Way-Demonlist.svg?label=Views&color=1D6847&labelColor=1a1a1a&style=flat-square" alt="Total Site Visits" style="display: block; margin: 0 auto; max-width: fit-content;"/>
    </div>

    </div>


                            </div> <!-- Line 116: Closes the main description container box -->

        <!-- PASTE HERE -->
        <div class="site-credits" style="margin-top: 50px; margin-bottom: 30px; padding-top: 20px; text-align: center; width: 100%;">
            <p style="font-size: 0.85rem; color: #94a3b8; margin: 0 0 6px 0; letter-spacing: 0.5px; text-transform: uppercase; font-weight: bold;">Website Credits</p>
            <p style="font-size: 0.95rem; color: #cbd5e1; margin: 0; line-height: 1.6;">
                Original Idea by <span style="color: #a29bfe; font-weight: bold;">Jackypoo</span> • 
                Entire Website Development and Roulette Gamemodes by <span style="color: #2563eb; font-weight: bold;">Great Teratorn</span> • 
                Template by <span style="color: #94a3b8; font-style: italic;">TheShittyList</span> •
                Classic Roulette by <span style="color: #94a3b8; font-style: italic;">matcool</span>
            </p>
        </div>

    </div> <!-- Line 118: Closes the absolute main outer wrapper -->

       
        
            </div>

    
        `,
    computed: {
    video1() {
        return embed("https://www.youtube.com/watch?v=S7BtDDTYVLM");
    },
    video2() {
        return embed("https://www.youtube.com/watch?v=S7BtDDTYVLM");
    }
},

        data() {
        return {
            isSearchActive: false,
            searchQuery: '',
            suggestions: [],
            highlightIndex: -1,
            // Universal Search Index Repository
            searchDatabase: []
        };
    },
    mounted() {
        this.buildSearchDatabase();
    },
    methods: {
        async buildSearchDatabase() {
            try {
                // Fetch official list content directly to index levels and creators dynamically
                const resList = await fetch('./data/list.json');
                if (resList.ok) {
                    const data = await resList.json();
                    data.forEach(lvl => {
                        this.searchDatabase.push({ name: lvl.name, type: 'Level', route: '/list' });
                        if (lvl.author) this.searchDatabase.push({ name: lvl.author, type: 'Creator', route: '/list' });
                        if (lvl.verifier) this.searchDatabase.push({ name: lvl.verifier, type: 'Verifier', route: '/list' });
                    });
                }
                // Fetch leaderboard profile rows
                const resBoard = await fetch('./data/leaderboard.json');
                if (resBoard.ok) {
                    const data = await resBoard.json();
                    data.forEach(player => {
                        this.searchDatabase.push({ name: player.name, type: 'Player', route: '/leaderboard' });
                    });
                }
                // Deduplicate repeating item rows smoothly
                this.searchDatabase = this.searchDatabase.filter((v, i, a) => a.findIndex(t => t.name === v.name && t.type === v.type) === i);
            } catch (e) { console.error("Database indexing skipped:", e); }
        },
        toggleSearchBox() {
            this.isSearchActive = !this.isSearchActive;
            if (this.isSearchActive) {
                this.$nextTick(() => { if (this.$refs.searchInput) this.$refs.searchInput.focus(); });
            } else {
                this.searchQuery = '';
                this.suggestions = [];
            }
        },
        // Fuzzy String Matcher Strategy (Levenshtein Distance Approximation)
        fuzzyMatch(str, search) {
            if (str.includes(search)) return true;
            let editDistance = 0;
            let i = 0, j = 0;
            while (i < search.length && j < str.length) {
                if (search[i] === str[j]) { i++; } else { editDistance++; }
                j++;
            }
            editDistance += (search.length - i);
            return editDistance <= 2; // Allows up to 2 misspellings/missing letters cleanly
        },
        handleLiveTyping() {
            const raw = this.searchQuery.toLowerCase().trim();
            this.highlightIndex = -1;
            if (raw.length < 2) { this.suggestions = []; return; }
            
            // Filter database via exact text inclusions OR fuzzy spelling approximations
            this.suggestions = this.searchDatabase.filter(item => {
                const name = item.name.toLowerCase();
                return name.includes(raw) || this.fuzzyMatch(name, raw);
            }).slice(0, 6); // Cap drop panel viewport items at 6 entries max for perfect mobile compliance
        },
        moveHighlight(dir) {
            this.highlightIndex = (this.highlightIndex + dir + this.suggestions.length) % this.suggestions.length;
        },
        selectHighlighted() {
            if (this.highlightIndex >= 0 && this.highlightIndex < this.suggestions.length) {
                this.clickSuggestion(this.suggestions[this.highlightIndex]);
            } else if (this.searchQuery.trim().length > 0) {
                localStorage.setItem('pendingListSearch', this.searchQuery.trim());
                window.location.hash = '/list';
            }
        },
        clickSuggestion(item) {
            localStorage.setItem('pendingListSearch', item.name);
            this.suggestions = [];
            this.searchQuery = '';
            window.location.hash = item.route;
        }
    }
};