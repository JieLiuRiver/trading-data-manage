import { defineConfig } from '@umijs/max';

const { REACT_APP_ENV } = process.env;

const proxy = {
  dev: {
    '/server/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  test: {
    '/server/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  pre: {
    '/server/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
};

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Trading Data Platform',
  },
  outputPath: 'server/web/',
  routes: [
    {
      path: '/login',
      component: './Login',
      layout: false,
      exact: true,
      // wrappers: ['@/wrappers/auth'],
    },
    {
      path: '/',
      redirect: '/welcome',
      wrappers: ['@/wrappers/auth'],
    },
    {
      name: 'Welcome',
      path: '/welcome',
      component: './Welcome',
      wrappers: ['@/wrappers/auth'],
    },
    {
      name: 'Trading Data',
      path: '/real-time-trading-list',
      component: './RealTimeTradingList',
      wrappers: ['@/wrappers/auth'],
    },
    { path: '/*', component: '@/pages/404' },
  ],
  npmClient: 'yarn',
  mfsu: {},
  alias: {
    ['@']: '/src',
  },
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': 'white',
  },
  proxy: (proxy as any)[REACT_APP_ENV || 'dev'],
  favicons: ['/assets/favicon.ico'],
  styledComponents: {},
});
