'use strict';

let wrapAPI=require('./wrapAPI');
let connectMongo=require('../../mongoHandler/mongoConnect');
let showCollections=require('../../models/chart').showCollections;

function handleResult(req,res){
  return function*(){
    let query=req.query;
    let type=query.type;
    let code=query.code;
  
    //异步：连接mongo
    let isCon=yield connectMongo();
    if (!isCon){
      throw new Error('cannot connect mongo');
    }

    //异步：查询mongo
    let datas=yield showCollections();

    //数据组装
    let options=datas.map(function(item){
      return '<option value="'+item+'">'+item+'</option>';
    });

    return options;
  };
}

module.exports=handleResult;
