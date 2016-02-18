'use strict';

function memcachedHandler(str,type){
  var result=[],rtn;

  //正则表达式memcached.log=>
  var reg=/dump_stats:({.*?})/g;

  while((rtn=reg.exec(str))!=null){ 
      var rn=JSON.parse(rtn[1]+"}");
      var date=new Date(rn.endTime);

      result.push({
        "x":date.toLocaleTimeString(),
        'y':rn.maxCost,
        'z':rn.bizCode+"_"+rn.systemCode+"_"+rn.envCode+"\n"+rn.roleName+":"+rn.methName+"\n"+rn.serverHost,
        'l':date.toLocaleDateString(),
        'r':'ms',
        't':JSON.stringify(rn.costGroup)
      }); 
  }
  
  return JSON.stringify(result);
}

module.exports=memcachedHandler;
