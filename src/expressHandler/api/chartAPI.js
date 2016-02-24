'use strict';

let co=require('co');
let connectMongo=require('../../mongoHandler/mongoConnect');
let model=require('../../models/chart')
let queryDB=model.queryDB;
let dbModel=model.dbModel;
let mongoDisconn=require('../../mongoHandler/mongoDisconn');
/*
 *访问图形数据API
 */
function chartAPI(req,res){
  let query=req.query;

  let collectName=query.collectName;
  let queryName=JSON.parse(query.queryName);
  let si=query.si;
  let count=query.count;

  //代码执行
  co(handleResult(collectName,queryName,si,count))  
  .then(function(result){
    res.json(result);
    remove(collectName);
  }).catch(onerror);

  //断开数据库连接
  function remove(collectName){
    //  let md=dbModel(collectName)
    //  mongoDisconn(md);
  }
  //错误处理
  function onerror(err){
    remove(collectName);
    res.status(500).send(err)
  }
}

/*
 *处理结果
 */
function* handleResult(collectName,queryName,si,count){
  //异步：连接mongo
  let isCon=yield connectMongo();
  if (!isCon){
    throw new Error('can not connect mongo');
  }

  //异步: 查询mongo
  let datas=yield queryDB(collectName,queryName,si,count);
  
  let labels=[],data=[],left='',right='',tip=[],desc='';

  datas.forEach(function(item){
    labels.push(item.x);
    data.push(item.y);
    tip.push(item.t);
  });

  if (datas.length>=1){
    left=datas[0].l;
    right=datas[0].r;
    desc=datas[0].z;
  }

  /*var cn=parseInt(count);
    var count=isNaN(cn)?50:cn;*/
  var width=3000;
  var height=600;

  return buildResult(labels,data,left,right,tip,desc,width,height);
}

/*
 *组装返回结果
 */
function buildResult(labels,data,left,right,tip,desc,width,height){
  var data = {
    labels: labels,
    datasets: [{
        label: "",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data:data
    }],
	  left:left,
	  right:right,
	  tip:tip,
    desc:desc,
    width:width,
    height:height 
  };

  return data;
}

module.exports=chartAPI;
