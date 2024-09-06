import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { getVideoMetadata, VideoMetadata } from "@remotion/renderer";

@Controller('video-parser')
export class VideoParserController {
    @Get('getVideoPaths')
    async getVideoPaths() {
        let videoDir = path.join(os.homedir(), 'museum-player-videos');
        let videoFiles = fs.readdirSync(videoDir).filter(file => {
          const ext = path.extname(file).toLowerCase()
          return ['.mp4', '.ogv', '.ogg', '.webm'].includes(ext)
        });

        if (!videoFiles[0]) {
          videoDir+='.lnk'
          videoFiles = fs.readdirSync(videoDir).filter(file => {
            const ext = path.extname(file).toLowerCase()
            return ['.mp4', '.ogv', '.ogg', '.webm'].includes(ext)
          });
        }
    
        const videoPaths = videoFiles.map(file => path.join('./videos', file))
        const videoBaseNames = videoPaths.map(videoPath => path.basename(videoPath, path.extname(videoPath)))
        const videoMainNames = videoBaseNames.map(basename => basename.split('+++')[0])
        const videoDescriptions = videoBaseNames.map(basename => basename.split('+++')[1])
        const videoDurations = await Promise.all(videoFiles.map(async file => {
            const videoMetadata: VideoMetadata = await getVideoMetadata(
              path.join(videoDir, file)
            )
            const formattedDuration = this.formatDuration(videoMetadata.durationInSeconds)            
            return formattedDuration
          }
        ))

        const response = {videoDir: videoDir, videoPaths: videoPaths, videoBaseNames: videoBaseNames, videoMainNames: videoMainNames, videoDescriptions: videoDescriptions, videoDurations: videoDurations }
        console.log(response)

        return response
      }

      formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
      }
    
      padZero(num: number): string {
        return num.toString().padStart(2, '0');
      }

}
