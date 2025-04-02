import { Test, TestingModule } from '@nestjs/testing';
import { GemaController } from './gema.controller';
import { GemaService } from './gema.service';

describe('GemaController', () => {
  let controller: GemaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GemaController],
      providers: [GemaService],
    }).compile();

    controller = module.get<GemaController>(GemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
