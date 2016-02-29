'use strict';

function gcFileHandler(str,type){
  var result=[],rtn;

  //正则表达式
  var reg=/(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d:\d\d).*?\[(ParNew: .*?\),(.*?)secs)\]/g;
  while((rtn=reg.exec(str))!=null){ 
      result.push({
        "x":rtn[2],
        'y':rtn[4],
        'z':'gc_'+type,
        'r':'secs',
        'l':rtn[1],
        't':rtn[3]
      }); 
  }
  
  return JSON.stringify(result);
}

module.exports=gcFileHandler;
