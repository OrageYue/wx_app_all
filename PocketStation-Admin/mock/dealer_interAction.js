let actions = [];
for (var i = 0; i < 3; i++) {
  actions.push({
    id: `action${i}`,
    avatar: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg',
    name: 'xxx经销商',
    ques: '如何修改 Ant Design 的默认主题?',
    create_at: '2018-11-17',
    reply: 5,
  });
}

let replys = [];
for (var i = 0; i < 3; i++) {
  replys.push({
    id: `reply${i}`,
    ques_id: 'ques_id',
    avatar: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg',
    name: `经销商${i + 1}`,
    reply:
      '你可以覆盖它们的样式，但是我们不推荐这么做。antd 是一系列 React 组件，但同样是一套设计规范.',
    create_at: '2018-11-19',
  });
}

export default {
  'GET /api/v2/QA/action': actions,
  'GET /api/v2/QA/action/*/replys': replys,
};
