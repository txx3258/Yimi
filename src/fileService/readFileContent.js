'use strict';

let fs=require('fs');

let gcFileHandler=require('./handler/gcFileHandler');
let perfFileHandler=require('./handler/perfFileHandler');
let dalFileHandler=require('./handler/dalFileHandler');
let memcachedHandler=require('./handler/memcachedHandler');

//读取文件增加文件
function readIntrFileStr(fd,len,preOffset,bufSize){
  return new Promise(function(resolve,reject){
    var buf=new Buffer(bufSize,'utf8');

    fs.read(fd,buf,0,len,preOffset,function(err,bytesRead,buffer){
      if (err){
        reject(new Error("readIntrFileStr is wrong.fd="+fd+",len="+len+",preOffset="+preOffset));
      }else{
        let result=buffer.slice(0,len);
        console.log("send:"+result);
        resolve(result);
      }
    });
  });
}

/**
 * 读取文件内容
*/
function* readFileContent(info){               
  //从文件中读取新增字符串
  let intrFileStr=yield readIntrFileStr(info.fd,info.len,info.preOffset,info.bufSize);

  console.log(intrFileStr);
  
  let fn=undefined;
  //处理字符串
  switch (info.type){
    case 'perf':fn=perfFileHandler;break;
    case 'memcached':fn=memcachedHandler;break;
    case 'dal':fn=dalFileHandler;break;
    case 'gc':fn=gcFileHandler;break;
    case 'rpc':fn=dalFileHandler;break;
  }

  if (!fn){
    return null;
  }
  
  return fn(intrFileStr,info.bizCode);
}

module.exports=readFileContent;
