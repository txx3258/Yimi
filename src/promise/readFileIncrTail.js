'use strict';

let fs=require("fs");

/*
 *读取文件新增尾部
*/
let readFileIncrTail=function(bufsize,offset,stats){
  return new Promise(function(resolve,reject){
  

    fs.fstat(fd,,function(err,stats){
      if (!err){
        reject(new Error('readFileStat is wrong.path='+fd));
      }else{
        resolve(stats);
      }
    })
  });
}

module.exports=readFileIncrTail;
