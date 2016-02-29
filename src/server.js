'use strict';

let net=require('net');
let PORT=require('../config').PORT;
let insertMongoDB=require('./mongoHandler/mongoWrap');

let server=net.createServer(function(socket){
  socket.setEncoding('utf8');
  
  //暂存Buffer
  let buf=[];

  //接受数据
  socket.on('data',function(buffer){
      buf.push(buffer);
      console.log(buffer);
      
      //事件机制，写入数据库同时接收数据
      socket.emit('done');
  });

  //处理数据
  socket.on('done',function(){
    if (buf.length==0){
      return;
    }

    //添加到数据库
    insertMongoDB(buf);
    
    // 单线程确保安全性
    buf=[];
  });

  //结束
  socket.on('end',function(){

    console.log('connect is end');
  });

});

server.listen(PORT);
