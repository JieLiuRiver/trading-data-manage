import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer} from '@nestjs/websockets';
import { TradeDataService } from './trade-data.service';
import { Server } from 'socket.io';
import {  SOCKET_CLIENT_URL, SOCKET_EVENT_TRADE_CHANGE_MESSAGE, SOCKET_EVENT_TRADING_DATAS } from '@/constants';
import { TradeDatum, MarketTrend } from './entities/trade-datum.entity';
import { OnModuleInit } from '@nestjs/common';
import { HelperService } from '@/helper.service';
import { Random } from 'mockjs';

export enum TradeStatus {
  NormalTrading = 'Normal Trading',
  Suspended = 'Suspended',
}

const updateRequestQueue: Record<number, any> = {}
const addRequestQueue: Record<number, any> = {}
const INTERVAL = 50
// const TOTAL_COUNT = 100

const generateTrades = (count: number) => {
  return Array.from({ length: count }, () => ({
    name: Random.word(3, 8),
    code: Random.id(),
    currentPrice: Random.float(0, 1000, 0, 2),
    traderName: Random.name(),
    trend: MarketTrend.Stable,
    status: [TradeStatus.NormalTrading, TradeStatus.Suspended][
      Math.floor(Math.random() * 2)
    ],
  }));
};

@WebSocketGateway({
  cors: {
    origin: [SOCKET_CLIENT_URL],
  },
})
export class TradeDataGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  private canUpdate: boolean = true
  private canAdd: boolean = true


  constructor(private readonly tradeDataService: TradeDataService, private helperService: HelperService) {
    // this.findAll()
    //   .then(async (data) => {
    //     const nowValue = new Date().getTime();
    //     if (data.total < TOTAL_COUNT) {
    //       const restCount = TOTAL_COUNT - data.total
    //       Promise.all(
    //         generateTrades(restCount).map(item => this.tradeDataService.create({
    //           ...item,
    //           createdTime: nowValue,
    //           updatedTime: nowValue,
    //           lastPrice: -1
    //         }))
    //       )
    //       .then(() => console.log('finished initial data'))
    //     }
    //   })
  }

  async pushAllToClient(result: {data?: TradeDatum[], total?: number} = {}) {
    if (!Object.keys(result).length) {
      const [data, count] = await this.tradeDataService.findAll();
      result.data = data;
      result.total = count;
    }
    this.server.emit(SOCKET_EVENT_TRADING_DATAS, result)
  }

  @SubscribeMessage('createTradeDatum')
  async create(@MessageBody() createTradeDatumDto: any) {
    const nowValue = new Date().getTime();

    const batchEmit = async () => {
      const currentTimestamp = new Date().getTime();
      const batchStore: any = {}
      for (const timestamp in addRequestQueue) {
        if (currentTimestamp - Number(timestamp) >= INTERVAL) {
          batchStore[timestamp] = addRequestQueue[timestamp]
          delete addRequestQueue[timestamp]
        }
      }
      if (Object.keys(batchStore).length > 0) {
        const results = [];
        for (const key in batchStore) {
          const item = batchStore[key];
          item.createdTime = nowValue;
          item.updatedTime = nowValue;
          item.lastPrice = -1;
          const result = await this.tradeDataService.create(item)
          results.push(result);
        }
        this.server.emit(SOCKET_EVENT_TRADE_CHANGE_MESSAGE, {
          action: 'add',
          data: results
        });
      }
    }
    addRequestQueue[nowValue] = createTradeDatumDto;
    if (!this.canAdd) return;
    this.canAdd = false
    setTimeout(()  => {
      batchEmit()
      this.canAdd = true
    }, INTERVAL)
  }

  @SubscribeMessage('findAllTradeData')
  async findAll() {
    const [data, count] = await this.tradeDataService.findAll();
    const result = {
      data,
      total: count
    }
    await this.pushAllToClient(result);
    return result;
  }

  @SubscribeMessage('findOneTradeDatum')
  findOne(@MessageBody() id: number) {
    return this.tradeDataService.findOne(id);
  }

  @SubscribeMessage('updateTradeDatum')
  async update(@MessageBody() updateTradeDatumDto: any) {
    const nowValue = new Date().getTime();

    const batchEmit = async () => {
      const currentTimestamp = new Date().getTime();
      const batchStore: any = {}
      for (const timestamp in updateRequestQueue) {
        if (currentTimestamp - Number(timestamp) >= INTERVAL) {
          batchStore[timestamp] = updateRequestQueue[timestamp]
          delete updateRequestQueue[timestamp]
        }
      }
      if (Object.keys(batchStore).length > 0) {
        const results = [];
        for (const key in batchStore) {
          const item = batchStore[key];
          const nowValue = Date.now();
          const updateItems = await this.findOne(item.id);
          if (!updateItems?.length) continue;
          item.updatedTime = nowValue;
          item.lastPrice = updateItems[0].currentPrice;
          item.currentPrice = item.currentPrice;
          item.trend = item.currentPrice > item.lastPrice 
            ? MarketTrend.Up
            : item.currentPrice < item.lastPrice 
              ? MarketTrend.Down 
              : MarketTrend.Stable;
          const result = await this.tradeDataService.update(item.id, item);
          results.push(result);
        }
        this.server.emit(SOCKET_EVENT_TRADE_CHANGE_MESSAGE, {
          action: 'update',
          data: results
        });
      }
    }
    
    updateRequestQueue[nowValue] = updateTradeDatumDto;
    if (!this.canUpdate) return;
    this.canUpdate = false
    setTimeout(()  => {
      batchEmit()
      this.canUpdate = true
    }, INTERVAL)
  }

  @SubscribeMessage('removeTradeDatum')
  async remove(@MessageBody() id: number) {
    const result = await this.tradeDataService.remove(id);
    await this.pushAllToClient()
    return result;
  }

  @SubscribeMessage('clearAllTradeDatum')
  async clear() {
    const result = await this.tradeDataService.clear();
    await this.pushAllToClient()
    return result;
  }
}
