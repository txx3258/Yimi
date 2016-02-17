'use strict';

let fs=require('fs');
let config=require('../../config');
let BUF_SIZE=config.BUF_SIZE;
let readIntrFileStr=require('./readIntrFileStr');

function* readStrWrap(wrap){               
  //从文件中读取新增字符串
  let buf=new Buffer(BUF_SIZE);
  let intrFileStr=yield readIntrFileStr(wrap.fd,wrap.len,wrap.offset,buf);

  console.log(intrFileStr);
  let fn=undefined;
  //处理字符串
  switch (wrap.type){
    case 'perf':fn=require('./perfFileHandler');break;
    case 'memcached':fn=require('./memcachedHandler');break;
    case 'dal':fn=require('./dalFileHandler');break;
    case 'rpc':fn=require('./rpcFileHandler');break;
  }

  if (!fn){
    return;
  }
  
  return fn(intrFileStr)
}

module.exports=readStrWrap;
