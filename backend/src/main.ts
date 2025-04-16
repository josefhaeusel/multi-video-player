import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { exec } from 'child_process';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Serve static files from the 'public' directory
    app.useStaticAssets(path.join(__dirname, '..', '..', 'public'));

    // Determine the videos directory (e.g., in the user's home directory)
    const videosDir = path.join(os.homedir(), 'museum-player-videos');
    console.log("Videos loaded from", videosDir);

    // Ensure the directory exists
    if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
    }

    // Serve videos from the user-accessible directory
    app.useStaticAssets(videosDir, {
        prefix: '/videos/',
    });

    // Function to create a desktop shortcut to the videos directory
    function createShortcut() {
        const desktopDir = path.join(os.homedir(), 'Desktop');
        const shortcutPath = path.join(desktopDir, 'Museum Player Videos.lnk');

        const vbsScript = `
      Set oWS = WScript.CreateObject("WScript.Shell")
      sLinkFile = "${shortcutPath.replace(/\\/g, '\\\\')}"
      Set oLink = oWS.CreateShortcut(sLinkFile)
      oLink.TargetPath = "${videosDir.replace(/\\/g, '\\\\')}"
      oLink.Save
    `;

        const vbsPath = path.join(os.tmpdir(), 'create_shortcut.vbs');
        fs.writeFileSync(vbsPath, vbsScript);

        exec(`cscript //nologo "${vbsPath}"`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error creating shortcut: ${stderr}`);
            } else {
                console.log('Shortcut created successfully');
            }
            fs.unlinkSync(vbsPath); // Clean up the VBS script after execution
        });
    }

    // Create the shortcut when the application starts
    createShortcut();

    await app.listen(3000);
}
bootstrap();
