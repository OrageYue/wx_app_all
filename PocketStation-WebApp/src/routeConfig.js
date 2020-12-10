import DealerHomePage from "./routes/DealerHomePage";
import DealerResourcePage from "./routes/DealerResourcePage"; 
import DealerLivePage from "./routes/DealerLivePage";
import DealerQAPage from "./routes/DealerQAPage";
import DealerFAQ from "./routes/DealerFAQ";
import DealerAction from "./routes/DealerAction";
import DealerActionDetail from "./routes/DealerActionDetail";
import DealerCoursePage from "./routes/DealerCoursePage";
import DealerTrainings from "./routes/DealerTrainings";
import DealerNewsDetails from './routes/DealerNewsDetails';
import Exams from "./routes/Exams";
import StaffCoursePage from "./routes/StaffCoursePage"
import LoginPage from "./routes/LoginPage";
import Tool from "./routes/Tool";
import NewsDetails from "./routes/NewsDetails";
import DealerLayout from "./layouts/DealerLayout";
import StaffLayout from "./layouts/StaffLayout";
import { canAccessStaffHome } from "./utils/user";
import ResourceViewPage from "./routes/ResourceViewPage";
import StaffLessonKind from "./routes/StaffLessonKind";
import LoginType from './routes/LoginType';
import NewExam from './routes/NewExam';
import StaffcollectToolsPage from './routes/StaffcollectToolsPage';

import StaffHomePage from './routes/StaffHomePage';
import StaffGratsPage from './routes/StaffGratsPage';
import StaffSharePage from './routes/StaffSharePage';
import StaffMePage from './routes/StaffMePage';
import StaffOprLessons from './routes/StaffOprLessons';
import StaffShopPage from './routes/StaffShopPage';




/**
 * 路由配置
 * {
 *    path,         // URL
 *    component,    // 路由组件
 *    canRender?,   // 路由能否渲染? 默认需要token存在。
 *    alternative?, // 路由不允许渲染的替代组件，默认为<LoginPage />
 * }
 * 
 * @TODO: 为每个路由配置state数据获取函数，在Identity的connect中添加 reducer(allRouteState2Props)
 */
export default [
  {
    path: '/shop',
    component: StaffShopPage,
  },
  {
    path: '/collections',
    component: StaffcollectToolsPage,
  },
  {
    path: '/newExam',
    component: NewExam,
  },
  {
    path: '/lsn_class/staff',
    component: StaffLessonKind,
  },
  {
    path: '/lsn_class/dealer',
    component: StaffLessonKind,
  },
  {
    path: '/course',
    component: StaffCoursePage,
  },
  {
    path: '/ques',
    component: Exams,
  },
  {
    path: '/train',
    component: DealerCoursePage,
  }, 
  {
    path: '/trainingCourse',
    component: DealerTrainings,
  },
  {
    path: '/news',
    component: NewsDetails,
  },
  {
    path: '/dealerNews',
    component: DealerNewsDetails,
  },
  {
    path: '/tools',
    component: Tool,
  },
  {
    path: '/lessons',
    component: StaffOprLessons,
  },
  
  {
    path: '/QA/FAQ',
    component: DealerFAQ,
  },
  {
    path: '/QA/action',
    component: DealerAction,
  },
  {
    path: '/QA/action/question',
    component: DealerActionDetail,
  },
  {
    path: '/dealer',
    component: DealerLayout,
    routes: [
      {
        path: '/dealer/index',
        component: DealerHomePage,
      }, {
        path: '/dealer/res',
        component: DealerResourcePage,
      }, {
        path: '/dealer/live',
        component: DealerLivePage,
      }, {
        path: '/dealer/QA',
        component: DealerQAPage
      }
    ]
  }, {
    path: '/staff',
    component: StaffLayout,
    canRender: ({token, type}) =>  (!!token && canAccessStaffHome(type)),
    routes: [
      {

        path: '/staff/index',
        component: StaffHomePage,
      },
      {
        path: '/staff/grats',
        component: StaffGratsPage,
      },
      {
        path: '/staff/share',
        component: StaffSharePage,
      },
      {
        path: '/staff/mine',
        component: StaffMePage,
      },
    ]
  }, {
    path: '/',
    component: LoginPage,
    canRender: () => true,  // 首页不需要检查准入条件
  }, {
    path: '/select_type',
    component: LoginType,
    canRender: () => true,
    
  },{
    path: '/res_view/:resId',
    component: ResourceViewPage,
  }
];

