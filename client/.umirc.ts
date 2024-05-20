import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/u/:username',
      component: '@/components/templates/AuthenticatedLayout',
      routes: [
        { path: '/', component: '@/pages/HomePage/index' },
        { path: '/rooms/:id', component: '@/pages/RoomDetailPage/index' },
      ],
    },
    { path: '/signup', component: '@/pages/SignUpPage/index' },
    { path: '/signin', component: '@/pages/SignInPage/index' },
  ],
  dva: {},
  fastRefresh: {},
  plugins: []
});
