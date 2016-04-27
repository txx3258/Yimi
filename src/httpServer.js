'use strict';
var http=require('http');
var express=require('express');
var app=express();
var path = require('path');
var config=require('../config');
var logSys=require('./common/log').logSys;


var chart=require('./webService/router/chart');
app.set('views', path.join(__dirname, 'webService/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'./static')));

//接口
app.get('/',function(req,res){
  res.send('hello world!!!');
});

app.use('/api',chart);

//catch 404
app.use(function(req,res,next){
  var err=new Error('Not Found');
  err.status=404;

  next(err);
});

//catch 500
app.use(function(err,req,res,next){
  res.status(err.status||500);

  res.send('error',{
    message:err.message,
    error:{}
  });
});

//创建服务
var server=http.createServer(app);
//设置端口Port
app.set('port',config.HTTP_PORT);
server.listen(config.HTTP_PORT);


server.on('error',function(){
  logSys.warn('web express is error');
});

server.on('listening',function(){
  logSys.info('web:express is listening');
});

module.exports=app;
