import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from the 'public' directory
  app.useStaticAssets(path.join(__dirname, '..', '..', 'electron-app', 'public'));

  // Determine the videos directory (e.g., in the user's home directory)
  const videosDir = path.join(os.homedir(), 'my-electron-app-videos');

  // Ensure the directory exists
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  // Serve videos from the user-accessible directory
  app.useStaticAssets(videosDir, {
    prefix: '/videos/',
  });

  await app.listen(3000);
}
bootstrap();