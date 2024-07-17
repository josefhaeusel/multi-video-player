app = Vue.createApp({

    data() {
        return {
            video_paths: [],
            video_players: [],
        }
    },

    async mounted() {

        this.video_paths = await this.getVideoPaths();
        this.$nextTick(()=>{
            console.log(this.$refs)
            this.loadVideoPlayers();
        })
    },

    methods: {

        async getVideoPaths(){
            const response = await fetch('/video-parser/getVideoPaths', {
                method: 'GET',
            });

            const data = await response.json();
            console.log("Video Paths", data)

            return data
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
    }
})

app.mount('#app')