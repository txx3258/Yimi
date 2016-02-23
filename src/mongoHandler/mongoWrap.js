'use strict';

let connectMongo=require("./mongoConnect");
let logSys=require('../myLog4js').logSys;
let logBiz=require('../myLog4js').logBiz;

//引入model 
let addToMongoDB=require('../models/chart').addDB;

/*
 *添加入数据库
 */
function addDB(datas){
  if (!global.db){
    //连接数据库
    connectMongo().then(function(){
      logBiz.warn('mongo connect again');  
    },function(err){
      logBiz.warn('mongo connect err');
    });

    logBiz.warn(JSON.stringify(datas));
    return;
  }

  try{ 
    //数据库写入缓慢时，可能接收到多份数据
    datas.forEach(function(data){
      var points=JSON.parse(data);

      //插入数据
      addToMongoDB(points);
    })

  }catch(e){
    logSys.warn('add mongodb err,e='+e);
    logBiz.warn('data parse json wrong:'+datas);
  }
}

module.exports=addDB;


