export default {
    template: `
        <main class="page-welcome" style="position: absolute; left: 0; right: 0; width: 100%; max-width: 1000px; margin: 0 auto; padding: 40px 20px; color: #fff; font-family: sans-serif; z-index: 999; box-sizing: border-box;">
            
            <!-- Header Block -->
            <div style="margin-bottom: 30px;">
                <h1 style="font-size: 2.5rem; margin: 0 0 5px 0; font-weight: bold; text-transform: uppercase; color: #fff;">
                    Welcome to the Demonlist
                </h1>
                <p style="color: #a29bfe; font-size: 1.1rem; margin: 0;">
                    The official hub for tracking the community's hardest achievements.
                </p>
            </div>

            <!-- Two Column Flex Grid Split -->
            <div style="display: flex; gap: 40px; flex-wrap: wrap; width: 100%;">
                
                <!-- Left Side: Video + General Info -->
                <div style="flex: 1; min-width: 320px;">
                    <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: #000; border-radius: 8px; margin-bottom: 25px;">
                        <iframe 
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                            src="https://youtube.com" 
                            title="Demonlist Introduction Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    
                    <h2 style="font-size: 1.6rem; margin: 0 0 10px 0; color: #e0d4ff;">General Information</h2>
                    <p style="line-height: 1.6; font-size: 1rem; color: #cbd5e1; margin: 0 0 15px 0;">
                        This list ranks the most difficult custom levels created within our community. Entries are thoroughly vetted based on verification validity, mechanical difficulty, and strict submission guidelines.
                    </p>
                    <p style="line-height: 1.6; font-size: 1rem; color: #cbd5e1; margin: 0;">
                        Navigate using the top tabs to check out the Main Demonlist, Extended list cutoffs, or historic levels resting safely in the Legacy bracket.
                    </p>
                </div>

                <!-- Right Side: Submission Requirements Box -->
                <div style="flex: 1; min-width: 320px; background: rgba(20, 15, 35, 0.85); padding: 25px; border-radius: 8px; border: 1px solid #4a3f75; height: fit-content;">
                    <h3 style="font-size: 1.4rem; margin: 0 0 15px 0; color: #fff; padding-bottom: 8px; border-bottom: 2px solid #8a2be2;">
                        Submission Requirements
                    </h3>
                    <ul style="padding-left: 20px; margin: 0; line-height: 1.8; color: #94a3b8; font-size: 1rem;">
                        <li style="margin-bottom: 10px;">Clicks or taps must be clearly audible in your video.</li>
                        <li style="margin-bottom: 10px;">The record must be achieved without any layout-altering modifications.</li>
                        <li>A raw, unedited footage link must be provided upon request.</li>
                    </ul>
                </div>

            </div>

        </main>
    `
};
