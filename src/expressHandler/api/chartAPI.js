'use strict';

let co=require('co');
let connectMongo=require('../../mongoHandler/mongoConnect');
let queryDB=require('../../models/chart').queryDB;

/*
 *访问图形数据API
 */
function chartAPI(req,res){
  let query=req.query;

  let collectName=query.collectName;
  let queryName=query.queryName;
  let si=query.si;
  let count=query.count;
  let startDate=query.startDate;
  let endDate=query.endDate;

  let result=handleResult(collectName,queryName,si,count,startDate,endDate);
  res.json(result);
}

/*
 *处理结果
 */
function* handleResult(collectName,queryName,si,count){
  //异步：连接mongo
  let connectMongo=yield connectMongo;
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

  return buildResult(labels,data,left,right,tips,desc);
}

/*
 *组装返回结果
 */
function buildResult(labels,data,left,right,tips,desc){
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
	  tip:tips,
	  desc:desc
  };

  return data;
}

module.exports=chartAPI;
