export default {
    template: `
        <div style="padding: 40px 20px; max-width: 900px; margin: 0 auto; color: #fff; font-family: sans-serif; height: 100%; overflow-y: auto;">
            
            <!-- Main Title Header -->
            <div style="margin-bottom: 30px;">
                <h1 style="font-size: 2.2rem; margin: 0 0 5px 0; font-weight: bold; text-transform: uppercase; color: #fff;">
                    Welcome to the Demonlist
                </h1>
                <p style="color: #a29bfe; font-size: 1rem; margin: 0;">
                    The official hub for tracking the community's hardest achievements.
                </p>
            </div>

            <!-- Video Frame Container -->
            <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: #000; border-radius: 8px; margin-bottom: 30px; border: 1px solid #4a3f75;">
                <iframe 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                    src="https://youtube.com" 
                    title="Demonlist Introduction Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>

            <!-- Text Content Stack Block -->
            <div style="background: rgba(20, 15, 35, 0.8); padding: 25px; border-radius: 8px; border: 1px solid #4a3f75; margin-bottom: 25px;">
                <h2 style="font-size: 1.5rem; margin: 0 0 12px 0; color: #e0d4ff;">General Information</h2>
                <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 15px 0;">
                    This list ranks the most difficult custom levels created within our community. Entries are thoroughly vetted based on verification validity, mechanical difficulty, and strict submission guidelines.
                </p>
                <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0;">
                    Navigate using the top tabs to check out the Main Demonlist, Extended list cutoffs, or historic levels resting safely in the Legacy bracket.
                </p>
            </div>

            <!-- Requirements Callout Panel -->
            <div style="background: rgba(15, 10, 25, 0.6); padding: 25px; border-radius: 8px; border-left: 4px solid #8a2be2;">
                <h3 style="font-size: 1.2rem; margin: 0 0 12px 0; color: #fff;">Submission Requirements</h3>
                <ul style="padding-left: 20px; margin: 0; line-height: 1.7; color: #94a3b8; font-size: 0.95rem;">
                    <li style="margin-bottom: 8px;">Clicks or taps must be clearly audible in your video.</li>
                    <li style="margin-bottom: 8px;">The record must be achieved without any layout-altering modifications.</li>
                    <li>A raw, unedited footage link must be provided upon request.</li>
                </ul>
            </div>
                        <!-- ==========================================================================
               NEW ORIGINS SECTION STACKED AT THE BOTTOM
               ========================================================================== -->
            <div style="margin-top: 20px;">
                <h2 style="font-size: 1.6rem; margin: 0 0 15px 0; color: #e0d4ff; font-weight: bold; text-transform: uppercase;">
                    Origins
                </h2>

                <!-- Second Embedded Player (Replicates your first video layout exactly) -->
                <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; margin-bottom: 20px;">
                    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" src="https://youtu.be/S7BtDDTYVLM?si=ykySW6CdVkVGJeka" title="TSWD Origins Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>

                <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0;">
                    This was the beginning of our project, a great one. We wanted to challenge people in a unique and benefitting way. What started as a basic Google site has now been transformed into an incredible community. Before all the details, the submissions, the multitude of levels - it was just a List. But now it is so much more, and we are so proud. 
                </p>
            </div>

        </div>
    `
};