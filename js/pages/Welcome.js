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
                    <h2 style="font-size: 1.5rem; margin: 0 0 12px 0; color: #e0d4ff;">General Information</h2>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0 0 15px 0;">
                        This list ranks the most difficult secret way levels within our community. Submissions are thoroughly inspected based on verification validity, mechanical difficulty, and strict submission guidelines.
                    </p>
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0;">
                        Navigate using the top tabs to check out the Main Demonlist, Extended List, historic levels preserved in the Legacy List, and the Unverified List which simply awaits new players to challenge and conquer its undefeated levels. What will you choose to do here?
                    </p>
                </div>

                <!-- First Video Player (Using the template method) -->
                <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; margin-bottom: 25px;">
                    <iframe class="video" id="videoframe" :src="embed(introVideo)" frameborder="0" allowfullscreen></iframe>
                </div>

                <!-- Submission Requirements Box -->
                <div style="background: rgba(15, 10, 25, 0.6); padding: 25px; border-radius: 8px; border-left: 4px solid #8a2be2; margin-bottom: 35px;">
                    <h3 style="font-size: 1.2rem; margin: 0 0 12px 0; color: #fff;">Submission Requirements</h3>
                    <ul style="padding-left: 20px; margin: 0; line-height: 1.7; color: #94a3b8; font-size: 0.95rem;">
                        <li style="margin-bottom: 8px;">Clicks or taps must be clearly audible in your video.</li>
                        <li style="margin-bottom: 8px;">The record must be achieved without any layout-altering modifications.</li>
                        <li>A raw, unedited footage link must be provided upon request.</li>
                    </ul>
                </div>

                <!-- Origins Heading -->
                <div style="margin-top: 20px;">
                    <h2 style="font-size: 1.6rem; margin: 0 0 15px 0; color: #e0d4ff; font-weight: bold; text-transform: uppercase;">
                        Origins
                    </h2>

                    <!-- Second Video Player (Using the template method) -->
                    <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; margin-bottom: 20px;">
                        <iframe class="video" id="videoframe" :src="embed(originsVideo)" frameborder="0" allowfullscreen></iframe>
                    </div>

                    <!-- Origins Paragraph Text -->
                    <p style="line-height: 1.6; font-size: 0.95rem; color: #cbd5e1; margin: 0;">
                        This was the beginning of our project, a great one. We wanted to challenge players to find the most creative routes.
                    </p>
                </div>

            </div>
        </div>
    `,
    // Define the string links
    data() {
        return {
            introVideo: "https://www.youtube.com/watch?v=S7BtDDTYVLM",
            originsVideo: "https://www.youtube.com/watch?v=S7BtDDTYVLM"
        };
    },
    // The exact same link formatting helper used by List.js to bypass proxy blocks
    methods: {
        embed(url) {
            if (!url) return "";
            // Safely extracts the ID and returns a clean embed string
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            const id = (match && match[2].length === 11) ? match[2] : null;
            return id ? `https://youtube.com{id}` : url;
        }
    }
};
