import { ArtColumn } from 'ali-react-table';
import { memo } from 'react';
import { MarketTrend, TradingField } from '@/types';
import { useMount, useToggle } from 'ahooks';

type CustomCellProps = {
  row: TradingField;
  rowIndex: number;
  colIndex: number;
  tdProps: any;
  column: ArtColumn;
};

const CustomCell = memo<CustomCellProps>(
  ({ row, rowIndex, column, tdProps }) => {
    const [, { toggle: forceUpdate }] = useToggle();
    useMount(() => {
      if (
        column.code &&
        ['currentPrice', 'lastPrice', 'trend'].includes(column.code) &&
        row?._blinkRow
      ) {
        row._blinkRow.pushCellForceUpdates(
          `${row.id}_${column.code}`,
          forceUpdate,
        );
      }
    });

    if (typeof column.render === 'function' && column.code) {
      const { currentPrice, lastPrice, action } =
        row?._blinkRow?.current?.message || {};
      if (column.code === 'currentPrice' && typeof currentPrice === 'number') {
        row.currentPrice = currentPrice;
      }
      if (column.code === 'lastPrice' && typeof lastPrice === 'number') {
        row.lastPrice = lastPrice;
      }
      if (column.code === 'trend' && action) {
        row.trend = action as MarketTrend;
      }
      return (
        <td {...tdProps}>
          {column.render(row[column.code as keyof TradingField], row, rowIndex)}
        </td>
      );
    }
    return <td {...tdProps} />;
  },
);

export default CustomCell;
