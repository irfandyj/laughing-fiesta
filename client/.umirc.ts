import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/u/:username',
      // component: '@/components/templates/EmptyLayout/index',
      routes: [
        { path: '/u/:username', component: '@/pages/HomePage/index' },
        { path: '/u/:username/rooms/:id', component: '@/pages/RoomDetailPage/index' },
      ],
    },
    { path: '/signup', component: '@/pages/SignUpPage/index' },
    { path: '/signin', component: '@/pages/SignInPage/index' },
  ],
  dva: {},
  fastRefresh: {},
  plugins: []
});
