'use strict';

/*let fs=require('fs');
let zlib=require('zlib');
let net=require('net');*/
let co=require('co');

let config=require('../config.json');
let myLog4js=require('./myLog4js');
let logIndex=myLog4js.logIndex,
    logBiz=myLog4js.logBiz,
    logSys=myLog4js.logSys;
/*
 * 创建TCP客户端，设置IP和PORT

let client=new net.Socket();
client.setEncoding('utf8');*/
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

/*
 *引入异步代码处理块
 */
let readFileWrap=require('./fdHandler/readFileWrap');
let readStrWrap=require('./fileHandler/readStrWrap');
let sendData=require('./tcpHandler/tcpClient');
let paths=config.PATHS;

//没有配置文件，程序结束
if (!paths||paths.length==0){
  logIndex.info('paths is null.')
  process.exit(0);
}

function* bizCode(){
  //读取新增文件信息
  let readFileWraps=paths.map(function(item,index){
    return readFileWrap(item.path,item.offset,item.type,index);
  });

  if (readFileWraps.length==0){
    logBiz.info('readFileWraps is null');  
    return;
  }
  let wraps=yield readFileWraps;

  //去掉不需要读取的文件
  let handleWraps=wraps.filter(function(wrap){
      if (wrap.readBufSize==0){
        logBiz.info('file no change or file has rename');
        return false;
      }
      return true;
  });

  //读取新增文件字符串
  let readStrWraps=handleWraps.map(function(wrap){
    //全局变量，记录上一次处理的位置
    paths[wrap.index].offset=wrap.offset;

    return readStrWrap(wrap);
  });

  //处理文件格式
  let fileStrs=yield readStrWraps;

  //发送数据
  sendData(fileStrs);

  console.log(fileStrs);
}

/*
 *错误处理
 */
function onError(err){
  logIndex.error("error:"+err.stack);
}

//执行
doBiz();

/*
 *定期处理
 */
setInterval(doBiz,config.INTERVAL);

