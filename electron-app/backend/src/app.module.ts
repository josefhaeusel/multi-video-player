import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoParserModule } from './video-parser/video-parser.module';

@Module({
  imports: [
    VideoParserModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
