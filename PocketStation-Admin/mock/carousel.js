let carsoules = [];
for (var i = 0; i < 4; i++) {
  carsoules.push({
    id: `id${i + 1}`,
    cover_img:
      'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3118376790,3687425655&fm=26&gp=0.jpg',
    content:
      'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2377222830,3755297166&fm=26&gp=0.jpg',
  });
}

export default {
  'GET /api/v2/carousel/dealer': carsoules,
  'PUT /api/v2/carousel/dealer/*': {
    id: 'update_id',
    cover_img:
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1399504104,2535239035&fm=27&gp=0.jpg',
    content:
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1399504104,2535239035&fm=27&gp=0.jpg',
  },
  'DELETE /api/v2/carousel/dealer': {
    message: 'delete ok !',
  },
  'POST /api/v2/carousel/dealer': {
    id: 'add_id',
    cover_img:
      'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2286826859,2252332966&fm=26&gp=0.jpg',
    content:
      'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2286826859,2252332966&fm=26&gp=0.jpg',
  },
};
