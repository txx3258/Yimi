'use strict';

function disConnMongo(model){
  if (model&&global.db){
    model.remove(function(){
      db.disconnect();
    })
  }
}

module.exports=disConnMongo;
