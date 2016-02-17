'use strict';

let fs=require('fs');

/**
 *读取文件增加文件
 */
function readIntrFileStr(fd,len,preOffset,buf){
  return new Promise(function(resolve,reject){
    fs.read(fd,buf,0,len,preOffset,function(err,bytesRead,buffer){
      if (err){
        reject(new Error("readIntrFileStr is wrong.fd="+fd+",len="+len+",preOffset="+preOffset));
      }else{
        resolve(buffer.toString('utf8'));
      }
    })
  });
}

module.exports=readIntrFileStr;
