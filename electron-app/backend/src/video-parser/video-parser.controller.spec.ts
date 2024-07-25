import { Test, TestingModule } from '@nestjs/testing';
import { VideoParserController } from './video-parser.controller';

describe('VideoParserController', () => {
  let controller: VideoParserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoParserController],
    }).compile();

    controller = module.get<VideoParserController>(VideoParserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
