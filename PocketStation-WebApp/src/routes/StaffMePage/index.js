import { connect } from 'dva';
import React, { Component } from 'react';
import { Flex, WingBlank, WhiteSpace, Toast, Icon } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import MeServices from '../../services/me';
import { integralRadio } from '../../utils/utils';
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import styles from './index.less';

class StaffMePage extends Component {
  state = {
    toCount: 0,
    fromCount: 0,
    // chartData: [{
    //   item: '参与考试',
    //   precent: 70
    // },{
    //   item: '考试情况',
    //   precent: 50
    // },{
    //   item: '感恩次数',
    //   precent: 30
    // },{
    //   item: '被感恩次数',
    //   precent: 70
    // },
    // {
    //   item: '登录次数',
    //   precent: 60
    // },],
    loading: true,
  }
  async componentDidMount() {
    const { onIntegral, showChart, id,  } = this.props;
    let to=0, from=0;
    const { data: toCount, err: toErr } = await MeServices.query_grat_toCount(id);
    if( toErr ) {
      this.setState({
        toCount: 0,
        loading: false,
      })
    }else {
      to = toCount;
      this.setState({
        toCount,
        loading: false,
      })
    }
    
    const { data:fromCount, err: fromErr } = await MeServices.query_grat_fromCount(id);
    if(fromErr ) {
      this.setState({
        fromCount: 0,
        loading: false,
      })
    }else {
      from = fromCount;
      this.setState({
        fromCount,
        loading: false,
      })
    }
    to === 0 && from === 0?null:
    showChart({fromCount: from, toCount: to});

    onIntegral({user_id: id});


    //雷达图
    // let { chartData } = this.state;
    // const { showChart, id } = this.props;

    // const { data: toCount } = await MeServices.query_grat_toCount(id);
    // if( toCount ) {
    //   chartData[3].precent = toCount;
    //   this.setState({
    //     chartData,
    //     loading: false,
    //   })
    // }else {
    //   this.setState({
    //     loading: true,
    //   })
    // }
    
    // const { data:fromCount } = await MeServices.query_grat_fromCount(id);
    // if(fromCount ) {
    //   chartData[2].precent = fromCount;
    //   this.setState({
    //     chartData,
    //     loading: false,
    //   })
    // }else {
    //   this.setState({
    //     loading: true,
    //   })
    // }

    // const { data:loginCount } = await MeServices.query_grat_loginCount(id);
    // if(loginCount ) {

    //   chartData[4].precent = loginCount>=5?5:loginCount;
    //   this.setState({
    //     chartData,
    //     loading: false,
    //   })
    // }else {
    //   this.setState({
    //     loading: true,
    //   })
    // }
    
    // showChart({chartData: this.state.chartData});

  }
  meTopRender = ({name, avatar, honor}) => {
    return (
      <WingBlank size="lg" style={{width: '92%'}}>
        <WhiteSpace size="lg" />
        <Flex className={styles.me_T} justify="between">
          <span className={styles.me_name}>{name}</span>
          <Flex className={styles.me_title} justify="around" align="center" >
            {
              this.props.loading? <Icon type="loading" size='md' color='#fff'/>:
                <Flex className={styles.me_title} justify="around" align="center"><img src="/medal.png" alt="/medal.png"/><span>{honor}</span></Flex>
            }
          </Flex>
          <img src={avatar} alt={avatar} />
        </Flex>
      </WingBlank>
    )
  }
  render() {
    const { id, name, avatar, onPartClick, classes, integral, honor, loading } = this.props;
    const { fromCount, toCount } = this.state;
    return (
      <Flex className={styles.me_container} align="start" direction="column">
        <Flex className={styles.me_T_wrap}>
          <WingBlank size="lg" style={{width: '100%'}}>
            {this.meTopRender({name, avatar, honor})}
          </WingBlank>
        </Flex>
        <WhiteSpace />
        <Flex className={styles.growth_value_wrap}>
          <WingBlank size="lg" style={{width: '100%'}}>
            <Flex className={styles.growth_value_T}>
              <WingBlank size="lg" style={{width: '92%'}}>
                <WhiteSpace size="lg" />
                <Flex justify="between">
                {
                  classes&&classes.map( cs => (
                    <Flex key={cs.img_url} className={styles.card} onClick={() => onPartClick(cs.id)}><img height="70px" src={cs.img_url} alt={cs.img_url} /></Flex>
                  ))
                }
                </Flex>
                <WhiteSpace size="lg" />
                <Flex className={styles.growth_value}>成长值</Flex>
                <Flex className={styles.growth_record} justify="between">
                  <Flex className={styles.growth_L} direction="column" justify="start" align="start">
                    当前积分
                    <Flex className={styles.integral} justify="center" align="start">{
                      loading ? <Icon type="loading" size='md' color='#fff'/>:
                      <span>{integral}</span>
                    }</Flex>
                  </Flex>
                  <Flex className={styles.growth_R}><img src="/book.png" alt="/book.png"/></Flex>
                  {
                    loading ? <Icon type="loading" size='md' color='#fff'/>:
                    <Flex className={styles.mask} style={{width: `${integralRadio(integral)}%`}}></Flex>
                  }
                </Flex>
                <WhiteSpace size="lg" />
              </WingBlank>
            </Flex>
          </WingBlank>
        </Flex>
        <WhiteSpace />
        <Flex justify="start" align='center' className={styles.Me_B_wrap} style={{width: '100%', height: '100%'}}>
          {this.state.loading?<Icon type="loading" size='lg' />:
            fromCount === 0 && toCount === 0 ? <Flex style={{flex: '1'}} justify="center">哇！这里空空如也！<br/>快去感恩吧！</Flex>:
            <Flex className={styles.Me_B_wrap} style={{width: '200px'}} id="pie" justify="center" direction="column"></Flex>
          }
          <Flex justify="center" align="start" className={styles.jifenInfo}>
            <img src="/record.png" alt="/record.png" width="68px" />
          </Flex>
        </Flex>
        {/* <Flex className={styles.markWrap} justify="center"><img src="/p_Mark.png" alt="/p_Mark.png" /></Flex> */}
      </Flex>
    )
  }
}


