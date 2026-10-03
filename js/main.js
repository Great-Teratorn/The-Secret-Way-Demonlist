import routes from './routes.js';

let darkModeClicks = 0;
let darkModeTimer = null;

let chaosRunning = false;
let chaosTimeout = null;
let achievementTimeout = null;

let darkModeClickLocked = false;


/* ============================================================
   HELPERS
   ============================================================ */

function getOverlay() {
    return document.getElementById('tswd-dark-overlay');
}


function moveChaosOverlayOutsideApp() {

    const overlay =
        document.getElementById('tswd-dark-overlay');

    if (!overlay) return;

    /*
     * Move ONLY the troll overlay outside
     * the shaking #app/body.
     *
     * The actual website stays completely untouched.
     */
    if (overlay.parentElement !== document.documentElement) {

        document.documentElement.appendChild(
            overlay
        );
    }
}


/* ============================================================
   NORMAL DARK-MODE TEASE
   ============================================================ */

function showNormalDarkness(clickNumber) {

    const overlay = getOverlay();

    if (!overlay) return;

    const messages = {
        1: 'You know the website is already dark, right?',
        2: 'You clicked it again.',
        3: 'Are you expecting something to happen?',
        4: 'This is getting embarrassing.',
        5: "I'm starting to think you have a problem.",
        6: 'You could stop at any time.',
        7: 'You are actively making this worse.',
        8: 'Why are you still doing this?',
        9: 'One more click. Do you really want to do this?'
    };

    overlay.className =
        'tswd-dark-overlay tswd-tease';

    overlay.style.setProperty(
        '--tswd-darkness',
        '0.78'
    );

    const message =
        document.getElementById(
            'tswd-tease-message'
        );

    if (message) {

        message.textContent =
            messages[clickNumber] || '';

        message.classList.remove(
            'tswd-tease-message-visible'
        );

        void message.offsetWidth;

        message.classList.add(
            'tswd-tease-message-visible'
        );
    }

    document.body.classList.add(
        'tswd-teasing'
    );


    setTimeout(() => {

        /*
         * Do not accidentally remove a chaos sequence
         * that may have started since this tease began.
         */
        if (chaosRunning) return;

        overlay.className =
            'tswd-dark-overlay';

        document.body.classList.remove(
            'tswd-teasing'
        );

        if (message) {

            message.classList.remove(
                'tswd-tease-message-visible'
            );
        }

    }, 1800);
}


/* ============================================================
   CONFETTI
   ============================================================ */

function createConfetti() {

    const container =
        document.getElementById(
            'tswd-confetti'
        );

    if (!container) return;

    container.innerHTML = '';

    const colours = [
        '#00ff66',
        '#6200ea',
        '#ff006e',
        '#00e5ff',
        '#ffff00',
        '#ffffff'
    ];

    const count =
        window.innerWidth <= 768
            ? 45
            : 90;


    for (let i = 0; i < count; i++) {

        const piece =
            document.createElement('div');

        piece.className =
            'tswd-confetti-piece';

        piece.style.left =
            `${Math.random() * 100}%`;

        piece.style.backgroundColor =
            colours[
                Math.floor(
                    Math.random() *
                    colours.length
                )
            ];

        piece.style.setProperty(
            '--confetti-x',
            `${(Math.random() - 0.5) * 500}px`
        );

        piece.style.setProperty(
            '--confetti-rotation',
            `${Math.random() * 1080 - 540}deg`
        );

        piece.style.setProperty(
            '--confetti-duration',
            `${2 + Math.random() * 2}s`
        );

        piece.style.width =
            `${5 + Math.random() * 6}px`;

        piece.style.height =
            `${7 + Math.random() * 8}px`;

        container.appendChild(piece);
    }
}


/* ============================================================
   ACHIEVEMENT
   ============================================================ */

function showAchievement() {

    const achievement =
        document.getElementById(
            'tswd-achievement'
        );

    if (!achievement) {

        console.warn(
            '[TSWD] Achievement element not found.'
        );

        return;
    }


    /*
     * Remove the class first so repeated runs can
     * reliably restart the CSS animation.
     */
    achievement.classList.remove(
        'tswd-achievement-visible'
    );

    void achievement.offsetWidth;

    achievement.classList.add(
        'tswd-achievement-visible'
    );
}


/* ============================================================
   CLEANUP
   ============================================================ */

