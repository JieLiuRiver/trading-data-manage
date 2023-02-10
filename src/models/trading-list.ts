import { useState } from 'react';
import { TradingField } from '@/types/index';
import { useModel } from '@umijs/max';
import { useMount, useUnmount } from 'ahooks';
import { SOCKET_EVENT_CONNECT, SOCKET_EVENT_TRADING_DATAS } from '@/constants';

const useTradingList = () => {
  const { socket } = useModel('socket');
  const [tradingList, setTradingList] = useState<TradingField[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useMount(() => {
    socket.on(SOCKET_EVENT_CONNECT, () => {
      console.log('Connected!');
    });
    socket.on(
      SOCKET_EVENT_TRADING_DATAS,
      (result: { data: TradingField[]; total: number }) => {
        setLoading(false);
        if (result && Array.isArray(result.data)) {
          setTradingList(result.data);
          setTotal(result.total);
        }
      },
    );
  });

  useUnmount(() => {
    socket.off(SOCKET_EVENT_CONNECT);
  });

  return {
    loading,
    total,
    tradingList,
    setTradingList,
  };
};

export default useTradingList;
