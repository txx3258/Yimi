'use strict';

let fs=require("fs");

let readFileFd=function(path){
  return new Promise(function(resolve,reject){
    fs.open(path,'r',function(err,fd){
      if (err){
        reject(new Error('readFileFd is wrong.path='+path));
      }else{
        resolve(fd);
      }
    });
  });
};

module.exports=readFileFd;
