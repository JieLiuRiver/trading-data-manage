import { PageContainer } from '@ant-design/pro-components';
import { memo, useEffect, useCallback, useMemo, useRef } from 'react';
import { blinkTableRowFactory } from '@/utils/BlinkTableRow';
import { BaseTable, ArtColumn } from 'ali-react-table';
import SVG_ICONS from '@/components/SvgIcons';
import { TradingField } from '@/types/index';
import { Empty, Spin, Typography, FloatButton } from 'antd';
import Text from '@/components/Text';
import Space from '@/components/Space';
import { useModel } from '@umijs/max';
import { useMount, useSize, useToggle, useUnmount } from 'ahooks';
import _ from 'lodash';
import {
  HIGHLIGHT_COLOR,
  MARKET_UP_COLOR,
  MARKET_DOWN_COLOR,
  MARKET_STABLE_COLOR,
  SOCKET_EVENT_TRADE_CHANGE_MESSAGE,
  SOCKET_EVENT_ALL_TRADES,
  SOCKET_EVENT_TRADING_DATAS,
} from '@/constants';
import CustomRow from './CustomRow';
import CustomCell from './CustomCell';
import useMockUpdateTrade from '@/hooks/useMockUpdateTrade';

const RealTimeTrading = memo(() => {
  const { tradingList, setTradingList, loading, total } =
    useModel('trading-list');
  const { highlightIdsMap } = useModel('highlight-ids');
  const { socket } = useModel('socket');
  useMockUpdateTrade();
  const [, { toggle: forceUpdate }] = useToggle();
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const size = useSize(tableContainerRef);
  const tableContainerWidth = size?.width || 0;

  useMount(() => {
    socket.emit(SOCKET_EVENT_ALL_TRADES);
  });

  useUnmount(() => {
    socket.off(SOCKET_EVENT_TRADING_DATAS);
  });

  const columns: ArtColumn[] = useMemo(
    () =>
      [
        tableContainerWidth > 500 && {
          name: 'Trade ID',
          code: 'id',
          width: 70,
          render: (value: string) => <Text value={value} copyable />,
        },
        tableContainerWidth > 600 && {
          name: 'Trade Name',
          code: 'name',
          width: 100,
          render: (value: string) => <Text value={value} copyable />,
        },
        {
          name: 'Trade Code',
          code: 'code',
          render: (value: string) => <Text value={value} />,
        },
        {
          name: 'Current Price',
          code: 'currentPrice',
          render: (value: number) =>
            value === -1 ? '-' : <Text prefixText="$" value={value} isNum />,
        },
        tableContainerWidth > 450 && {
          name: 'Last Price',
          code: 'lastPrice',
          render: (value: number) =>
            value === -1 ? '-' : <Text prefixText="$" value={value} isNum />,
        },
        tableContainerWidth > 800 && {
          name: 'Trader Name',
          code: 'traderName',
          render: (value: string) => <Text value={value} />,
        },
        {
          name: 'Trend',
          code: 'trend',
          width: 60,
          render: (value: any, record: TradingField) => {
            const action = record?._blinkRow?.current?.message?.action;
            const trend = typeof action === 'undefined' ? value : action;
            const RealIcon = [
              SVG_ICONS.UpIcon,
              SVG_ICONS.DownIcon,
              SVG_ICONS.StableIcon,
            ][trend];
            const color = [
              MARKET_UP_COLOR,
              MARKET_DOWN_COLOR,
              Boolean(highlightIdsMap[record.id])
                ? 'white'
                : MARKET_STABLE_COLOR,
            ][trend];
            if (!RealIcon) return null;
            return <RealIcon size={28} color={color} />;
          },
        },
        tableContainerWidth > 1000 && {
          name: 'Updated Time',
          code: 'updatedTime',
          width: 150,
          render: (value: number) =>
            value === 0 ? '-' : <Text value={value} isTime />,
        },
        tableContainerWidth > 1000 && {
          name: 'Created Time',
          code: 'createdTime',
          width: 150,
          render: (value: string) => <Text value={value} isTime />,
        },
        tableContainerWidth > 900 && { name: 'Trade Status', code: 'status' },
      ].filter(Boolean) as ArtColumn[],
    [tableContainerWidth],
  );

  useEffect(() => {
    forceUpdate();
  }, [highlightIdsMap]);

  useEffect(() => {
    // add & update
    socket.on(
      SOCKET_EVENT_TRADE_CHANGE_MESSAGE,
      (message: { action: 'add' | 'update'; data: TradingField[] }) => {
        if (!message || !message.action || !message.data) return;
        const { action, data: list } = message;
        list.forEach((record) => {
          record._blinkRow = blinkTableRowFactory(record.id);
        });
        switch (action) {
          case 'add':
            setTradingList(_.uniqBy([...list, ...tradingList], 'id'));
            requestAnimationFrame(() => {
              list.forEach((record) => {
                record._blinkRow?.append({
                  action: 3,
                });
              });
            });
            break;
          case 'update':
            list.forEach((record) => {
              record._blinkRow?.append({
                action: record.trend,
                currentPrice: record.currentPrice,
                lastPrice: record.lastPrice,
              });
            });
            break;
          default:
            break;
        }
      },
    );

    return () => {
      socket.off(SOCKET_EVENT_TRADE_CHANGE_MESSAGE);
    };
  }, [tradingList]);

  const getRowProps = useCallback(
    (record: TradingField) => ({
      style: {
        ...(Boolean(highlightIdsMap[record.id])
          ? {
              '--bgcolor': 'transparent',
              '--color': 'transparent',
              '--hover-bgcolor': 'rgba(0,0,255,0.3)',
              backgroundColor: `${HIGHLIGHT_COLOR}`,
              color: 'white',
            }
          : {
              backgroundColor: 'transparent',
            }),
      },
    }),
    [highlightIdsMap],
  );

  const TotalCount = (
    <Typography.Text key="total-count">Total Count: {total}</Typography.Text>
  );

  const dataSource = useMemo(() => {
    const list = _.clone(tradingList).map((record) => {
      record._blinkRow = blinkTableRowFactory(record.id);
      return record;
    });
    // .sort((a, b) => {
    //   return b.updatedTime - a.updatedTime;
    // });
    return list;
  }, [tradingList]);

  return (
    <Spin spinning={tableContainerWidth === 0 || loading}>
      <PageContainer
        extra={TotalCount}
        footer={[TotalCount]}
        // extraContent={
        //   <CURDTrade
        //     onUpdateSwitchChange={(open) => (open ? startLoop() : stopLoop())}
        //   />
        // }
        style={{ opacity: tableContainerWidth === 0 ? 0 : 1 }}
      >
        <div ref={tableContainerRef}>
          <BaseTable
            dataSource={dataSource}
            columns={columns}
            primaryKey="id"
            getRowProps={getRowProps}
            style={{ height: 600 }}
            useVirtual={false}
            components={{
              Row: CustomRow,
              Cell: CustomCell,
              EmptyContent: () => <Empty description="Trading data is empty" />,
            }}
          />
        </div>
        <Space direction="vertical" size={50} />
        <FloatButton.BackTop style={{ bottom: 80 }} />
      </PageContainer>
    </Spin>
  );
});

export default RealTimeTrading;
