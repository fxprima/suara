import { Test, TestingModule } from '@nestjs/testing';
import { GemaService } from './gema.service';

describe('GemaService', () => {
  let service: GemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GemaService],
    }).compile();

    service = module.get<GemaService>(GemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
