"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path = require("path");
const os = require("os");
const fs = require("fs");
const child_process_1 = require("child_process");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets(path.join(__dirname, '..', '..', 'public'));
    const videosDir = path.join(os.homedir(), 'museum-player-videos');
    console.log("Videos loaded from", videosDir);
    if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
    }
    app.useStaticAssets(videosDir, {
        prefix: '/videos/',
    });
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
        (0, child_process_1.exec)(`cscript //nologo "${vbsPath}"`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error creating shortcut: ${stderr}`);
            }
            else {
                console.log('Shortcut created successfully');
            }
            fs.unlinkSync(vbsPath);
        });
    }
    createShortcut();
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map