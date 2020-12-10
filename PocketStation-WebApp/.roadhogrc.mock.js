import { routerActions } from "react-router-redux";

// import mockjs from 'mockjs';
// import { getToken } from './mock/api';

// const localserver = "http://192.168.0.104:5000/";
const httpServer = "https://pocketstation.cn";


let trainingLessons = [];
for( var i=0; i< 4; i++) {
  trainingLessons.push({
    id: `lesson_id${i+1}`,
    title: `课程A${i+1}`,
    lecturer: 'Cudsn',
    cover_img: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg',
    desc: '',
    content: 'video url',
    views: 0,
    create_at: '2018-11-13',
  })
}

let gains = [];
for( var i=0; i< 1; i++ ) {
  gains.push({
    id: `gains_id${i}`,
    dealer: {
      name: '李xx',
      avatar: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg', 
      position:'经理',  
   },
   title: '推荐课程', 
   content: '平凡，是生活的本色。我们每一个人，对于这个浩缈的世界来说，都十分渺小、脆弱、微不足道。这个世界也是平凡的',
   is_essence: true,
   create_at: '2018-11-13',
  })
}

let FAQData = [];
for( var i=0; i< 4; i++ ) {
  FAQData.push({
    id: `FAQ_ID${i}`,
    title: 'antd 会像 React 那样提供单文件引入吗？',
    answer: '是的，你可以用 script 标签引入。但是我们推荐使用 npm 来引入 antd，这样维护起来更简单方便',
  })
}

let actions = [];
for( var i=0; i< 4; i++ ) {
  actions.push({
    id: `action${i}`,
    avatar: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg',
    name: 'xxx经销商',
    ques: '保证金什么时候会退还?',
    create_at: '2018-11-17',
    reply: 5,
  })
}

let replys = [];
for( var i=0; i< 2; i++ ) {
  replys.push({
    id: `action${i}`,
    ques_id: 'ques_id',
    avatar: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg',
    name: `经销商${i+1}`,
    reply: '你可以覆盖它们的样式，但是我们不推荐这么做。antd 是一系列 React 组件，但同样是一套设计规范.',
    create_at: '2018-11-19',
  })
}


