'use strict';

let co=require('co');

let config=require('../config.json');
let myLog4js=require('./myLog4js');
let logIndex=myLog4js.logIndex,
    logBiz=myLog4js.logBiz,
    logSys=myLog4js.logSys;

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


function* bizCode(){
  //读取新增文件信息
  let readFileWraps=paths.map(function(item,index){
    logIndex.info('fd offset='+item.offset);
    return readFileWrap(item.path,item.offset,item.type,index);
  });

  if (readFileWraps.length==0){
    logBiz.info('readFileWraps is null');  
    return;
  }

  //读取文件信息
  let wraps=yield readFileWraps;

  //去掉不需要读取的文件
  let handleWraps=wraps.filter(function(wrap){
      logIndex.info(JSON.stringify(wrap));

      //全局变量，记录上一次处理的位置
      paths[wrap.index].offset=wrap.offset;

      if (wrap.len==0){
        logBiz.info('file no change or file has rename');
        return false;
      }
      return true;
  });

  //读取新增文件字符串
  let readStrWraps=handleWraps.map(function(wrap){

    return readStrWrap(wrap);
  });

  //处理文件格式
  let fileStrs=yield readStrWraps;
  if (fileStrs.length==0){
    logBiz.info('no data');
    return;
  }
  console.log(fileStrs);
  //发送数据
  sendData(fileStrs);

}

/*
 *错误处理
 */
function onError(err){
  logIndex.error("error:"+err.stack);
}

/*
 * 代码执行入口
 */
function main(){
  //没有配置文件，程序结束
  if (!paths||paths.length==0){
    logIndex.info('paths is null.')
    process.exit(0);
  }
  
  doBiz();
}

main();
/*
 *定期处理
 */
setInterval(doBiz,config.INTERVAL);

