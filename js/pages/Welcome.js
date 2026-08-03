export default {
    template: `
        <main class="page-welcome" style="position: relative; z-index: 10; padding: 60px 20px; max-width: 800px; margin: 0 auto; color: #fff; font-family: sans-serif; text-align: left;">
            
            <h1 style="font-size: 2.8rem; margin-bottom: 5px; font-weight: bold; text-transform: uppercase;">
                Welcome to the Demonlist
            </h1>
            <p style="color: #a29bfe; font-size: 1.1rem; margin-bottom: 40px;">
                The official hub for tracking the community's hardest achievements.
            </p>

            <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; border-radius: 8px; margin-bottom: 40px;">
                <iframe 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                    src="https://youtube.com" 
                    title="Demonlist Introduction Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>

            <div style="margin-bottom: 30px;">
                <h2 style="font-size: 1.8rem; margin-bottom: 15px; color: #e0d4ff;">General Information</h2>
                <p style="line-height: 1.8; font-size: 1.1rem; margin-bottom: 15px; color: #cbd5e1;">
                    This list ranks the most difficult custom levels created within our community. Entries are thoroughly vetted based on verification validity, mechanical difficulty, and strict submission guidelines.
                </p>
                <p style="line-height: 1.8; font-size: 1.1rem; color: #cbd5e1;">
                    Navigate using the top tabs to check out the Main Demonlist, Extended list cutoffs, or historic levels resting safely in the Legacy bracket.
                </p>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #4a3f75;">
                <h3 style="font-size: 1.4rem; margin-bottom: 15px; color: #fff;">Submission Requirements</h3>
                <ul style="padding-left: 20px; line-height: 2; color: #94a3b8; font-size: 1.05rem;">
                    <li>Clicks or taps must be clearly audible in your video.</li>
                    <li>The record must be achieved without any layout-altering modifications.</li>
                    <li>A raw, unedited footage link must be provided upon request.</li>
                </ul>
            </div>

        </main>
    `
};
