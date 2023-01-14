const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).json({
    echo: 'hello'
  })
})
// 用户相关路由
router.use(require('./user'))

module.exports = router