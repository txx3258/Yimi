'use strict';

let wrapAPI=require('./wrapAPI');
let connectMongo=require('../../mongoHandler/mongoConnect');
let showCollections=require('../../models/chart').showCollections;

let fs=require('fs');
let ALL_COLLECTIONS=require('../../../config').ALL_COLLECTIONS;

function handleResult(req,res){
  return function*(){
    let query=req.query;
    let type=query.type;
    let code=query.code;
    //异步：连接mongo
    //let isCon=yield connectMongo();
    //if (!isCon){
    //throw new Error('cannot connect mongo');
    //}

    //异步：查询mongo
    //let datas=yield showCollections();

    let data=yield loadAllCollections();
    let datas=Object.keys(data);

    //数据组装
    let options=datas.map(function(item){
      if (item.indexOf(type)!=-1){
        return '<option value="'+item+'">'+item+'</option>';
      }else{
        return false;
      }
    });

    let rtn=options.filter(function(item){
      if (item){
        return true;
      }else{
        return false;
      }
    });

    return options;
  };
}

function loadAllCollections(){
  return new Promise(function(resolve,reject){
    fs.readFile(ALL_COLLECTIONS,function(err,data){
      if (err){
        reject('loadAllCollections is err.err='+err);
      }else{
        resolve(JSON.parse(data.toString()));
      }
    })
  });
}

module.exports=handleResult;
