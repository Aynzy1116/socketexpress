const sqlConnect = require('../db')
// 获取用户信息
exports.getUsers = async (req, res, next) => {
  try {
    let sql = 'select * from user'
    let sqlArr = []
    let callBack = (err, data) => {
      if (err) {
        console.log('连接出错了');
      } else {
        res.send({
          'list': data
        })
      }
    }
    sqlConnect(sql, sqlArr, callBack)
  } catch (err) {
    next(err)
  }
}

// 新增用户
exports.addUser = async (req, res, next) => {
  const userName = req.body.userName
  const password = req.body.password
  try {
    let sql = `select name from user where name = '${userName}'`
    sqlConnect(sql, [], (err, data) => {
      if (err) {
        console.log('连接出错了');
      } else {
        console.log('data', data);
        if (data.length > 0) {
          res.send({
            'message': '用户名已存在',
            'code': 600
          })
        } else {
          let sql2 = `INSERT INTO user (name,password) VALUES('${userName}','${password}')`
          sqlConnect(sql2, [], (err, data) => {
            if (err) {
              console.log('注册失败');
            } else {
              res.send({
                'message': '注册成功',
                'code': 200
              })
            }
          })
        }
      }
    })
  } catch (err) {
    next(err)
  }
}

// 登录
exports.login = async (req, res, next) => {
  const userName = req.query.userName
  const password = req.query.password
  try {
    let sql = `select * from user where name = '${userName}' and password = '${password}'`
    console.log('sql', sql);
    let sqlArr = []
    let callBack = (err, data) => {
      if (err) {
        console.log('连接出错了');
      } else {
        console.log('data', data);
        if (data.length > 0) {
          res.send({
            'message': '登录成功',
            'code': 200,
            'result': data[0]
          })
        } else {
          res.send({
            'message': '账号或者密码错误',
            'code': 500
          })
        }
      }
    }
    sqlConnect(sql, sqlArr, callBack)
  } catch (err) {
    next(err)
  }
}

// 添加好友
exports.addFriends = async (req, res, next) => {
  try {
    const userName = req.body.userName
    const myId = req.body.myId
    let sql = `select * from user where name = '${userName}'`
    console.log('sql', sql);
    sqlConnect(sql, [], (err, data) => {
      if (err) {
        console.log('连接出错了');
      } else {
        console.log('data', data[0]);
        if (data.length > 0) {
          add(myId, data[0].id, data[0].friends)
        } else {
          res.send({
            'code': 601,
            'message': '用户不存在',
          })
        }
      }
    })
    function add (myId, addfriendId, otherFriends) {
      // 先查用户信息的sql
      let sql2 = `select friends from user where id = '${myId}'`
      sqlConnect(sql2, [], (err, data) => {
        if (err) {
          console.log('连接出错了');
        } else {
          console.log('data111', data[0].friends);
          let friends = []
          if (data[0].friends) {
            friends = data[0].friends.split('-')
          }
          if (otherFriends) {
            otherFriends = otherFriends.split('-')
          }

          if (friends.find(x => x == addfriendId)) {
            res.send({
              'message': '该用户已经是你的好友了',
              'code': 603,
            })
          } else {
            friends.push(addfriendId)
            otherFriends.push(myId)
            friends = friends.join('-')
            otherFriends = otherFriends.join('-')
            // 修改用户信息的sql
            let sql3 = `UPDATE user SET friends='${friends}' WHERE id='${myId}'`
            let sql4 = `UPDATE user SET friends='${otherFriends}' WHERE id='${addfriendId}'`
            sqlConnect(sql3, [], (err, data) => {
              if (err) {
                console.log('连接出错了');
              } else {
                res.send({
                  'message': '添加成功',
                  'code': 200,
                })
              }
            })
            sqlConnect(sql4)
          }
        }
      })
    }
  } catch (err) {
    next(err)
  }
}

// 展示好友
exports.getFriends = async (req, res, next) => {
  const id = req.query.id
  let sql1 = `select friends from user where id = '${id}'`
  sqlConnect(sql1, [], async (err, data) => {
    if (err) console.log('连接出错了')
    else {
      let result = []
      let totalFriends = data[0].friends ? data[0].friends.split('-') : []
      result = await Promise.all(
        totalFriends.map(to_id => {
          return new Promise((resolve, reject) => {
            let sql2 = `select id,name from user where id = '${to_id}'`
            sqlConnect(sql2, [], async (err, data1) => {
              let sql3 = `select * from user_message where (to_id = '${to_id}' AND from_id = '${id}') OR (to_id = '${id}' AND from_id = '${to_id}')`
              sqlConnect(sql3, [], async (err, data) => {
                data1[0].messages = data
                resolve(data1[0])
              })
            })
          })
        })
      )
      // console.log('result', result);
      res.send({
        'result': result,
        'code': 200,
      })

    }
  })
}
