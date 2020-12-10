import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import './index.less';
import createLoading from "dva-loading";

// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e, dispatch) {
    console.log(e.message);
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/user').default);  
app.model(require('./models/dealer_resource').default);
app.model(require('./models/dealer').default);
app.model(require('./models/dealer_news').default);
app.model(require('./models/lessons').default);
app.model(require('./models/dealer_QA').default);
app.model(require('./models/dealer_interAction').default);
app.model(require('./models/dealer_lesson').default);
app.model(require('./models/oprt_lsn').default);
app.model(require('./models/lsn_info').default);
app.model(require('./models/question').default);
app.model(require('./models/tool').default);
app.model(require('./models/staff_resource').default);
app.model(require('./models/staff').default);  
app.model(require('./models/news').default);
app.model(require('./models/staff_thanks').default);
app.model(require('./models/collections').default);
app.model(require('./models/mine').default);



// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
