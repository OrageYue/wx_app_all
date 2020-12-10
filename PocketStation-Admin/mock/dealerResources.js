let resources = [];
for (var i = 0; i < 1; i++) {
  resources.push({
    id: i,
    name: 'Quintex产品视频',
    type: 'video',
    content: 'http://img5.imgtn.bdimg.com/it/u=615779765,2773044786&fm=26&gp=0.jpg',
    hier: ['DSD', '颈椎'],
  });
}

let hierArr = [];
for (var i = 0; i < 1; i++) {
  resources.push({
    id: i,
    name: ['DSD', '颈椎'],
  });
}

export default {
  'GET /api/v2/resources': resources,
  'POST /api/v2/resources': {
    id: 'add_id',
    name: '神经补片',
    type: 'image',
    content: 'http://img1.imgtn.bdimg.com/it/u=557502435,50793970&fm=15&gp=0.jpg',
    hier: ['NES', '动力系统'],
  },
  'DELETE api/v2/resources/*': {
    message: 'delete ok!',
  },
  'PUT /api/v2/resources/*': {
    id: 'update_id',
    name: '产品',
    type: 'image',
    content: 'http://img1.imgtn.bdimg.com/it/u=557502435,50793970&fm=15&gp=0.jpg',
    hier: ['DSD', '腰椎'],
  },
  'GET /api/v2/resources/hier': hierArr,
};
