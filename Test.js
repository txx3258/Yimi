'use strict';

var co=require('co');

co(function* (){
  var a=Promise.resolve(1);
  var b=Promise.resolve(2);
  var c=Promise.resolve(3);

  var res=yield [a,b,c];

  console.log(res);
}).catch(onError);

function onError(err){
  console.log(err.stack);
}
