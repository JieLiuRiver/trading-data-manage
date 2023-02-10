import { MarketTrend } from '@/types';
import Queue from './Queue';

type Message = {
  action: MarketTrend.Up | MarketTrend.Down | MarketTrend.Stable | 3;
  lastPrice?: number;
  currentPrice?: number;
};

export enum EBlinkTableRowStatus {
  Pending = 'pending',
  Running = 'running',
}

export enum EBlinkTableRowCurrentStatus {
  Finished = 'Finished',
  InProgress = 'in-progress',
}

class BlinkTableRow {
  pendingMessageList: Queue<Message> = new Queue();

  rowId: string | number;

  rowForceUpdate?: () => void;

  cellForceUpdates: Record<string, () => void> = {};

  status: EBlinkTableRowStatus = EBlinkTableRowStatus.Pending;

  current?: {
    message?: Message;
    status: EBlinkTableRowCurrentStatus;
    resolve: (value?: any) => void;
  } | null;

  constructor(rowId: string | number) {
    this.rowId = rowId;
  }

  append(message: Message) {
    this.pendingMessageList.enqueue(message);
    if (
      !this.pendingMessageList.isEmpty() &&
      this.current?.status !== EBlinkTableRowCurrentStatus.InProgress
    ) {
      this.run();
    }
  }

  setRowForceUpdate(forceUpdate: () => void) {
    this.rowForceUpdate = forceUpdate;
  }

  pushCellForceUpdates(id: string, forceUpdate: () => void) {
    this.cellForceUpdates[id] = forceUpdate;
  }

  handleBlinkEnd() {
    if (this.current) {
      this.current.status = EBlinkTableRowCurrentStatus.Finished;
    }
    this.rowForceUpdate?.();
    setTimeout(() => {
      this?.current?.resolve?.();
    }, 20);
  }

  run() {
    return new Promise((resolve) => {
      this.status = EBlinkTableRowStatus.Running;
      this.current = {
        message: this.pendingMessageList.dequeue(),
        status: EBlinkTableRowCurrentStatus.InProgress,
        resolve: (value: any) => {
          if (
            !this.pendingMessageList.isEmpty() &&
            this.current?.status !== EBlinkTableRowCurrentStatus.InProgress
          ) {
            this.run();
          } else {
            this.status = EBlinkTableRowStatus.Pending;
            this.current = undefined;
            resolve(value);
          }
        },
      };
      this.rowForceUpdate?.();
      Object.values(this.cellForceUpdates).forEach((cellForceUpdate) =>
        cellForceUpdate?.(),
      );
    });
  }
}

const cacheblinkTableRow = () => {
  const cache = new Map<string | number, BlinkTableRow>();
  return (rowId: string | number) => {
    let row = cache.get(rowId);
    if (!row) {
      row = new BlinkTableRow(rowId);
      cache.set(rowId, row);
    }
    return row;
  };
};

export const blinkTableRowFactory = cacheblinkTableRow();

export default BlinkTableRow;
