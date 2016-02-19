'use strict';

let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let logBiz=require('../myLog4js').logBiz;
let logSys=require('./myLog4js').logSys;

/*
 *模式
 */
var Chart=new Schema({
  x:String,
  y:String,
  z:String,
  l:String,
  r:String,
  t:String,
  d:Date,
});

/*
 *model写入
 */
Chart.methods.addPoints=function(point,callback){
    this.x=point.x;
    this.y=point.y;
    this.z=point.z;
    this.l=point.l;
    this.r=point.r;
    this.t=point.t;
    this.d=new Date();

    this.save(callback);
}

var Point=function(point){
  //赋值
  return {
    x:point.x,
    y:point.y,
    z:point.z,
    l:point.l,
    r:point.r,
    t:point.t,
    d:new Date()
  }
};

/*
 *批量写入数据库
 */
function addDB(points){
  console.log("doing:"+JSON.stringify(points))
  if (points.length==1){
    logBiz.warn('add DB points is []');
    return;
  }

  points.forEach(function(items){
    let its=JSON.parse(items);

    its.forEach(function(item){
      let collectName=item.z;
      db.model(collectName,Chart).create(Point(item),function(err){
        if (err){
          logSys.warn('mongoose create is err.err='+err+",item="+item);
        }
      });
    })
  })

  //批量执行
  //bulk.execute();
};

module.exports=addDB;
