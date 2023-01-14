const express = require('express')

const userCtrl = require('../controller/user')

const router = express.Router()


// 获取用户
router.get('/getUsers', userCtrl.getUsers)

// 新增用户
router.post('/addUser', userCtrl.addUser)

// 登录
router.get('/login', userCtrl.login)

// 添加好友
router.post('/addFriends', userCtrl.addFriends)

// 展示好友
router.get('/getFriends', userCtrl.getFriends)



module.exports = router