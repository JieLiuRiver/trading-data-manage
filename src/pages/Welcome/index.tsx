import Guide from '@/components/Guide';
import { PageContainer } from '@ant-design/pro-components';
import { styled, useModel } from '@umijs/max';

const Wrapper = styled.section`
  padding: 4px;
`;

const Title = styled.h1`
  font-size: 40px;
  text-align: center;
`;

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <Wrapper>
        <Title>{name}</Title>
        <Guide name={name} />
      </Wrapper>
    </PageContainer>
  );
};

export default HomePage;
