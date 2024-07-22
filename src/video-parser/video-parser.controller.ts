import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('video-parser')
export class VideoParserController {
    @Get('getVideoPaths')
    async getVideoPaths() {
        const videoDir = path.join(__dirname, '../../videos')
        const videoFiles = fs.readdirSync(videoDir).filter(file => {
          const ext = path.extname(file).toLowerCase()
          return ['.mp4', '.ogv', '.ogg', '.webm'].includes(ext)
        });
    
        const videoPaths = videoFiles.map(file => path.join('./videos', file))
        const videoBasenames = videoPaths.map(videoPath => path.basename(videoPath, path.extname(videoPath)))
        
        return { videoPaths: videoPaths, videoBasenames: videoBasenames }
      }

}
