'use strict';

let fs=require('fs');
let config=require('../../config');
/**
 *读取文件增加文件
 */
function readIntrFileStr(fd,len,preOffset){
  return new Promise(function(resolve,reject){
    let buf=new Buffer(config.BUF_SIZE,'utf8');

    fs.read(fd,buf,0,len,preOffset,function(err,bytesRead,buffer){
      if (err){
        reject(new Error("readIntrFileStr is wrong.fd="+fd+",len="+len+",preOffset="+preOffset));
      }else{
        let result=buffer.slice(0,len);
        console.log("send:"+result);
        resolve(result);
      }
    })
  });
}

module.exports=readIntrFileStr;
