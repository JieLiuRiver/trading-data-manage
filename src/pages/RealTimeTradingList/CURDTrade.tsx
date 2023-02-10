// import { useModel } from '@umijs/max';
import { Space as AntSpace, Switch } from 'antd';
import { memo } from 'react';
// import { SOCKET_EVENT_CLEAR_ALL } from '@/constants';

const CURDTrade = memo<{
  onUpdateSwitchChange?: (checked: boolean) => void;
}>(({ onUpdateSwitchChange }) => {
  // const { socket } = useModel('socket');
  return (
    <AntSpace direction="horizontal" align="start">
      <Switch
        defaultChecked
        onChange={onUpdateSwitchChange}
        checkedChildren="Batch Updated"
        unCheckedChildren="Without Updated"
      />
      {/* <Button
        type="primary"
        size="small"
        onClick={() => {
          socket.emit(SOCKET_EVENT_CLEAR_ALL);
        }}
      >
        Clear All
      </Button> */}
    </AntSpace>
  );
});

export default CURDTrade;
