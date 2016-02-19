'use strict';

let mongoose=require("mongoose");
let config=require("../../config");
let uri=config.MONGO_URI;
let logSys=require('../myLog4js').logSys;
let logBiz=require('../myLog4js').logBiz;
let connectTimes=0;

//引入model 
let addToMongoDB=require('../models/chart');

function connectMongo(){
  mongoose.connect(uri,function(err){
    if (err){
      logSys.warn('mongodb cannot connect!')
    }
  
   if (connectTimes++==3){
      process.exit(0);
    }

    //赋值为全局访问
    global.db=mongoose;
  });
}

/*
 *添加入数据库
 */
function addDB(datas){
  if (!global.db){
    //连接数据库
    connectMongo();
    logBiz.warn(JSON.stringify(datas));
    return;
  }

  try{ 
    //数据库写入缓慢时，可能接收到多份数据
    datas.forEach(function(data){
      var points=JSON.parse(data);
      let collectName=point.z; 

      //插入数据
      addToMongoDB(collectName,points);
    })

  }catch(e){
    logSys.warn('add mongodb err,e='+e);
    logBiz.warn('data parse json wrong:'+data);
  }
}

module.exports=addDB;


