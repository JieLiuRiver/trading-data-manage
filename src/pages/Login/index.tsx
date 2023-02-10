import React, { useState } from 'react';
import { Form, Input, Button, Row, Typography, Col, message } from 'antd';
import { useNavigate, useModel } from '@umijs/max';
import Logo from '@/components/Logo';
import Space from '@/components/Space';
import { useLocalStorageState } from 'ahooks';
import { STORAGE_TOKEN_KEY } from '@/constants';
import { v4 as uuidv4 } from 'uuid';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface FormField {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm<FormField>();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { name } = useModel('global');
  const [loading, setLoading] = useState(false);
  const [, setToken] = useLocalStorageState<string>(STORAGE_TOKEN_KEY, {
    defaultValue: '',
  });

  const onFinish = (values: FormField) => {
    const { username, password } = values;
    if (username === 'admin' && password === 'admin') {
      setToken(uuidv4());
      navigate('/');
    } else {
      messageApi.open({
        type: 'error',
        content: 'wrong user name or password',
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleSubmit = () => {
    setLoading(true);
    form
      .validateFields()
      .then(onFinish)
      .catch(onFinishFailed)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Row justify="center" align="middle" style={{ paddingTop: 200 }}>
      {contextHolder}
      <Col>
        <Row justify="center">
          <Logo size={80} />
        </Row>
        <Typography.Title level={2}>{name}</Typography.Title>
        <Space direction="vertical" size={50} />
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          initialValues={{
            username: 'admin',
            password: 'admin',
          }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginPage;