StaffMePage.defaultProps = {
  classes: [
    {id: 1, name: '收藏课程', img_url: '/collect_lessons.png'},
    {id: 2, name: '收藏工具', img_url: '/collect_tools.png'},
    {id: 3, name: '商城兑换', img_url: '/shop.png'},
  ],
  // chartData: [{
  //   item: '参与考试',
  //   precent: 70
  // },{
  //   item: '考试情况',
  //   precent: 50
  // },{
  //   item: '感恩次数',
  //   precent: 30
  // },{
  //   item: '被感恩次数',
  //   precent: 70
  // },
  // {
  //   item: '学习时长',
  //   precent: 60
  // },
  // ]
}

function mapState2Props({user, mine, loading}) {
  const { integral, honor } = mine;
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    email: user.email,
    integral,
    honor,
    loading: loading.effects['mine/getIntegral'],
  }
}

function mapDispatch2Props(dispatch) {
  return {
    onPartClick( id ) {
      if( id === 1 || id === 2 ) {
        dispatch(routerRedux.push(`/collections?id=${id}`))
      }else {
        dispatch(routerRedux.push(`/shop`))
      }
    },
    onIntegral(params) {
      dispatch({type: 'mine/getIntegral', payload: params});
    },
    showChart({fromCount, toCount}) {
      const Shape = G2.Shape;
      let data = [{
        type: '感恩',
        sold: fromCount
      }, {
        type: '被感恩',
        sold: toCount
      }];
      console.log( data )
      Shape.registerShape('interval', 'radiusPie', {
        draw: function draw(cfg, container) {
          // 将归一化后的数据转换为画布上的坐标
          var points = cfg.origin.points;
          var path = [];
          for (var i = 0; i < cfg.origin.points.length; i += 4) {
            path.push(['M', points[i].x, points[i].y]);
            path.push(['L', points[i + 1].x, points[i + 1].y]);
            path.push(['L', points[i + 2].x, points[i + 2].y]);
            path.push(['L', points[i + 3].x, points[i + 3].y]);
            path.push(['L', points[i].x, points[i].y]);
            path.push(['z']);
          }
          path = this.parsePath(path, true);
          var rect = container.addShape('path', {
            attrs: {
              fill: cfg.color || '#000',
              path: path
            }
          });
          var minH = Math.min(path[1][7], path[2][2]);
          var minW = Math.min(path[1][6], path[2][1]);
          var diffH = Math.abs(path[1][7] - path[2][2]);
          var diffW = Math.abs(path[1][6] - path[2][1]);
          container.addShape('circle', {
            attrs: {
              x: minW + diffW / 2,
              y: minH + diffH / 2,
              fill: cfg.color,
              radius: diffH / 2
            }
          });
      
          var minHH = Math.min(path[3][7], path[4][2]);
          var minWW = Math.min(path[3][6], path[4][1]);
          var diffHH = Math.abs(path[3][7] - path[4][2]);
          var diffWW = Math.abs(path[3][6] - path[4][1]);
          container.addShape('circle', {
            attrs: {
              x: minWW + diffWW / 2,
              y: minHH + diffHH / 2,
              fill: cfg.color,
              radius: diffH / 2
            }
          });
          return rect;
        }
      });
      
      var chart = new G2.Chart({
        container: 'pie',
        forceFit: true,
        width: '200',
        height: '200',
        padding: [24, 30, 60, 20]
      });
      
      // var COLORS = ['rgb(60, 203, 195)', 'rgb(253,160,58, .6)'];
      var COLORS = ['#71E3E3', 'rgba(253,160,58, .6)'];
      
      chart.coord('theta', {
        radius: 0.8
      });
      chart.source(data);
      // chart.tooltip(false)
      chart.tooltip({
        showTitle: false
      });
      chart.intervalStack().position('sold').shape('radiusPie').color('type', COLORS).label('sold', {
        useHtml: true,
        htmlTemplate: function htmlTemplate(text, item) {
          var isFemale = item.point.type === '感恩';
          var color = isFemale ? COLORS[0] : COLORS[1];
          return '<div style="text-align:center;color:' + color + '">' + text + '次</div>';
        }
      }).select(false).style({
        lineWidth: 1,
        stroke: '#fff',
      });
      
      chart.render();
    }
    // showChart({chartData}) {
    //   const dv = new View().source(chartData);
    //   dv.transform({
    //     type: 'fold',
    //     fields: ['precent'],  
    //     key: 'type',  
    //     value: 'score' 
    //   });
    //   var chart = new G2.Chart({
    //     container: 'G2',
    //     forceFit: true,
    //     width: '80%',
    //     height: '260',
    //     padding: [20, 20, 20, 20],
    //   });
    //   chart.source(dv, {
    //     score: {
    //       min: 0,
    //       max: 20
    //     }
    //   });
    //   chart.coord('polar', {
    //     radius: 0.8
    //   });
    //   chart.tooltip(true, {
    //     showTitle: true,
    //     inPlot: true,
    //   });
    //   chart.axis('item', {
    //     line: null,
    //     tickLine: null,
    //     grid: {
    //       lineStyle: {
    //         lineDash: null
    //       },
    //       hideFirstLine: false
    //     },
    //   });
    //   chart.axis('score', {
    //     line: null,
    //     tickLine: null,
    //     grid: {
    //       type: 'polygon',
    //       lineStyle: {
    //         lineDash: null
    //       }
    //     }
    //   });
    //   chart.legend('type', {
    //     marker: 'circle',
    //     offset: 30
    //   });
    //   chart.line().position('item*score').color('#27ad77').size(2);
    //   chart.point().position('item*score').color('#27ad77').shape('circle').size(4).style({
    //     stroke: '#fff',
    //     lineWidth: 1,
    //     fillOpacity: 1
    //   });
    //   // chart.area().position('item*score').color('#27ad77');
    //   chart.render();
    // }
  }
}

export default connect(mapState2Props, mapDispatch2Props)(StaffMePage)




