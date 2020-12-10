// 代码中会兼容本地 service mock 以及部署站点的静态数据

const proxy = {
  //  管理员登录获取token
  'POST /admin/token': (req, res) => {
    const { password, userName } = req.body;
    if (password === 'admin' && userName === 'admin') {
      res.status(201).send({
        token: 'TOKEN',
      });
    } else if (userName !== 'admin') {
      res.status(400).send({
        message: '用户名错误',
      });
    } else if (password !== 'admin') {
      res.status(406).send({
        message: '密码错误',
      });
    }
  },
  //  获取管理员权限
  'GET /admin/authorities': {
    currentAuthority: ['admin', 'course', 'resources'],
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};

export default proxy;

// export default {
//   //  管理员登录获取token
//   'POST /api/v2/admin/token': (req, res) => {
//     const { password, userName } = req.body;
//     if (password === 'admin' && userName === 'admin') {
//       res.status(201).send({
//         token: 'TOKEN',
//       });
//     } else if (userName !== 'admin') {
//       res.status(400).send({
//         message: '用户名错误',
//       });
//     } else if (password !== 'admin') {
//       res.status(406).send({
//         message: '密码错误',
//       });
//     }
//   },
//   //  获取管理员权限
//   'GET /api/v2/admin/authorities': {
//     currentAuthority: ['admin', 'course', 'resources'],
//   },
//   'GET /api/500': (req, res) => {
//     res.status(500).send({
//       timestamp: 1513932555104,
//       status: 500,
//       error: 'error',
//       message: 'error',
//       path: '/base/category/list',
//     });
//   },
//   'GET /api/404': (req, res) => {
//     res.status(404).send({
//       timestamp: 1513932643431,
//       status: 404,
//       error: 'Not Found',
//       message: 'No message available',
//       path: '/base/category/list/2121212',
//     });
//   },
//   'GET /api/403': (req, res) => {
//     res.status(403).send({
//       timestamp: 1513932555104,
//       status: 403,
//       error: 'Unauthorized',
//       message: 'Unauthorized',
//       path: '/base/category/list',
//     });
//   },
//   'GET /api/401': (req, res) => {
//     res.status(401).send({
//       timestamp: 1513932555104,
//       status: 401,
//       error: 'Unauthorized',
//       message: 'Unauthorized',
//       path: '/base/category/list',
//     });
//   },
// };
