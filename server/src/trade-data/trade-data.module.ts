import { Module } from '@nestjs/common';
import { TradeDataService } from './trade-data.service';
import { TradeDataGateway } from './trade-data.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeDatum } from './entities/trade-datum.entity'
import { HelperService } from '@/helper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TradeDatum])
  ],
  providers: [TradeDataGateway, HelperService, TradeDataService]
})
export class TradeDataModule {}
