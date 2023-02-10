import {
  SOCKET_EVENT_ALL_TRADES,
  SOCKET_EVENT_CLEAR_ALL,
  SOCKET_EVENT_CREATE_TRADE,
  SOCKET_EVENT_TRADING_DATAS,
  SOCKET_EVENT_UPDATE_TRADE,
} from '@/constants';
import { MarketTrend, TradeStatus, TradingField } from '@/types';
import { useModel } from '@umijs/max';
import { useMount, useUnmount } from 'ahooks';
import { Random } from 'mockjs';
import { useRef } from 'react';

const MAX_COUNT = 100;

const generateTrades = (count: number) => {
  return Array.from({ length: count }, () => ({
    name: Random.word(3, 8) || 'Exception Name',
    code: Random.id(),
    currentPrice: Random.float(0, 1000, 0, 2),
    traderName: Random.name(),
    trend: MarketTrend.Stable,
    status: [TradeStatus.NormalTrading, TradeStatus.Suspended][
      Math.floor(Math.random() * 2)
    ],
  }));
};

export default function useMockCreateTrade() {
  const { socket } = useModel('socket');
  const timerRef = useRef<any>(null);

  const startLoop = () => {
    timerRef.current = setInterval(() => {
      socket.emit(SOCKET_EVENT_ALL_TRADES);
    }, Random.integer(500, 1000));
  };

  const stopLoop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useMount(() => {
    startLoop();
    socket.on(
      SOCKET_EVENT_TRADING_DATAS,
      (result: { data: TradingField[]; total: number }) => {
        let count = Random.integer(1, 10);
        const addActionCount = Random.integer(0, count / 2);
        let updateActionCount = Math.max(0, count - addActionCount);
        // add
        if (result.total > MAX_COUNT) {
          socket.emit(SOCKET_EVENT_CLEAR_ALL);
        } else {
          const trades = generateTrades(addActionCount);
          trades.forEach((trade: any) =>
            socket.emit(SOCKET_EVENT_CREATE_TRADE, trade),
          );
        }
        // update
        while (updateActionCount) {
          updateActionCount -= 1;
          const index = Random.integer(0, result.total);
          const item = result.data[index];
          const stableChance = Random.integer(0, 2) === 0;
          if (item)
            socket.emit(SOCKET_EVENT_UPDATE_TRADE, {
              ...item,
              currentPrice: stableChance
                ? item.currentPrice
                : Random.float(0, 1000, 0, 2),
            } as TradingField);
        }
      },
    );
  });

  useUnmount(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  });

  return {
    stopLoop,
    startLoop,
  };
}