const proxy = {
  // "GET /api/v2/tokens": "http://192.168.0.104:5000/",
// "POST /api/v2/tokens": "http://192.168.0.104:5000/",
  "GET /api/v2/recommendLessons": [
    {
      lesson_id: 1,
      lessonName: "课程1",
      imgUri: "https://pocketstation.cn/s/files/NES.png"
    },
    {
      lesson_id: 2,
      lessonName: "课程2",
      imgUri: "https://pocketstation.cn/s/files/NES.png"
    },
    {
      lesson_id: 3,
      lessonName: "课程3",
      imgUri: "https://pocketstation.cn/s/files/NES.png"
    },
    {
      lesson_id: 4,
      lessonName: "课程4",
      imgUri: "https://pocketstation.cn/s/files/NES.png"
    },
    {
      lesson_id: 5,
      lessonName: "课程5",
      imgUri: "https://pocketstation.cn/s/files/NES.png"
    }
  ],
  "GET /api/v2/thanksCurrent": {
    id: 1,
    thanksPerson: "Jessical/Carle",
    thanksCon: "感谢您多年来对我的支持",
    time: "刚刚"
  },
  "GET /api/v2/carouselList":  [
    {
      "id": 1,
      "url": 'https://zos.alipayobjects.com/rmsportal/AiyWuByWklrrUDlFignR.png'
    },
    {
      "id": 2,
      "url": 'https://zos.alipayobjects.com/rmsportal/TekJlZRVCjLFexlOCuWn.png'
    },
    {
      "id": 3,
      "url": 'https://zos.alipayobjects.com/rmsportal/IJOtIlfsYdTyaDTRVrLI.png'
    }
  ],
  // "POST /api/v2/lessons/1": {  //收藏课程,
  //   "statusCode": "201",
  //   "resData":{
  //     "id": 5,        
  //     "lesson_id": 1, 
  //     "create_at": "2018-9-20",
  //   }
  // },
  // "DELETE /api/v2/lessons/1": { //取消收藏,
  //   "statusCode": "200",
  // 	message: "OK"
  // },
  // "POST /api/v2/lessons/1/thumbs": { //点赞,
  //   "statusCode": "201",
  //   "resData":{
  //     id: 1,
  //     lesson_id: 1,
  //     create_at: "2018-9-19"
  //   }
  // },
  // "DELETE /api/v2/lessons/*/thumbs": { //取消点赞,
  //   "statusCode": "200",
  //   "message": "OK"
  // },
  // "POST /api/v2/lessons/1/comments": {  //发表课程评论
  //   "id": 6,            
  //   "user": {
  //       "id": 2,           
  //       "name": '最新评论',         
  //       "avatar": "https://pocketstation.cn/s/files/NES.png",      
  //       "bu": "DSD",        
  //       "pos": "经理",         
  //   },
  //   "content": "test--test",      
  //   "create_at":"刚刚"   
  // },
  // "GET /api/v2/lessons/1/comments": [ //获取课程评论
  //   {
  //     "id": 1,           
  //     "user": {
  //         "id": 3,         
  //         "name": "test1",        
  //         "avatar": "https://pocketstation.cn/s/files/NES.png",      
  //         "bu": "NES",          
  //         "pos": "员工",        
  //     },
  //     "content": "很实用",     
  //     "create_at": "2018-9-19",   
  //   }
  // ],
  // "GET /api/v2/lessons/1": {  //获取某一课程信息
  //   "name": "余姚",      
  //   "type": "video",       
  //   "content": "",    
  //   "lecturer": {     
  //       "id": 1,           
  //       "name": "讲师姓名",         
  //       "avatar": "https://pocketstation.cn/s/files/NES.png",       
  //       "bu": "DSD&NES",          
  //       "pos": "测试经理",          
  //       "lessons": 5,      
  //   },
  //   // "content": [
  //   //   'https://pocketstation.cn/s/files/NES.png',
  //   //   'https://pocketstation.cn/s/files/OJR.png',
  //   // ],
  //   // "lecturer": '',
  //   "views": 10,      
  //   "thumbs": 4,     
  //   "me": {
  //       "thumbed": false,     
  //       "collected": false,   
  //   }
  // },
 
"GET /api/v2/parts/*/subparts": [  //术式课程
    {
        id: 1,         
        name: "基础解剖1",      
        cover_img: "https://pocketstation.cn/s/files/NES.png",  
    },
    {
        id: 2,         
        name: "基础解剖2",       
        cover_img: "https://pocketstation.cn/s/files/NES.png",  
    },
    {
    		id: 3,         
    		name: "基础解剖3",       
    		cover_img: "https://pocketstation.cn/s/files/NES.png",  
    }
  ],
  "GET /api/v2/subparts/*/tools": [ //课程二级分类--术式下的工具
    {
      id: 1,        
      name: 'Zebra对比海报',       
      type: 'pdf',      
      content: 'pdf图片',    
      me: {
          collected: false,  
      }
    },
    {
    	id: 2,        
    	name: 'OP Model',       
    	type: 'video',      
    	content: '视频图片',    
    	me: {
    			collected: true,  
    	}
    }
  ],
  // "GET /api/v2/subparts/*/lessons": [//课程二级分类下的课程
  // 		{
  //       id: 1,         
  //       name: '视频课程',       
  //       type: 'video',       
  //       cover_img: 'https://pocketstation.cn/s/files/NES.png',  
  //       content: '',  
  //       lecturer: {     
  //           id: 1,           
  //           name: "qw",         
  //           avatar: '',       
  //           bu: '',           
  //           pos: '',          
  //           lessons: '',     
  //       },    
  //       views: 2,      
  //       thumbs: 3,     
  //       me: {
  //           thumbed: true,     
  //           collected: false,   
  //       }
  //   }
  // ],
  
  // "GET /api/v2/resoures": [
  // 	{
  //     id:1,
  // 		imgUri: "https://pocketstation.cn/s/files/NES.png",
  // 		title: "资源1",
  //     type: "pdf"
  // 	},
  // 	{
  //     id:2,
  // 		imgUri: "https://pocketstation.cn/s/files/NES.png",
  // 		title: "资源2",
  //     type: "video"
  // 	},
  // 	{
  //     id:3,
  // 		imgUri: "https://pocketstation.cn/s/files/NES.png",
  // 		title: "资源3",
  //     type: "pdf"
  // 	},
  //   {
  //     id:4,
  //   	imgUri: "https://pocketstation.cn/s/files/NES.png",
  //   	title: "资源4",
  //   	type: "pdf"
  //   }
  // ],
  // "GET /api/v2/tokens": localserver,
  "GET /api/v2/tokens": {"bound": true, "token": "eyJhbGciOiJIUzI1NiIsImlhdCI6MTUzNjgwNjQzMiwiZXhwIjoxNTM2ODEwMDMyfQ.eyJpZCI6MX0.bQG1OWkNVvyq6395fkS9_xaefo4lhjkQ_TFYowSyUZQ", "openid": "onNfQ1BN4m_OdGTfUYMOddIoq37E"},  
  
//   'GET /api/v2/tokens': {
//     'bound': true,
//     "code": "rrr",
//     "openid": '2',
//     "token": "TOKEN",
//   },
  // "POST /api/v2/tokens": localserver,
  "POST /api/v2/tokens": {
    "bound": true,
    "openid":"onNfQ1LQOvk3qHh767lkyhC2zWOE",
    "token": "cadf"
  },
  // "GET /api/v2/me": localserver,
  "GET /api/v2/me": {
    "id": 2,
    "name": "小A",
    "avatar": "https://pocketstation.cn/s/files/NES.png",
    "bu": "",
    "opsition": "",
    "email": "tt01@bbraun.com",
    "type": "staff"
  },

  // "GET /api/v2/resources/*": localserver,
  
  // 'GET /api/v2/resources/*': [
  //   {
  //     id: 1,         
  //     name: 'AP-CM',      
  //     type: 'folder',     
  //     content: '',    
  //   },
  //   {
  //     id: 2,
  //     name: 'CMS',      
  //     type: 'other',     
  //     content: '/CMS.docx',      
  //   }
  // ],
  
  "GET /api/v2/newsparts": [
    {
      "id": 1,
      "name": "事业部"
    },
    {
      "id": 2,
      "name": "NES"
    },
    {
      "id": 3,
      "name": "DSD"
    },
    {
    	"id": 4,
    	"name": "OJR"
    },
    {
    	"id": 5,
    	"name": "OPM"
    },
    {
    	"id": 6,
    	"name": "蛇牌学院"
    }
  ],
  "GET /api/v2/newsparts/*/news/top": [
    {
      "id": "a",
      "title": "B.Braun Country Market News - 8月刊",
      "brief": "德国：内植入物登记将会实现",
      "cover_img":"https://pocketstation.cn/s/files/NES.png",
      "content": ["https://pocketstation.cn/s/files/NES.png","https://pocketstation.cn/s/files/NES.png"],
      "create_at": "2018-9-23"
    },
    {
    	"id": "b",
    	"title": "B.Braun Country Market News - 8月刊",
    	"brief": "德国：内植入物登记将会实现",
    	"cover_img":"https://pocketstation.cn/s/files/NES.png",
    	"content": ["https://pocketstation.cn/s/files/NES.png","https://pocketstation.cn/s/files/NES.png"],
    	"create_at": "2018-9-23"
    }
  ],
  "GET /api/v2/newsparts/1/news/*":[
    {
    	"id": "11",
    	"title": "B.Braun Country Market News - 8月刊",
    	"brief": "11德国：内植入物登记将会实现",
    	"cover_img":"https://pocketstation.cn/s/files/NES.png",
    	"content": ["https://pocketstation.cn/s/files/NES.png","https://pocketstation.cn/s/files/NES.png"],
    	"create_at": "2018-9-23"
    }
  ],
  "GET /api/v2/newsparts/2/news/*": [
  	{
  		"id": "21",
  		"title": "B.Braun Country Market News - 8月刊",
  		"brief": "21德国：内植入物登记将会实现",
  		"cover_img":"https://pocketstation.cn/s/files/NES.png",
  		"content": ["https://pocketstation.cn/s/files/NES.png","https://pocketstation.cn/s/files/NES.png"],
  		"create_at": "2018-9-23"
  	}
  ],
  "GET /api/v2/newsparts/3/news/*": [
  	{
  		"id": "31",
  		"title": "B.Braun Country Market News - 8月刊",
  		"brief": "31德国：内植入物登记将会实现",
  		"cover_img":"https://pocketstation.cn/s/files/NES.png",
  		"content": ["https://pocketstation.cn/s/files/NES.png","https://pocketstation.cn/s/files/NES.png"],
  		"create_at": "2018-9-23"
  	}
  ],
  "GET /api/v2/newsparts/4/news/*": [
  	{
  		"id": "41",
  		"title": "B.Braun Country Market News - 8月刊",
  		"brief": "41德国：内植入物登记将会实现",
  		"cover_img":"https://pocketstation.cn/s/files/NES.png",
  		"content": ["https://pocketstation.cn/s/files/NES.png","https://pocketstation.cn/s/files/NES.png"],
  		"create_at": "2018-9-23"
  	}
  ],
  "GET /api/v2/newsparts/5/news/*": [
  	{
  		"id": "51",
  		"title": "B.Braun Country Market News - 8月刊",
  		"brief": "51德国：内植入物登记将会实现",
  		"cover_img":"https://pocketstation.cn/s/files/NES.png",
  		"content": ["https://pocketstation.cn/s/files/NES.png","https://pocketstation.cn/s/files/NES.png"],
  		"create_at": "2018-9-23"
  	}
  ],
  "GET /api/v2/newsparts/6/news/*": [
  	{
  		"id": "61",
  		"title": "B.Braun Country Market News - 8月刊",
  		"brief": "61德国：内植入物登记将会实现",
  		"cover_img":"https://pocketstation.cn/s/files/NES.png",
  		"content": ["https://pocketstation.cn/s/files/NES.png","https://pocketstation.cn/s/files/NES.png"],
  		"create_at": "2018-9-23"
  	}
  ],

  "GET /api/v2/gratstar": {
    id: '1',
    name: 'Julia',
    bu: 'NES',
    position: '技术主管',
    email: 'Julia.Liu@bbraun.com',
    avatar: 'https://pocketstation.cn/s/files/NES.png'
  },
  "GET /api/v2/grats/0/20": [
    {
      from_id: 'f1',         
      from_name: 'Katirna',       
      from_avatar: 'https://pocketstation.cn/s/files/NES.png',    
      to_id: 't1',           
      to_name: 'Julia',         
      to_avatar: 'https://pocketstation.cn/s/files/NES.png',      
      content: '感谢老板在工作中一直以来的指导和帮助',        
      create_at: '18-10-11',       
    },
    {
    	from_id: 'f2',         
    	from_name: 'Katirna',       
    	from_avatar: 'https://pocketstation.cn/s/files/NES.png',    
    	to_id: 't2',           
    	to_name: 'Julia',         
    	to_avatar: 'https://pocketstation.cn/s/files/NES.png',      
    	content: '感谢老板在工作中一直以来的指导和帮助',        
    	create_at: '18-09-06',       
    },
    
  ],
  "GET /api/v2/bus": [
    {
      id: 'DSD&NES',
      name: 'DSD&NES'
    },
    {
    	id: 'IT',
    	name: 'IT'
    },
    {
    	id: '蛇牌学院',
    	name: '蛇牌学院'
    },
  ],
  "GET /api/v2/bus/IT/staffs": [
    {
      id: 'staff1',        
      name: '朱碧莲',       
      avatar: 'https://pocketstation.cn/s/files/NES.png',    
      bu: 'IT',         
      position: '',   
    },
    {
    	id: 'staff2',        
    	name: '朱碧莲2',       
    	avatar: 'https://pocketstation.cn/s/files/NES.png',    
    	bu: 'IT',         
    	position: '',   
    },
    {
    	id: 'staff3',        
    	name: '朱碧莲3',       
    	avatar: 'https://pocketstation.cn/s/files/NES.png',    
    	bu: 'IT',         
    	position: '',   
    }
  ],
  "GET /api/v2/bus/DSD&NES/staffs": [
  	{
  		id: 'staff1',        
  		name: '张晋1',       
  		avatar: 'https://pocketstation.cn/s/files/NES.png',    
  		bu: 'DSD&NES',         
  		position: '',   
  	},
  	{
  		id: 'staff2',        
  		name: '张晋2',       
  		avatar: 'https://pocketstation.cn/s/files/NES.png',    
  		bu: 'DSD&NES',         
  		position: '',   
  	}
  ],
  "POST /api/v2/grats": {
    from_id: 'fe',         
    from_name: 'rna',       
    from_avatar: 'https://pocketstation.cn/s/files/NES.png',    
    to_id: 'td',           
    to_name: 'anli',         
    to_avatar: 'https://pocketstation.cn/s/files/NES.png',      
    content: 'ocketstatioocketstatioocketstatio',        
    create_at: '18-09-06',        
  },
  "GET /api/v2/grattrees":[
  	{
  		id: '1',
  		name: '赵瑾',
  		avatar: 'https://pocketstation.cn/s/files/NES.png'
  	},
    {
      id: '2',
      name: '赵瑾',
      avatar: 'https://pocketstation.cn/s/files/NES.png'
    },
    {
    	id: '3',
    	name: '赵瑾',
    	avatar: 'https://pocketstation.cn/s/files/NES.png'
    },
    {
    	id: '4',
    	name: '赵瑾',
    	avatar: 'https://pocketstation.cn/s/files/NES.png'
    },
    {
    	id: '5',
    	name: '赵瑾',
    	avatar: 'https://pocketstation.cn/s/files/NES.png'
    },
  ],
  "GET /api/v2/news/*": {
    "id": "11",
    "title": "B.Braun Country Market News - 8月刊",
    "brief": "11德国：内植入物登记将会实现",
    "cover_img":"https://pocketstation.cn/s/files/NES.png",
    "content": ["https://pocketstation.cn/s/files/NES.png","https://pocketstation.cn/s/files/NES.png"],
    "create_at": "2018-9-23"
  },
  "GET /api/v2/trainings": trainingLessons,
  "GET /api/v2/trainings/*/gains/essence": [  //精华心得
    {
      id: 'id',
      dealer: {
        name: '张xx',
        avatar: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg', 
     },
     title: '推荐课程', 
     content: '平凡，是生活的本色。我们每一个人，对于这个浩缈的世界来说，都十分渺小、脆弱、微不足道。这个世界也是平凡的',
     type: true,
     create_at: '2018-11-13',
    }
  ],
  "GET /api/v2/trainings/*/gains": gains,
  'GET /api/v2/trainings/*': {
    id: `lesson_id_ok`,
    title: `课程A`,
    lecturer: 'Cudsn',
    cover_img: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg',
    desc: '',
    content: '',
    create_at: '2018-11-13',
  },
  'POST /api/v2/gains': {
    id: 'my_id',
    dealer: {
      name: 'xxx',
      avatar: 'https://pocketstation.cn/s/files/NES.png', 
    },
    title: '推荐课程', 
    content: '我的心得',
    type: true,
    create_at: '2018-11-13',
  },
  'GET /api/v2/carousel/dealer': [
    {
      id: 'id1',
      cover_img: 'https://zos.alipayobjects.com/rmsportal/AiyWuByWklrrUDlFignR.png',
      content: 'http://img2.imgtn.bdimg.com/it/u=3368775293,1638675283&fm=26&gp=0.jpg',
    },
    {
      id: 'id2',
      cover_img: 'https://zos.alipayobjects.com/rmsportal/TekJlZRVCjLFexlOCuWn.png',
      content: 'http://img2.imgtn.bdimg.com/it/u=3368775293,1638675283&fm=26&gp=0.jpg',
    },
    {
      id: 'id3',
      cover_img: 'https://zos.alipayobjects.com/rmsportal/IJOtIlfsYdTyaDTRVrLI.png',
      content: 'http://img2.imgtn.bdimg.com/it/u=3368775293,1638675283&fm=26&gp=0.jpg',
    }
  ],
  'GET /api/v2/carousel/dealer/*': {
    id: 'id3',
    cover_img: 'https://zos.alipayobjects.com/rmsportal/IJOtIlfsYdTyaDTRVrLI.png',
    content: 'http://img2.imgtn.bdimg.com/it/u=3368775293,1638675283&fm=26&gp=0.jpg',
  },
  // 'GET /api/v2/lessons/parts': [
  //   { id: 'OTC1', title: "OTC", img: "/OTC1.png" },
  //   { id: 'OTC2', title: "OTC", img: "/OTC2.png" },
  //   { id: 'OTC3', title: "OTC", img: "/OTC3.png" },
  // ],
  'GET /api/lesson_classes': httpServer,
  'GET /api/v2/QA/FAQ': FAQData,
  'GET /api/v2/QA/actions': actions,
  'POST /api/v2/QA/actions': {
    id: `current_id`,
    avatar: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg',
    name: '当前经销商',
    ques: '经销商签约流程?',
    create_at: '2018-11-17',
    reply: 0,
  },
  'GET /api/v2/QA/action/*/replys': replys,
  'GET /api/v2/QA/action/*': {
    id: 'id',
    avatar: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg',
    name: '经销商',
    ques: '保证金什么时候退换?',
    create_at: '2018-11-17',
    reply: 0,
  },
  'POST /api/v2/QA/*/action/replys': {
    id: `curr_user`,
    ques_id: 'ques_id',
    avatar: 'http://img1.imgtn.bdimg.com/it/u=1399504104,2535239035&fm=26&gp=0.jpg',
    name: `curr_经销商`,
    reply: '我们倾向于只提供符合该规范、且带有视觉展现的 UI 组件，也尽量不重复造轮子。我们推荐使用以下社区已有的优秀实现。',
    create_at: '2018-11-19',
  },
  'GET /api/v2/resources/0': [
    {
      id: 1,
      name: 'CMS',
      type: 'folder',
    },
    {
      id: 2,
      name: 'AP-CM',
      type: 'folder',
    },
    {
      id: 3,
      name: 'AES&OPM',
      type: 'video',
    },
    {
      id: 4,
      name: 'otc文件',
      type: 'other',
    }
  ],
  'GET /api/v2/resources/1': [
    {
      id: 1,
      name: 'w',
      type: 'pdf',
    },
    {
      id: 2,
      name: 'd',
      type: 'video',
    },
  ],
  'GET /api/v2/resources/2': [
    {
      id: 1,
      name: 'fff',
      type: 'pdf',
    },
    {
      id: 2,
      name: 'ss',
      type: 'video',
    },
  ]
}

export default proxy;