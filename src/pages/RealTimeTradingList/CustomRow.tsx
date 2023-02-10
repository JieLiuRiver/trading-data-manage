import { memo, useEffect, useMemo, useRef, useState } from 'react';
import ContextMenu from '@/components/ContextMenu';
import { DeleteFilled, HighlightFilled } from '@ant-design/icons';
import {
  HIGHLIGHT_COLOR,
  UN_HIGHLIGHT_COLOR,
  REMOVE_COLOR,
  SOCKET_EVENT_DELETE_TRADE,
} from '@/constants/index';
import { useModel } from '@umijs/max';
import './CustomRow.less';
import { useMount, useToggle } from 'ahooks';
import classNames from 'classnames';
import BlinkTableRow, {
  EBlinkTableRowCurrentStatus,
} from '@/utils/BlinkTableRow';

type CustomRowProps = {
  row: Record<string, any>;
  rowIndex: number;
  trProps: any;
};

const CustomRow = memo<CustomRowProps>(({ row, rowIndex, trProps }) => {
  const rowElementRef = useRef<HTMLElement | null>(null);
  const { socket } = useModel('socket');
  const [bool, { toggle: forceUpdate }] = useToggle();
  const { highlightIdsMap, setHighlightIdsMap } = useModel('highlight-ids');
  const [isBlink, setIsBlink] = useState(false);
  const [blinkClass, setBlinkClass] = useState('');
  const idValue = row.id;

  const menus = useMemo(() => {
    const HighlightMenu = {
      id: `highlight_${rowIndex}`,
      name: 'Highlight',
      icon: <HighlightFilled style={{ color: HIGHLIGHT_COLOR }} />,
      onClick: () => {
        setHighlightIdsMap({
          ...highlightIdsMap,
          [idValue]: true,
        });
        forceUpdate();
      },
    };
    const UnHighlightMenu = {
      id: `un_highlight_${rowIndex}`,
      name: 'Cancel Highlight',
      icon: <HighlightFilled style={{ color: UN_HIGHLIGHT_COLOR }} />,
      onClick: () => {
        setHighlightIdsMap({
          ...highlightIdsMap,
          [idValue]: false,
        });
        forceUpdate();
      },
    };
    const results = [
      {
        id: `remove_${rowIndex}`,
        name: 'Remove',
        icon: <DeleteFilled style={{ color: REMOVE_COLOR }} />,
        onClick: () => {
          socket.emit(SOCKET_EVENT_DELETE_TRADE, idValue);
        },
      },
    ];
    const highlightBool = Object.keys(highlightIdsMap).includes(
      String(idValue),
    );
    results.unshift(
      highlightBool && Boolean(highlightIdsMap[String(idValue)])
        ? UnHighlightMenu
        : HighlightMenu,
    );
    return results;
  }, [rowIndex, highlightIdsMap, idValue, bool]);

  const blinkRow: BlinkTableRow = row._blinkRow;
  const blinkInProgress =
    blinkRow?.current?.status === EBlinkTableRowCurrentStatus.InProgress;

  useMount(() => {
    if (blinkRow) blinkRow.setRowForceUpdate(forceUpdate);
  });

  useEffect(() => {
    if (blinkInProgress) {
      setIsBlink(true);
      setTimeout(() => {
        setIsBlink(false);
        blinkRow.handleBlinkEnd();
      }, 1000);
    }
  }, [blinkInProgress]);

  useEffect(() => {
    if (isBlink) {
      switch (blinkRow?.current?.message?.action) {
        case 0:
          setBlinkClass('blink-row-red');
          break;
        case 1:
          setBlinkClass('blink-row-green');
          break;
        case 2:
          setBlinkClass('blink-row-gray');
          break;
        case 3:
          setBlinkClass('blink-row-yellow');
          break;
        default:
          break;
      }
    } else {
      setBlinkClass('');
    }
  }, [isBlink]);

  return (
    <>
      <tr
        {...trProps}
        className={classNames(
          isBlink ? 'blink-row' : 'row-default',
          blinkClass,
        )}
        onTransitionEnd={() => {
          blinkRow.handleBlinkEnd();
        }}
        ref={rowElementRef}
      />
      <ContextMenu parentRef={rowElementRef?.current} menus={menus} />
    </>
  );
});

export default CustomRow;
