'use strict';

let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let logBiz=require('../myLog4js').logBiz;
let logSys=require('../myLog4js').logSys;

let connectMongo=require('../mongoHandler/mongoConnect');
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
  if (points.length==0){
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
};

/**
 *查询数据
 */
function queryDB(collectName,queryName,si,count){
  if (!collectName){
    logBiz.warn('queryDB:collectName is null');
    return;
  }

  if (!queryName){
    logBiz.warn('queryDB:queryName is null');
  }
  
  si=(!si?0:si);
  count=(!count?50:count);

  si=parseInt(si),count=parseInt(count);
  if (count>1000){
    count=1000;
  }

  //find(),查询条件
  if (typeof queryName!='object'){
    queryName={};
  }

  var query=db.model(collectName,Chart).find(queryName);

  //sort({id:}),倒序
  query.sort({id:-1}).skip(si).limit(count);

  return new Promise(function(resolve,reject){
    //exec,执行
    query.exec(function(err,result){
      if (err){
        logBiz.warn('queryDB:exec is err.err='+err);
        reject(err);
      }else{
        resolve(result);
      }
    }) 
  });
}

/**
 *返回dbModel
 */
function dbModel(collectName){
  return db.model(collectName,Chart);
}

module.exports.dbModel=dbModel;
module.exports.addDB=addDB;
module.exports.queryDB=queryDB;
