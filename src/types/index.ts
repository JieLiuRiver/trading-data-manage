import BlinkTableRow from '../utils/BlinkTableRow';
export enum MarketTrend {
  Up,
  Down,
  Stable,
}

export enum TradeStatus {
  NormalTrading = 'Normal Trading',
  Suspended = 'Suspended',
}

export interface TradingField {
  id: string | number;
  name: string;
  code: string;
  currentPrice: number;
  lastPrice: number;
  traderName: string;
  updatedTime: number;
  createdTime: number;
  trend: MarketTrend;
  status: string;
  _blinkRow?: BlinkTableRow;
}
