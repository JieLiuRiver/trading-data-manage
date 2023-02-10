import { ProLayoutProps } from '@ant-design/pro-components';
import { RequestConfig } from '@umijs/max';
import Logo from './components/Logo';
import Logout from './components/Logout';
import { DEFAULT_ADMIN_URL, DEFAULT_NAME } from './constants';

export async function getInitialState(): Promise<{ name: string }> {
  return {
    name: DEFAULT_NAME,
  };
}

export const layout = () => {
  return {
    logo: <Logo size={24} />,
    menu: {
      locale: false,
    },
    siderMenuType: 'group',
    rightContentRender: () => null,
    avatarProps: {
      src: DEFAULT_ADMIN_URL,
      title: 'admin',
      size: 'small',
    },
    actionsRender: () => [<Logout key="logout" />],
  } as ProLayoutProps;
};

export const request: RequestConfig = {
  timeout: 1000,
};

export const styledComponents = {};
