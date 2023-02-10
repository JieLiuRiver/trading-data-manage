import { Test, TestingModule } from '@nestjs/testing';
import { TradeDataGateway } from './trade-data.gateway';
import { TradeDataService } from './trade-data.service';

describe('TradeDataGateway', () => {
  let gateway: TradeDataGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeDataGateway, TradeDataService],
    }).compile();

    gateway = module.get<TradeDataGateway>(TradeDataGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
