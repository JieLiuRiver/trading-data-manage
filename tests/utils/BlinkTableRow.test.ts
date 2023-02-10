import BlinkTableRow, {
  blinkTableRowFactory,
  EBlinkTableRowStatus,
} from '../../src/utils/BlinkTableRow';

describe('BlinkTableRow', () => {
  let blinkTableRow: BlinkTableRow;

  beforeEach(() => {
    blinkTableRow = new BlinkTableRow(1);
  });

  it('should initialize with a rowId of 1', () => {
    expect(blinkTableRow.rowId).toBe(1);
  });

  it('should initialize with a status of EBlinkTableRowStatus.Pending', () => {
    expect(blinkTableRow.status).toBe(EBlinkTableRowStatus.Pending);
  });

  it('should initialize with an empty pendingMessageList', () => {
    expect(blinkTableRow.pendingMessageList.isEmpty()).toBe(true);
  });

  it('should initialize with an empty cellForceUpdates object', () => {
    expect(Object.keys(blinkTableRow.cellForceUpdates).length).toBe(0);
  });

  it('should set the rowForceUpdate property when the setRowForceUpdate method is called', () => {
    const forceUpdate = jest.fn();
    blinkTableRow.setRowForceUpdate(forceUpdate);
    expect(blinkTableRow.rowForceUpdate).toEqual(forceUpdate);
  });

  it('should add a cell force update to the cellForceUpdates object when the pushCellForceUpdates method is called', () => {
    const id = 'cell1';
    const forceUpdate = jest.fn();
    blinkTableRow.pushCellForceUpdates(id, forceUpdate);
    expect(blinkTableRow.cellForceUpdates[id]).toEqual(forceUpdate);
  });

  it('should call the rowForceUpdate function when the handleBlinkEnd method is called', () => {
    const forceUpdate = jest.fn();
    blinkTableRow.setRowForceUpdate(forceUpdate);
    blinkTableRow.handleBlinkEnd();
    expect(forceUpdate).toHaveBeenCalled();
  });

  it('should return the same instance of BlinkTableRow for the same rowId', () => {
    const row1 = blinkTableRowFactory(1);
    const row2 = blinkTableRowFactory(1);
    expect(row1).toBe(row2);
  });
});
