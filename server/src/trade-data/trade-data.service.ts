import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTradeDatumDto } from './dto/create-trade-datum.dto';
import { UpdateTradeDatumDto } from './dto/update-trade-datum.dto';
import { TradeDatum } from './entities/trade-datum.entity';

@Injectable()
export class TradeDataService {
  constructor(@InjectRepository(TradeDatum) private tradeDatumRepository: Repository<TradeDatum>) {
  }

  create(createTradeDatumDto: CreateTradeDatumDto) {
    const newTrade = this.tradeDatumRepository.create(createTradeDatumDto)
    return this.tradeDatumRepository.save(newTrade)
  }

  findAll() {
    return this.tradeDatumRepository.findAndCount()
  }

  findOne(id: number) {
    return this.tradeDatumRepository.find({
      where: { id }
    })
  }

  async update(id: number, updateTradeDatumDto: UpdateTradeDatumDto) {
    const trade = await this.findOne(id);
    return this.tradeDatumRepository.save({...trade, ...updateTradeDatumDto});
  }

  async remove(id: number) {
    const trade = await this.findOne(id);
    return this.tradeDatumRepository.remove(trade);
    // this.tradeDatumRepository.delete(id)
  }

  async clear() {
   await this.tradeDatumRepository.clear()
  }
}
