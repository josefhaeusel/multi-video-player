"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoParserController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const os = require("os");
const renderer_1 = require("@remotion/renderer");
let VideoParserController = class VideoParserController {
    async getVideoPaths() {
        const videoDir = path.join(os.homedir(), 'museum-player-videos');
        const videoFiles = fs.readdirSync(videoDir).filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.mp4', '.ogv', '.ogg', '.webm'].includes(ext);
        });
        const videoPaths = videoFiles.map(file => path.join('./videos', file));
        const videoBaseNames = videoPaths.map(videoPath => path.basename(videoPath, path.extname(videoPath)));
        const videoMainNames = videoBaseNames.map(basename => basename.split('+++')[0]);
        const videoDescriptions = videoBaseNames.map(basename => basename.split('+++')[1]);
        const videoDurations = await Promise.all(videoFiles.map(async (file) => {
            const videoMetadata = await (0, renderer_1.getVideoMetadata)(path.join(videoDir, file));
            const formattedDuration = this.formatDuration(videoMetadata.durationInSeconds);
            return formattedDuration;
        }));
        const response = { videoPaths: videoPaths, videoBaseNames: videoBaseNames, videoMainNames: videoMainNames, videoDescriptions: videoDescriptions, videoDurations: videoDurations };
        console.log(response);
        return response;
    }
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
    }
    padZero(num) {
        return num.toString().padStart(2, '0');
    }
};
exports.VideoParserController = VideoParserController;
__decorate([
    (0, common_1.Get)('getVideoPaths'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideoParserController.prototype, "getVideoPaths", null);
exports.VideoParserController = VideoParserController = __decorate([
    (0, common_1.Controller)('video-parser')
], VideoParserController);
//# sourceMappingURL=video-parser.controller.js.map