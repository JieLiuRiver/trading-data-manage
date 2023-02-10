import { STORAGE_TOKEN_KEY } from '@/constants';
import { LoginOutlined } from '@ant-design/icons';
import { styled, useNavigate } from '@umijs/max';
import { useLocalStorageState } from 'ahooks';
import { Button, Tooltip } from 'antd';
import { memo } from 'react';

const StyledButton = styled(Button)({});

const Logout = memo(() => {
  const [, setToken] = useLocalStorageState<string>(STORAGE_TOKEN_KEY, {
    defaultValue: '',
  });
  const navigate = useNavigate();
  return (
    <Tooltip title="logout">
      <StyledButton
        size="small"
        style={{}}
        icon={<LoginOutlined />}
        onClick={() => {
          setToken('');
          navigate('/login');
        }}
      />
    </Tooltip>
  );
});

export default Logout;
