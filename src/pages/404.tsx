import { PageContainer } from '@ant-design/pro-components';
import { Empty } from 'antd';

const LoginPage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div>
        <Empty description="404" />
      </div>
    </PageContainer>
  );
};

export default LoginPage;
