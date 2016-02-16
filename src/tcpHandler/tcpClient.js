'use strict';

//let zlib=require('zlib');
let net=require('net');

let IP=require('../../config.json').IP;
let PORT=require('../../config.json').PORT;
let logSys=require('../myLog4js').logSys;
//连接次数记录
let connectTimes=0;


/*
 *创建TCP客户端，连接IP和PORT
 */
function connectServer(){
  //connectServer start
  logSys.info('connectServer is starting');

  let client=new net.Socket();
  client.setEncoding('utf8');
  
  //连接服务器，如果多次失败则程序终止
  client.connect(PORT,IP,()=>{
    //连接置0
    connectTimes=0;
    logSys.info('client is connect,port='+PORT+',ip='+IP);
  });

  //连接次数记录
  if (connectTimes++==4){
    logSys.info('connect timeS beyond 3 times,process is exit');
    process.exit(0);
  }

  //连接结束
  client.on('end',()=>{
    client=undefined;
    logSys.warn('connect is end');
  })

  //连接关闭
  client.on('close',()=>{
    client=undefined;
    logSys.warn('connect is close');
  })
}

/**
 *发送数据
 */
function sendData(data){
  if (!client){
    connectServer();
    logSys.info('missing data:'+data);
    return;
  }

  //发送
  client.write(data);
}

/**
 *启动时连接
*/
connectServer();

module.exports=sendData;

