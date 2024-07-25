"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path = require("path");
const os = require("os");
const fs = require("fs");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets(path.join(__dirname, '..', '..', 'electron-app', 'public'));
    const videosDir = path.join(os.homedir(), 'my-electron-app-videos');
    if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
    }
    app.useStaticAssets(videosDir, {
        prefix: '/videos/',
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map