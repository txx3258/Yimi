'use strict';

let fs=require("fs");

/*
 *读取文件信息
*/
let readFileStat=function(fd){
  return new Promise(function(resolve,reject){
    fs.fstat(fd,function(err,stats){
      if (!err){
        reject(new Error('readFileStat is wrong.path='+fd));
      }else{
        resolve(stats);
      }
    })
  });
}

module.exports=readFileStat;
