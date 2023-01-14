const socket = {}
const socketio = require('socket.io')

const sqlConnect = require('../db')


const userList = {}

function getSocket (server) {
  const io = socketio(server, {
    cors: true,
    maxHttpBufferSize: 3 * 1024 * 1024,
  })

  io.on('connection', async socket => {
    // let timestamps = new Date().getTime() //获取时间
    console.log('连接成功')
    // console.log('io.sockets.sockets',io.sockets.sockets) //可以看到当前在线人数
    const socketID = socket.id
    // console.log('socket', socket.id);
    console.log('userList', userList)

    socket.on('login', user => {
      console.log('user', user);
      userList[user.id] = socketID
      io.emit('userList', user)
      console.log('userList', userList)
    })

    socket.on('message', async (data) => {
      console.log('data', data)
      console.log('list', userList)
      console.log('userList', userList[data.to_id])
      // 保存到数据库
      let sql = `INSERT INTO user_message (from_id,from_name,to_id,to_name,message,createTime) VALUES 
      (${data.from_id},'${data.from_name}',${data.to_id},'${data.to_name}','${data.message}','${data.createTime}')`

      result = await new Promise((resolve) => {
        sqlConnect(sql, [], async (err, data) => {
          if (err) {
            resolve(false)
          }
          resolve(true)
        })
      })
      data.success = result
      io.to(userList[data.to_id]).emit('message', data)

    })

    socket.on('disconnect', () => {
      console.log('断开连接', socket.id)
      console.log('userList', userList)
      io.emit('logout', socket.id)
    })

  })

  return io
}

socket.getSocket = getSocket;
//导出socket
module.exports = socket