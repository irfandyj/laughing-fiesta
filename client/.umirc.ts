import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/signup', component: '@/pages/SignUpPage/index' },
    { path: '/signin', component: '@/pages/SignInPage/index' },
  ],
  fastRefresh: {},
  plugins: [
    '@umijs/plugins/dist/antd'
  ]
});
