'use strict';

let fs=require('fs');
let readIntrFileStr=require('./readIntrFileStr');

let gcFileHandler=require('./gcFileHandler');
let perfFileHandler=require('./perfFileHandler');
let dalFileHandler=require('./dalFileHandler');
let memcachedHandler=require('./memcachedHandler');

function* readStrWrap(wrap){               
  //从文件中读取新增字符串
  let intrFileStr=yield readIntrFileStr(wrap.fd,wrap.len,wrap.preOffset);

  console.log(intrFileStr);
  let fn=undefined;
  //处理字符串
  switch (wrap.type){
    case 'perf':fn=perfFileHandler;break;
    case 'memcached':fn=memcachedHandler;break;
    case 'dal':fn=dalFileHandler;break;
    case 'gc':fn=gcFileHandler;break;
    case 'rpc':fn=require('./rpcFileHandler');break;
  }

  if (!fn){
    return null;
  }
  
  return fn(intrFileStr,wrap.bizCode);
}

module.exports=readStrWrap;
