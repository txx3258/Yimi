'use strict';

let mongoose = require('mongoose');
let config = require("../../config");
let uri = config.MONGO_URI;
let connectTimes = 0;

let logSys = require('../common/log').logSys;
let logBiz = require('../common/log').logBiz;
//引入model 
let addToMongoDB = require('./models/chart').addDB;

/*
 *连接mongodb
 */
function connect() {
    return new Promise(function (resolve, reject) {
        if (global.db) {
            resolve(true);
            return;
        }

        mongoose.connect(uri, function (err) {
            if (connectTimes++ == 3) {
                process.exit(0);
            }

            if (err) {
                reject(false);
                logSys.warn('mongodb cannot connect!');
                return;
            }

            logSys.info('mongodb is connected,uri=' + uri);
            //赋值为全局访问
            global.db = mongoose;
            connectTimes = 0;

            resolve(true);
        });
    });
}

/*
 *添加入数据库
 */
function addDB(datas) {
    if (!global.db) {
        //连接数据库
        connect().then(function () {
            logBiz.warn('mongo connect again');
        }, function (err) {
            logBiz.warn('mongo connect err');
        });

        logBiz.warn(JSON.stringify(datas));
        return;
    }

    try {
        //数据库写入缓慢时，可能接收到多份数据
        datas.forEach(function (data) {
            var points = JSON.parse(data);
            //插入数据
            addToMongoDB(points);
        });
    } catch (e) {
        logSys.warn('add mongodb err,e=' + e);
        logBiz.warn('data parse json wrong:' + datas);
    }
}

/**
 * 断开连接    
 */
function disConnect(model){
  if (model&&global.db){
    model.remove(function(){
      db.disconnect();
    });
  }
}

//加载就执行
connect();

module.exports = {
    "connect": connect,
    "addDB": addDB,
    "disConnect" : disConnect
}