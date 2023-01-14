const express = require('express')
const cors = require('cors') // 为客户端提供跨域资源请求

const http = require('http')

const router = require('./router/index')
const { port } = require('./config') // 获取启动参数

const app = express()

app.use(express.json()) // 配置解析表单请求体
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// 挂载路由
app.use('/api', router)

//创建HTTP server
const server = http.createServer(app);
const socket = require("./websocket/socketio")
process.io = socket.getSocket(server); //使用http协议建立socket
//此处变成http listen
server.listen(3030);

app.listen(port, () => {
  console.log(`express server listen at http://localhost:${port}`)
})