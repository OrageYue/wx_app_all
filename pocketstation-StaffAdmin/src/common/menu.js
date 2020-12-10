import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '常规设置',
    icon: 'profile',
    path: 'common',
    children: [{ name: '轮播栏', path: 'carousel' }, { name: '热点设置', path: 'hot' }],
  },
  {
    name: '人事信息',
    icon: 'team',
    path: 'company',
    children: [
      { name: '部门', path: 'department' },
      { name: '职位', path: 'position' },
      { name: '人员', path: 'staff' },
    ],
  },
  {
    name: '专业知识',
    icon: 'schedule',
    path: 'knowledge',
    children: [
      { name: '分类', path: 'class' },
      { name: '术式', path: 'operation' },
      { name: '课程', path: 'lesson' },
      { name: '评论', path: 'comment' },
      { name: '工具', path: 'tool' },
      { name: '考试', path: 'question' },
      { name: '讲师', path: 'lecturer' },
    ],
  },
  {
    name: '内部资源',
    icon: 'project',
    path: 'resource',
    children: [{ name: '资源列表', path: 'resource' }, { name: '资源目录', path: 'folder' }],
  },
  {
    name: '资讯新闻',
    icon: 'solution',
    path: 'news',
    children: [
      { name: '分类', path: 'class' },
      { name: '新闻管理', path: 'news' },
      { name: '视频分享', path: 'videos' },
    ],
  },
  {
    name: '贝朗感恩',
    icon: 'heart-o',
    path: 'gratitude',
    children: [{ name: '感谢之星', path: 'star' }, { name: '感谢记录', path: 'record' }],
  },
  {
    name: '学习任务',
    icon: 'file-text',
    path: 'trainingtask',
    children: [
      { name: '布置任务', path: 'asign' },
      // { name: "员工进度", path: "view" }
    ],
  },
  {
    name: '积分商城',
    icon: 'shop',
    path: 'mall',
    children: [{ name: '订单信息', path: 'orders' }, { name: '积分赠送', path: 'points' }],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
