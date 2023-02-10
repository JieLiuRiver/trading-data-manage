import { Test, TestingModule } from '@nestjs/testing';
import { TradeDataService } from './trade-data.service';

describe('TradeDataService', () => {
  let service: TradeDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeDataService],
    }).compile();

    service = module.get<TradeDataService>(TradeDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
