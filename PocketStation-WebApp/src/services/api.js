import request from '../utils/request';

export async function getLessonComments( { lesson_id, token } ) { //获取课程评论
  return request(`/api/v2/lessons/${lesson_id}/comments`, {
  	headers: {"Token": token}
  });
}

export async function shareComment( { lesson_id, token, myComment } ) { //提交课程评论
  return request(`/api/v2/lessons/${lesson_id}/comments`, {
  	method: 'POST',
    body: JSON.stringify({"content":myComment}),
  	headers: {"Token": token,"Content-Type": "application/json"}
  });
}


export async function cancelThumb( { lesson_id, token } ) {  //取消点赞
  return request(`/api/v2/lessons/${lesson_id}/thumbs`, {
  	method: 'DELETE',
  	headers: {"Token": token}
  });
}


export async function thumb( { lesson_id, token } ) {  //点赞
  return request(`/api/v2/lessons/${lesson_id}/thumbs`, {
  	method: 'POST',
  	headers: {"Token": token,"Content-Type": "application/json"}
  });
}


export async function cancelCollection( { lesson_id, token } ) { //取消收藏课程
  return request(`/api/v2/lessons/${lesson_id}`, {
  	method: 'DELETE',
  	headers: {"Token": token}
  });
}


export function collection( { lesson_id, token } ) {  //收藏课程
  return request(`/api/v2/lessons/${lesson_id}`, {
  	method: 'POST',
  	headers: {"Token": token,"Content-Type": "application/json"}
  });
}

export async function queryExams(params) {  //获取考试题
  return request(`/api/v2/lessons/${params}/exams`);
}

export async function submitAnswer({token,lesson_id,submitData}) {  //提交答案
  return request(`/api/v2/lessons/${lesson_id}/testings`,{
    method: 'POST',
    body: JSON.stringify(submitData),
    headers: {"Token": token,"Content-Type": "application/json"}
  })
}

export async function getLesson( { lesson_id, token } ) { //获取某一课程信息
  return request(`/api/v2/lessons/${lesson_id}`, {
    method: 'GET',
  	headers: {"Token": token}
  });
}


export async function queryEssenceGains( params ) {  //查询精华心得
  return request(`/api/v2/training/${params}/gains/essence`);
}


export async function queryGains( params ) {  //查询最新心得
  return request(`/api/v2/training/${params}/gains`);
}


export async function queryOperationList({part_id,token}) { //获取课程二级分类--术式
  return request(`/api/v2/parts/${part_id}/subparts`,{
    hesders: {"Token":token}
  });
}

export async function queryOperationTools({subPart_id,token}) { //获取术式下的工具
  return request(`/api/v2/subparts/${subPart_id}/tools`,{
    headers: {"Token": token}
  });
}

export async function queryOperationLsn({subPart_id,token}) { //获取术式下的课程
  return request(`/api/v2/subparts/${subPart_id}/lessons`,{
    headers: {"Token": token}
  });
}


//查询术式列表
// export async function queryOperationList() {
//   return request(`/api/v2/operation`);
// }

//查询资源列表
export async function queryResourcesList() {
  return request(`/api/v2/resoures`);
}

//提交心得
// export async function submitGains( params ) {
//   return request(`/training/${params.training_id}/gains`, {
//     method: 'POST',
    // body: JSON.stringify(params),
    // headers: {"Content-Type": 'application/json'}
//   });
// }

//获取轮播图
// export async function queryCarouselList() {
//   return request(`/api/v2/carouselList`);
// }

//获取最新感恩
// export async function queryThanksCurrent() {
//   return request(`/api/v2/thanksCurrent`);
// }

// //获取推荐课程
// export async function queryRecommendLessons() {
//   return request(`/api/v2/recommendLessons`);
// }

export async function submitGains( params ) {
  return request('/training/{trainingId}/gains', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {"Content-Type": 'application/json'}
  });
}

// export async function getNewsTop( partId ) {
//   return request(`/api/v2/newsparts/${partId}/news/top`);
// }

// export async function getNewsTabs() {
//   return request(`/api/v2/newsparts`);
// }

// export async function getNews({partId,offset,limit}) {
//   return request(`/api/v2/newsparts/${partId}/news/${offset}/${limit}`);
// }

// export async function queryGratStar() {
//   const token = getLocalToken();
//   return request(`/api/v2/gratstar`,{
//   	headers: {"Token": token}
//   });
// }

// export async function getGratsRecord() {
//   const token = getLocalToken();
//   return request(`${host}/api/gratitudes`,{
//   	headers: {"Token": token}
//   });
// }

// export async function getBus(token) {
//   return request('/api/v2/bus',{
//   	headers: {"Token": token}
//   });
// }

// export async function getBu_Staff({buId, token}) {
//   return request(`/api/v2/bus/${buId}/staffs`,{
//   	headers: {"Token": token}
//   });
// }


// export async function postThanks( params ) {
//   const { token, to_id, content } = params;
//   const submitInfo = { to_id, content };
//   return request('/api/v2/grats', {
//     method: 'POST',
//     body: JSON.stringify(submitInfo),
//     headers: {"Content-Type": 'application/json',"Token": token}
//   });
// }

// export async function getNewsItem(newsId) {
//   return request(`/api/v2/news/${newsId}`)
// }

// export async function getGratsTree() {
//   const token = getLocalToken();
//   return request('/api/v2/grattrees',{
//   	headers: {Token: token}
//   });
// }

