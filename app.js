app = Vue.createApp({

    data() {
        return {
            video_paths: [],
            video_basenames: [],
            video_players: [],
            selected_video_id: null,
            display_main_player: false,
        }
    },

    async mounted() {

        this.modal = document.getElementById("modal-content")
        await this.getVideoPaths();

        this.$nextTick(()=>{
            // this.loadVideoPlayers()
            this.loadMainVideoPlayer()
        })
    },

    methods: {

        async getVideoPaths(){
            const response = await fetch('/video-parser/getVideoPaths', {
                method: 'GET',
            });

            const data = await response.json();
            console.log("Response", data)

            this.video_paths = data.videoPaths
            this.video_basenames = data.videoBasenames

        },
        getBasenames(){
            for (let x = 0; x<this.video_paths.length; x++){
                const basename = this.video_paths.split('/')[-1].split('')
                this.video_basenames[x] = basename
            }
        },
        async loadVideoPlayers(){
            for (let id = 0; id < this.video_paths.length; id++)
                this.loadVideoPlayer(id);
        },
        async loadVideoPlayer(id) {

            this.video_players[id] = videojs("videoPlayer"+id)
            const video_player = this.video_players[id]
            const video_path = this.video_paths[id]

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
        async loadMainVideoPlayer(){
            this.main_video_player = await videojs("videoPlayerMain")

        },
        async updateMainVideo(id){
            this.selected_video_id = id
            this.main_video_player.src({
                src: this.video_paths[id]
            })
            this.display_main_player = true
            this.main_video_player.play()
        },
        closePlayer(){
            this.display_main_player=false
            this.main_video_player.pause()
        }
    }
})

app.mount('#app')