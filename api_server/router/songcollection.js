// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入路由处理函数模块
const songcollection_handler = require('../router_handler/songcollection')

// 1. 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { collect_song_schema, cancel_collect_song_schema } = require('../schema/user')
 // 收藏歌曲
router.post('/collect', expressJoi(collect_song_schema), songcollection_handler.collect)
 // 取消收藏歌曲
router.delete('/deletecollect', expressJoi(cancel_collect_song_schema), songcollection_handler.deletecollect)
 // 获取用户收藏列表
router.get('/collects', songcollection_handler.getcollect)

// 向外共享路由对象
module.exports = router