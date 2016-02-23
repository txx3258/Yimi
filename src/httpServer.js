'use strict';
var http=require('http');
var express=require('express');
var app=express();
var path = require('path');
var config=require('../config');
var logSys=require('./myLog4js').logSys;


var chart=require('./expressHandler/router/chart');
app.set('views', path.join(__dirname, 'expressHandler/views'));
app.set('view engine', 'ejs');

//接口
app.get('/',function(req,res){
  res.send('hello world!!!');
});

app.get('/api',chart);

//catch 404
app.use(function(req,res,next){
  var err=new Error('Not Found');
  err.status=404;

  next(err);
});

//catch 500
app.use(function(err,req,res,next){
  res.status(err.status||500);

  res.render('error',{
    message:err.message,
    error:{}
  });
});

//创建服务
var server=http.createServer(app);

app.set('port',8081);
server.listen(8081);//config.WEB_PORT);
server.on('error',function(){
  logSys.warn('web express is error');
});

server.on('listening',function(){
  logSys.info('web:express is listening');
});

module.exports=app;
