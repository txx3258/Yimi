'use strict';

let net=require('net');
let PORT=require('../config').PORT;

let server=net.createServer(function(socket){
  socket.setEncoding('utf8');
  
  //暂存Buffer
  let buf=[];

  //接受数据
  socket.on('data',function(buffer){
      buf.push(buffer);
      console.log(buffer);
  })

  //结束
  socket.on('end',function(){
    //获取数据
    //let data=buf.toString();
    
    //buf置空
    //buf='';

    console.log('connect is end');
  });

});

server.listen(PORT);
