'use strict';

var express=require('express');
var router=express.Router();

let wrapAPI=require('../api/wrapAPI');
let chartAPI=require('../api/chartAPI');
let selectTypeAPI=require('../api/selectTypeAPI');

/*
 *图形数据API
*/
router.get('/chart',function(req,res,next){
  let query=req.query;
  
  //参数验证
  //let queryName=query.queryName;
  let collectName=query.collectName;

  if (!collectName){
    res.status(400).send("collectName="+collectName);
    return;
  }

  //访问接口
  wrapAPI(req,res,chartAPI);
});

/*
 *选择下拉项
*/
router.get('/fetchBizType',function(req,res,next){
  let query=req.query;
  let code=query.code;
  let type=query.type;

  if (!code||!type){
    res.status(400).send('code is null');
    return;
  }

  wrapAPI(req,res,selectTypeAPI);
});

module.exports=router;
