'use strict';

let co=require('co');
let connectMongo=require('../../mongoHandler/mongoConnect');
let model=require('../../models/chart');
let queryDB=model.queryDB;
let dbModel=model.dbModel;
let mongoDisconn=require('../../mongoHandler/mongoDisconn');
/*
 *访问图形数据API
 */
function handleResult(req,res){
  return function*(){
    //参数组装
    let query=req.query;
    let collectName=query.collectName;
    let queryName=JSON.parse(query.queryName);
    let si=query.si;
    let count=query.count;

    let cn=parseInt(count);
    count=isNaN(cn)?50:cn;
    var s=parseInt(si);
    si=isNaN(s)?0:s;

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

    var width=count*30;
    var height=600;

    return buildResult(labels,data,left,right,tip,desc,width,height);
  };
}

/*
 *组装返回结果
 */
function buildResult(labels,data,left,right,tip,desc,width,height){
  var resut = {
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

  return resut;
}

module.exports=handleResult;
