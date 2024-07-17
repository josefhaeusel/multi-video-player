import { Controller, Get, Req } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('video-parser')
export class VideoParserController {
    @Get('getVideoPaths')
    getVideoPaths() {
        const videoDir = path.join(__dirname, '../../videos');
        const videoFiles = fs.readdirSync(videoDir).filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.mp4', '.ogv', '.ogg', '.webm'].includes(ext);
        });
    
        const videoPaths = videoFiles.map(file => path.join('./videos', file));
        return videoPaths;
      }

}
