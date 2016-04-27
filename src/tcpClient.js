'use strict';

let co = require('co');

let config = require('../config.json');
let myLog4js = require('./common/log');
let logIndex = myLog4js.logIndex;
let logBiz = myLog4js.logBiz;
let logSys = myLog4js.logSys;

/*
 *引入异步代码处理块 
 */
let readFileInfo = require('./fileService/readFileInfo');
let readFileContent = require('./fileService/readFileContent');
let sendData = require('./tcpService/sendData');
let paths = config.PATHS;

/*
 *业务处理
 */
function doBiz() {
  logIndex.info('doBiz is starting');

  //代码执行
  co(bizCode).catch(onError);

  logIndex.info('doBiz is finishing');
}

function* bizCode() {
  //装配，读取新增文件信息
  let readFileInfos = paths.map(function (item, index) {
    logIndex.info('fd offset=' + item.offset);
    return readFileInfo(item, index);
  });

  if (readFileInfos.length == 0) {
    logBiz.info('readFileInfos is null');
    return;
  }
  
  //执行,读取文件信息
  let infos = yield readFileInfos;

  //过滤不需要读取的文件
  let handleInfos = infos.filter(function (info) {
    logIndex.info(JSON.stringify(info));

    //全局变量，记录上一次处理的位置
    paths[info.index].offset = info.offset;

    if (info.len == 0) {
      logBiz.info('file no change or file has rename');
      return false;
    }
    
    return true;
  });

  //读取新增文件字符串
  let readFileContents = handleInfos.map(function (info) {
    return readFileContent(info);
  });

  //处理文件格式
  let contents = yield readFileContents;

  //过滤空文件内容
  contents.filter((content) =>{
    if (content) {
      return true;
    }

    logBiz.info('no data');
    return false;
  });
  
  console.log(contents);
  //发送数据
  sendData(fileStrs);
}

/*
 *错误处理
 */
function onError(err) {
  logIndex.error("error:" + err.stack);
}

/*
 * 代码执行入口
 */
function main() {
  //没有配置文件，程序结束
  if (!paths || paths.length == 0) {
    logIndex.info('paths is null.');
    process.exit(0);
  }

  doBiz();
}

//执行
main();

/*
 *定期处理
*/
setInterval(doBiz, config.INTERVAL);

