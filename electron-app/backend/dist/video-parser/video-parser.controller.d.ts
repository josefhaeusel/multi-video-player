export declare class VideoParserController {
    getVideoPaths(): Promise<{
        videoPaths: string[];
        videoBaseNames: string[];
        videoMainNames: string[];
        videoDescriptions: string[];
        videoDurations: string[];
    }>;
    formatDuration(seconds: number): string;
    padZero(num: number): string;
}
