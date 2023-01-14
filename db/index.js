
const mysql = require('mysql')

const config = require('../config').dbconfig // 获取数据库配置信息
const pool = mysql.createPool(config)

// module.exports = mysql.createPool(config) // mysql.createConnection 方法创建连接实例

module.exports = function(sql, sqlArr, callBack){
  pool.getConnection((err,connect)=>{
    if(err){
      console.log('连接失败',err)
      return
    }
    // 回调
    connect.query(sql, sqlArr, callBack)
    // 释放链接
    connect.release()
  })
}