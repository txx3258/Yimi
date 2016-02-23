'use strict';

let mongoose=require('mongoose');
let config=require("../../config");
let uri=config.MONGO_URI;
let connectTimes=0;
let logSys=require('../myLog4js').logSys;

/*
 *连接mongodb
 */
function connectMongo(){
  return new Promise(function(resolve,reject){
    if (db){
      resolve(true);
      return;
    }
    
    mongoose.connect(uri,function(err){
    if (connectTimes++==3){
      process.exit(0);
    }

    if (err){
      reject(false);
      logSys.warn('mongodb cannot connect!');
      return;
    }
  
    logSys.info('mongodb is connected,uri='+uri);
    //赋值为全局访问
    global.db=mongoose;
    connectTimes=0;

    resolve(true);
  });
  })
}

module.exports=connectMongo;
