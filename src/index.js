'use strict';

let fs=require('fs');
let zlib=require('zlib');
let net=require('net');
let co=require('co');

let config=require('./config.json');
let myLog4js=require('./myLog4js');
let logIndex=myLog4js.logIndex,
  logSys=myLog4js.logSys;
/*
 * 创建TCP客户端，设置IP和PORT
*/ 
let client=new net.Socket();
client.setEncoding('utf8');
//连接服务器，如果失败则程序终止
/*
client.connect(config.PORT,config.IP,function(){

});*/ 


/*
 *业务处理
 */
function doBiz(){
  logIndex.info('doBiz is starting');

  //代码执行
  co(bizCode).catch(onError);

  logIndex.info('doBiz is finishing');
}

function* bizCode(){

}

/*
 *错误处理
 */
function onError(err){
  logIndex.error("error:"+err.stack);
}

/*
 *定期处理
 */
setInterval(doBiz,config.INTERVAL);

