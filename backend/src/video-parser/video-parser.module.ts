import { Module } from '@nestjs/common';
import { VideoParserController } from './video-parser.controller';

@Module({
  controllers: [VideoParserController]
})
export class VideoParserModule {}
