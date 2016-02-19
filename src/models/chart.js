'use strict';

let mongoose=require('mongoose');
let Schema=mongoose.Schema;

/*
 *模式
 */
var Chart=new Schema({
  x:String,
  y:String,
  z:String,
  l:String,
  r:String,
  t:String
});

var addPoint=function(point){
  //赋值
  return {
    x:point.x,
    y:point.y,
    z:point.z,
    l:point.l,
    r:point.r,
    t:point.t,
    d:new Date()
  }
};

/*
 *批量写入数据库
 */
function addDB(collectName,points){
  var bulk=db.model(collectName,Chart).initializeOrderedBulkOp();
  points.forEach(function(item){
    bulk.insert(addPoint(item));
  })

  //批量执行
  bulk.execute();
};

module.exports=addDB;
