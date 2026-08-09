import { embed } from "../util.js";

export default {
    template: `
        <div style="width: 100%; height: calc(100vh - 56px); overflow-y: auto; color: #fff; font-family: sans-serif;">
            <div style="padding: 40px 20px; max-width: 900px; margin: 0 auto;">

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
                    <h2 style="font-size: 1.5rem; margin: 0 0 12px 0; color: #e0d4ff;">Introduction</h2>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 15px 0;">
                        This list ranks the most difficult secret way levels within our community. Submissions are thoroughly inspected based on verification validity, mechanical difficulty, and strict submission guidelines.
                    </p>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0;">
                        Navigate using the top tabs to check out the Main Demonlist, Extended List, historic levels preserved in the Legacy List, and the Unverified List which simply awaits new players to challenge and conquer its undefeated levels. What will you choose to do here? Scroll down for more info. 
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
                        <li>The Leaderboard contains the best secret way players out there! It includes their rank, their points and which levels they have beaten.</li>
                        <li>For the Roulette: players are assigned a random secret way demon and must get at least 1%. For each next random level, the required score goes up by 1%, repeating until they reach a goal of 100%. If you achieve a higher percentage than the required, you just continue from then on.</li>
                        <li>Clicking the Discord logo in the top purple bar leads you to our Discord Server - please join, there is genuinely so much to do there! If you want any questions answered or want to offer something to our community, this is the place :D</li>
                        <li>If you want to submit a completion or a verification of a secret way level: clicking the 'Submit Record' button opens up a form where you can fill out your secret way request, so that a new level can potentially get added to the Demonlist, or so that you can receive points if the level is already on there. The form provides a guide. </li>
                        <li>But most importantly, have fun and enjoy your time here!</li>
                    </ul>
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
                        This was where it all began. It was an idea in Jackypoo's mind, and together with our moderators we made it a reality. What began as a simple Discord server and a simplistic Google Site evolved into this. Before the details, the submissions, the designs - it was just a List. And we are all so happy this idea was brought to life. We hope you enjoy your time here as much as us :)
                    </p>
                    <p style="margin: 20px 0 0 0; padding: 0; color: #ffffff; font-size: 1rem; line-height: 1.7;">Click here to check out our original Google Site:<a href="https://sites.google.com/view/the-secret-way-demonlist/demonlist" target="_blank" style="display: inline-block; padding: 6px 14px; background-color: #2563eb; color: #ffffff; font-weight: bold; border-radius: 4px; text-decoration: none; font-size: 0.9rem; margin-left: 8px; vertical-align: middle; transition: opacity 0.2s;">Google Site</a></p>
                </div>

<!-- CONTACT WRAPPER BOX -->
<div style="background: rgba(10, 10, 10, 0.75); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 25px; margin-top: 40px; margin-bottom: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);">
    
    <!-- Contact Note Content -->
    <p style="text-align: center; color: #ffffff; font-size: 0.95rem; line-height: 1.6; margin: 0 0 25px 0;">
        <strong style="color: #39ff14; font-size: 1.05rem; text-shadow: 0 0 8px rgba(57,255,20,0.3);">Have any questions or need to reach out to us?</strong><br>
        If you need to contact us regarding submissions, list issues, or feedback, please message us directly through our official Discord Server.
    </p>

     <!-- Site Counter -->
    <div class="site-counter" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; text-align: center;">
        <p style="font-size: 0.8rem; color: #39ff14; margin-bottom: 8px; width: 100%;">Total Site Visits</p>
        <img src="https://hits.sh/great-teratorn.github.io/The-Secret-Way-Demonlist.svg?label=Views&color=1D6847&labelColor=1a1a1a&style=flat-square" alt="Total Site Visits" style="display: block; margin: 0 auto; max-width: fit-content;"/>
    </div>

    </div>


                    </div>

            </div>
       
        
            </div>

    
        `,
    computed: {
    video1() {
        return embed("https://www.youtube.com/watch?v=S7BtDDTYVLM");
    },
    video2() {
        return embed("https://www.youtube.com/watch?v=S7BtDDTYVLM");
    }
}

};
