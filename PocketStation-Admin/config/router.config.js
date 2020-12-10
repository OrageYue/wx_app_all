export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin'],
    routes: [
      { path: '/', redirect: '/dealer/accounts' },
      {
        path: '/common',
        name: 'common',
        icon: 'copy',
        routes: [
          {
            path: '/common/carousel',
            name: 'profile',
            component: './Common/Carousel',
          },
        ],
      },
      {
        path: '/dealer/accounts',
        name: 'accounts',
        icon: 'team',
        routes: [
          {
            path: '/dealer/accounts',
            name: 'dealer',
            component: './Accounts/page',
          },
        ],
      },
      {
        path: '/dealer/QA',
        name: 'QA',
        icon: 'question-circle',
        routes: [
          {
            path: '/dealer/QA/FAQ',
            name: 'FAQ',
            component: './QA/FAQ',
          },
          {
            path: '/dealer/QA/FAQ/edit',
            component: './QA/EditFaq',
          },
          {
            path: '/dealer/QA/questions',
            name: 'question',
            component: './QA/Question',
          },
        ],
      },
      {
        path: '/dealer/resource',
        name: 'resource',
        icon: 'project',
        routes: [
          {
            path: '/dealer/resource/list',
            name: 'list',
            component: './Resource/page',
          },
          {
            path: '/dealer/resource/folder',
            name: 'resource_folder',
            component: './Resource/Folder',
          },
        ],
      },
      // {
      //   path: '/dealer/carousel',
      //   name: 'carousel',
      //   icon: 'picture',
      //   component: './Carousel/page',
      // },
      {
        path: '/dealer/recommendtrainings',
        name: 'recommendtrainings',
        icon: 'schedule',
        routes: [
          {
            path: '/dealer/recommendtrainings/lesson',
            name: 'lesson',
            component: './RecommendTraining/page',
          },
          {
            path: '/dealer/recommendtrainings/lesson/add',
            component: './RecommendTraining/TrainingAdd',
          },
        ],
      },
      {
        path: '/news',
        name: 'news',
        icon: 'copy',
        routes: [
          {
            path: '/news/class',
            name: 'class',
            component: './News/Class',
          },
          {
            path: '/news/news',
            name: 'news',
            component: './News/News',
          },
        ],
      },
    ],
  },
  {
    component: '404',
  },
];
