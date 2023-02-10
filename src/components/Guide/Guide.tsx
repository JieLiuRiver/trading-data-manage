import { Layout, Row, Typography } from 'antd';
import React from 'react';

interface Props {
  name: string;
}

const Guide: React.FC<Props> = (props) => {
  const { name } = props;
  return (
    <Layout>
      <Row>
        <Typography.Title level={3}>
          Welcome to use <strong>{name}</strong> ！
        </Typography.Title>
        <Typography.Paragraph>
          Provide traders with an efficient and convenient transaction data
          management tool to help them improve work efficiency and
          decision-making effectiveness.
        </Typography.Paragraph>
      </Row>
    </Layout>
  );
};

export default Guide;
