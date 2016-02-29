'use strict';

let co=require('co');

/*
 *封装业务处理
 */
function wrapAPI(req,res,handleResult){
  //状态机执行
  co(handleResult(req,res))
  .then(function(result){
    res.json(result);
  }).catch(onerror);

  function onerror(err){
    res.status(500).send(err);
  }
}

module.exports=wrapAPI;
