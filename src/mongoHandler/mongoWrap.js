'use strict';

let mongoose=require("mongoose");
let uri=config.MONGO_URI;
let logSys=require('../myLog4js').logSys;
let logBiz=require('../myLog4js').logBiz;
let connectTimes=0;

//引入model 
let addToMongoDB=require('../mongoHandler/chart');

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
function addDB(data){
  if (!db){
    //连接数据库
    connectMongo();
    logBiz.warn(JSON.stringify(point));
    return;
  }

  try{ 
    var points=JSON.parse(data);
    let collectName=point.z; 

    //插入数据
    addToMongoDB(collectName,points);
  }catch(e){
    logSys.warn('add mongodb err,e='+e);
    logBiz.warn('data parse json wrong:'+data);
  }
}

module.exports=addPoint(point);