function cleanupChaos() {

    clearTimeout(chaosTimeout);
    clearTimeout(achievementTimeout);

    chaosTimeout = null;
    achievementTimeout = null;


    document.body.classList.remove(
        'tswd-chaos'
    );

    document.body.classList.remove(
        'tswd-teasing'
    );


    const overlay =
        getOverlay();

    if (overlay) {

        overlay.className =
            'tswd-dark-overlay';

        overlay.style.removeProperty(
            '--tswd-darkness'
        );
    }


    const achievement =
        document.getElementById(
            'tswd-achievement'
        );

    if (achievement) {

        achievement.classList.remove(
            'tswd-achievement-visible'
        );
    }


    const confetti =
        document.getElementById(
            'tswd-confetti'
        );

    if (confetti) {

        confetti.innerHTML = '';
    }


chaosRunning = false;
darkModeClicks = 0;
darkModeClickLocked = false;
}


/* ============================================================
   10TH CLICK CHAOS
   ============================================================ */


function triggerChaos() {
    if (chaosRunning) return;

    chaosRunning = true;

    const overlay = getOverlay();

    if (!overlay) {
        chaosRunning = false;
        return;
    }

    /*
     * Kill the previous "one more click" message immediately.
     */
    const message = document.getElementById(
        'tswd-tease-message'
    );

    if (message) {
        message.classList.remove(
            'tswd-tease-message-visible'
        );

        message.textContent = '';
    }

    /*
     * Start the chaos.
     */
    document.body.classList.remove(
        'tswd-teasing'
    );

    document.body.classList.add(
        'tswd-chaos'
    );

    overlay.className =
        'tswd-dark-overlay tswd-chaos';


    /*
     * CHAOS RUNS FOR A WHILE.
     *
     * The achievement does NOT appear yet.
     */
    const achievementTimer = setTimeout(() => {

        /*
         * By this point the screen should be black.
         * Now reveal the achievement as the aftermath.
         */
        showAchievement();
        createConfetti();

    }, 8100);


    /*
     * Complete cleanup.
     *
     * Give the achievement plenty of time to remain
     * visible before resetting everything.
     */
    const cleanupTimer = setTimeout(() => {

        document.body.classList.remove(
            'tswd-chaos'
        );

        overlay.className =
            'tswd-dark-overlay';


        const achievement =
            document.getElementById(
                'tswd-achievement'
            );

        if (achievement) {
            achievement.classList.remove(
                'tswd-achievement-visible'
            );
        }


        const confetti =
            document.getElementById(
                'tswd-confetti'
            );

        if (confetti) {
            confetti.innerHTML = '';
        }


        chaosRunning = false;
        darkModeClickLocked = false;
    }, 15500);
}





/* ============================================================
   MOON BUTTON
   ============================================================ */

function handleDarkModeClick() {

    /*
     * Ignore clicks while the current tease is visible.
     */
    if (darkModeClickLocked) return;

    /*
     * Ignore everything once the 10th-click chaos has started.
     */
    if (chaosRunning) return;


    darkModeClicks++;


    /*
     * Lock the button so the current message cannot
     * be interrupted or restarted.
     */
    darkModeClickLocked = true;


    /*
     * Cancel the previous inactivity timer.
     */
    clearTimeout(darkModeTimer);


    /*
     * ========================================================
     * CLICKS 1–9
     * ========================================================
     */

    if (darkModeClicks < 10) {

        showNormalDarkness(
            darkModeClicks
        );


        /*
         * Unlock after the 1.8 second tease finishes.
         */
        setTimeout(() => {

            darkModeClickLocked = false;

        }, 1800);


        /*
         * If they don't click again for 5 seconds,
         * reset the click counter.
         */
        darkModeTimer = setTimeout(() => {

            darkModeClicks = 0;

        }, 5000);


        return;
    }


    /*
     * ========================================================
     * 10TH CLICK
     * ========================================================
     */

    if (darkModeClicks === 10) {

        darkModeClicks = 0;

        clearTimeout(darkModeTimer);

        /*
         * Keep the button locked for the entire
         * chaos + achievement sequence.
         */
        triggerChaos();

        return;
    }
}


/* ============================================================
   VUE STORE
   ============================================================ */

export const store =
    Vue.reactive({

        /*
         * Kept for compatibility with the
         * existing Vue application.
         */
        dark: false,


        toggleDark() {

            handleDarkModeClick();

        }

    });


/* ============================================================
   VUE APP
   ============================================================ */

const app =
    Vue.createApp({

        data: () => ({

            store

        })

    });


/* ============================================================
   ROUTER
   ============================================================ */

const router =
    VueRouter.createRouter({

        history:
            VueRouter.createWebHashHistory(),

        routes

    });


app.use(router);

app.mount('#app');

moveChaosOverlayOutsideApp();
