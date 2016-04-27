'use strict';

let readFileFd=require('./readFileFd');
let readFileStat=require('./readFileStat');
let BUFSIZE=require('../../config').BUF_SIZE;

function* readFileWrap(item,index){
  //读取路径的文件fd
  let fd=yield readFileFd(item.path);

  //读取文件信息
  let stats=yield readFileStat(fd);
  
  //读取新增长度
  let offset=stats.size;
  let preOffset=item.offset;
  let len=offset-preOffset;

  if (preOffset==0||len<=0){
    //第一次读或正常文件未变化或日期新文件
    return rtnOpFile(0,offset,preOffset,fd);
  }

  //防止超过BUFSIZE
  if (len>BUFSIZE){
    len=BUFSIZE;
    preOffset=offset-len;
  }

  return rtnOpFile(len,offset,preOffset,fd); 

  //返回处理结果
  function rtnOpFile(len,offset,preOffset,fd){
    return {
      "len":len,
      "offset":offset,
      "preOffset":preOffset,
      "type":item.type,
      "fd":fd,
      "bizCode":item.bizCode,
      "index":index 
    };
  }
}

module.exports=readFileWrap;
