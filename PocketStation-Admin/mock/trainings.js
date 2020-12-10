let trainings = [];
for (var i = 0; i < 3; i++) {
  trainings.push({
    id: `id${i + 1}`,
    title: `培训课程${i + 1}`,
    lecturer: '李xx',
    cover_img: 'http://img5.imgtn.bdimg.com/it/u=3466262299,197041996&fm=26&gp=0.jpg',
    desc: '培训课程-培训课程-培训课程',
    content: 'video url',
    views: 8,
    create_at: '2018-11-14',
  });
}

let lecturers = [];
for (var i = 0; i < 5; i++) {
  lecturers.push({
    id: `id${i + 1}`,
    name: `讲师${i + 1}`,
  });
}

let gains = [];
for (var i = 0; i < 2; i++) {
  gains.push({
    id: `id${i + 1}`,
    dealer: {
      name: '张xx',
      avatar: 'http://img5.imgtn.bdimg.com/it/u=3466262299,197041996&fm=26&gp=0.jpg',
      position: '经理',
    },
    title: '心得标题',
    content: '心得内容',
    is_essence: true,
    create_at: '2018-11-14',
  });
}

export default {
  'GET /api/v2/trainings': trainings,
  'PUT /api/v2/trainings/*/gains/*': {
    message: 'OK !',
  },
  'PUT /api/v2/trainings/*': {
    id: `update_id`,
    title: `update_培训课程`,
    lecturer: '张xx',
    cover_img: 'http://pic.58pic.com/58pic/16/59/12/57Y58PICNJs_1024.jpg',
    desc: '培训课程-培训课程-培训课程',
    content: 'video url',
    views: 0,
    create_at: '2018-11-14',
  },
  'DELETE /api/v2/trainings/*': {
    message: 'delete OK !',
  },
  'GET /api/v2/lecturers': lecturers,
  'POST /api/v2/trainings': {
    id: `add_id`,
    title: `add_培训课程`,
    lecturer: '江x',
    cover_img: 'http://pic.58pic.com/58pic/16/59/12/57Y58PICNJs_1024.jpg',
    desc: '培训课程-培训课程-培训课程',
    content: 'video url',
    views: 0,
    create_at: '2018-11-14',
  },
  'GET /api/v2/trainings/*/gains': gains,
};
