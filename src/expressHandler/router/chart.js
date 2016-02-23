'use strict';

var express=require('express');
var router=express.Router();

let chartAPI=require('../api/chartAPI');

router.get('/chart',function(req,res,next){
  console.log('starting...');

  let query=req.query;
  
  //参数验证
  let queryName=query.queryName;
  let collectName=query.collectName;

  if (!queryName||!collectName){
    res.status(400).send('queryName='+queryName+",collectName="+collectName);
    return;
  }

  //访问接口
  chartAPI(req,res);
});

module.exports=router;
