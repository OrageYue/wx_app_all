let fqas = [];
for (var i = 0; i < 4; i++) {
  fqas.push({
    id: 'faq_id' + i,
    title: '经销商签约流程是什么？',
    answer: '经销商签约流程经销商签约流程经销商签约流程经销商',
  });
}

export default {
  'DELETE /api/v2/QA/FAQ/*': {
    message: 'delete ok!',
  },
  'POST /api/v2/QA/FAQ': {
    id: 'add_faq',
    title: '经销商解约流程是什么？',
    answer: '经销商解约流程是什么',
  },
  'PUT /api/v2/QA/FAQ/*': {
    id: 'update_faq',
    title: '经销商解约流程是什么？',
    answer: '经销商解约流程是什么',
  },
  'GET /api/v2/QA/FAQ/*': {
    id: 'faq',
    title: '经销商解约流程是什么？',
    answer: '经销商解约流程是什么',
  },
  'GET /api/v2/QA/FAQ': fqas,
};
