const app = Vue.createApp({
    data() {
        return {
            video_paths: [],
            video_base_names: [],
            video_main_names: [],
            video_descriptions: [],
            video_durations: [],
            video_players: [],
            selected_video_id: null,
            display_main_player: false,
            play_button: { fill: "./assets/play_fill.png", nofill: "./assets/play_nofill.png", hoveredIndex: null },
            close: {timesClicked: 0, lastClickTime: null},

        };
    },
    async mounted() {
        this.modal = document.getElementById("modal-content");
        await this.getVideoPaths();

        this.$nextTick( async () => {
            await this.loadMainVideoPlayer();
            this.main_video_player.on("ended", () => {
                console.log("ENDED")
                this.closePlayer()
            })

        });
    },
    methods: {
        handleCloseButton() {
            const date = new Date();
            const currentTime = date.getTime()
            const timePassed = currentTime - this.close.lastClickTime
            
            if (timePassed<1000) {
                this.close.timesClicked++
            } else {
                this.close.timesClicked = 1
            }

            this.close.lastClickTime = date.getTime();
            console.log(this.close.timesClicked, timePassed)

            if (this.close.timesClicked >= 3){
                console.log("Close")
                const { ipcRenderer } = require('electron');
                ipcRenderer.send('quit-app');
            }

        },

        async getVideoPaths() {
            try {
                const response = await fetch('http://localhost:3000/video-parser/getVideoPaths', {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json()
                console.log("Response", data)

                this.video_base_names =  data.videoBaseNames
                this.video_main_names = data.videoMainNames
                this.video_descriptions = data.videoDescriptions
                this.video_durations = data.videoDurations
                this.video_paths = data.videoPaths
                

            } catch (error) {
                console.error('Failed to fetch video paths:', error);
            }
        },
        async loadMainVideoPlayer() {
            this.main_video_player = await videojs("videoPlayerMain");
        },
        async updateMainVideo(id) {
            this.selected_video_id = id;
            this.main_video_player.src({
                src: `http://localhost:3000/`+this.video_paths[id]
            });
            this.display_main_player = true;
            this.main_video_player.play();
        },
        closePlayer() {
            this.display_main_player = false;
            this.main_video_player.pause();
        },
        async loadVideoPlayers() {
            for (let id = 0; id < this.video_paths.length; id++) {
                this.loadVideoPlayer(id);
            }
        },
        async loadVideoPlayer(id) {
            this.video_players[id] = videojs("videoPlayer" + id);
            const video_player = this.video_players[id];
            const video_path = this.video_paths[id];

            console.log("Loading", video_path);
            console.log("Loading", video_player);

            let type = '';
            try {
                if (video_path.endsWith('.mp4')) {
                    type = 'video/mp4';
                } else if (video_path.endsWith('.ogv') || video_path.endsWith('.ogg')) {
                    type = 'video/ogg';
                } else if (video_path.endsWith('.webm')) {
                    type = 'video/webm';
                } else {
                    throw new Error('Unsupported video format');
                }

                video_player.src({
                    type: type,
                    src: video_path
                });

                await video_player.load();
            } catch (error) {
                console.error(`Error loading Video Player (id: ${id})`, error);
            }
        },

    },
});

app.mount('#app');