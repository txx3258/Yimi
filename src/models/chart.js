'use strict';

var mongoose=require('mongoose');
let Schema=mongoose.Schema;
let logBiz=require('../myLog4js').logBiz;
let logSys=require('../myLog4js').logSys;
let fs=require('fs');
let allCollections=require('./all_collections.json');

let connectMongo=require('../mongoHandler/mongoConnect');
/*
 *模式
 */
let Chart=new Schema({
  x:String,
  y:String,
  z:String,
  l:String,
  r:String,
  t:String,
  d:Date
});

var Point=function(point){
  //赋值
  return {
    x:point.x,
    y:point.y,
    z:point.z,
    l:point.l,
    r:point.r,
    t:point.t,
    d:new Date()
  };
};

/*
 *批量写入数据库
 */
function addDB(points){
  if (points.length==0){
    logBiz.warn('add DB points is []');
    return;
  }

  points.forEach(function(items){
    let its=JSON.parse(items);

    its.forEach(function(item){
      let collectName=item.z;
      allCollections[collectName]=1;

      global.db.model(collectName,Chart).create(Point(item),function(err){
        if (err){
          logSys.warn('mongoose create is err.err='+err+",item="+item);
        }
      });
    });
  });
}

/**
 *查询数据
 */
function queryDB(collectName,queryName,si,count){
  if (!collectName){
    logBiz.warn('queryDB:collectName is null');
    return;
  }

  if (!queryName){
    logBiz.warn('queryDB:queryName is null');
  } 

  //find(),查询条件
  if (typeof queryName!='object'){
    queryName={};
  }

  var query=global.db.model(collectName,Chart).find(queryName);

  //sort({id:}),倒序
  query.sort({id:-1}).skip(si).limit(count);

  return new Promise(function(resolve,reject){
    //exec,执行
    query.exec(function(err,result){
      if (err){
        logBiz.warn('queryDB:exec is err.err='+err);
        reject(err);
      }else{
        /*var rtn=result.map(function(item){
          return item._doc;
          })*/
        resolve(result);
      }
    });
  });
}

/**
 *返回dbModel
 */
function dbModel(collectName){
  return global.db.model(collectName,Chart);
}

/*
 *选出所有Collections（show collections)
 */
function showCollections(){
  return new Promise(function(resolve,reject){
    console.log("test:"+JSON.stringify(db.connection.collections));
    global.db.collectionNames(function(err,names){
      if (!err){
        reject('fetch collectNames is err.err='+err);
      }else{
        resolve(names);
      }
    });
  });
}

/*
 *记录所有集合
*/
setInterval(function(){
  let data=JSON.stringify(allCollections);

  fs.writeFile('./all_collections.txt',data,(err,data)=>{
    if (err){
      logSys.warn('write all collections is err.err='+err)
    }else{
      logSys.info('write all collections:'+data);
    }
  })
},5000);

module.exports.dbModel=dbModel;
module.exports.addDB=addDB;
module.exports.queryDB=queryDB;
module.exports.showCollections=showCollections;
