import { Test, TestingModule } from '@nestjs/testing';
import { AnalystController } from './analyst.controller';
import { AnalystService } from './analyst.service';

describe('AnalystController', () => {
  let controller: AnalystController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalystController],
      providers: [AnalystService],
    }).compile();

    controller = module.get<AnalystController>(AnalystController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
