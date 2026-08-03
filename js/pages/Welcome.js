export default {
    template: `
        <main class="page-welcome" style="padding: 40px 20px; max-width: 900px; margin: 0 auto; color: #fff; font-family: sans-serif;">
            
            <!-- Main Title Header -->
            <h1 style="font-size: 2.8rem; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; tracking: 1px;">
                Welcome to the Demonlist
            </h1>
            <p style="color: #a29bfe; font-size: 1.1rem; margin-bottom: 40px;">
                The official hub for tracking the community's hardest achievements.
            </p>

            <!-- Video Section Container -->
            <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; border-radius: 8px; margin-bottom: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
                <!-- Replace the YouTube URL below (after embed/) with your own video code -->
                <iframe 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                    src="https://youtube.com" 
                    title="Demonlist Introduction Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>

            <!-- General Information Grid Section -->
            <section style="background: rgba(30, 25, 50, 0.6); padding: 30px; border-radius: 8px; border: 1px solid #4a3f75; margin-bottom: 30px;">
                <h2 style="font-size: 1.8rem; margin-bottom: 15px; color: #e0d4ff;">General Information</h2>
                <p style="line-height: 1.7; font-size: 1.05rem; margin-bottom: 15px; color: #cbd5e1;">
                    This list ranks the most difficult custom levels created within our community. Entries are thoroughly vetted based on verification validity, mechanical difficulty, and strict submission guidelines.
                </p>
                <p style="line-height: 1.7; font-size: 1.05rem; color: #cbd5e1;">
                    Navigate using the top tabs to check out the Main Demonlist, Extended list cutoffs, or historic levels resting safely in the Legacy bracket.
                </p>
            </section>

            <!-- Rules / Submissions Callout -->
            <section style="background: rgba(20, 15, 35, 0.4); padding: 25px; border-radius: 8px; border-left: 4px solid #8a2be2;">
                <h3 style="font-size: 1.3rem; margin-bottom: 10px; color: #fff;">Submission Requirements</h3>
                <ul style="padding-left: 20px; line-height: 1.8; color: #94a3b8;">
                    <li>Clicks or taps must be clearly audible in your video.</li>
                    <li>The record must be achieved without any layout-altering modifications.</li>
                    <li>A raw, unedited footage link must be provided upon request.</li>
                </ul>
            </section>

        </main>
    `
};
