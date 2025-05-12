// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入路由处理函数模块
const playlist_handler = require('../router_handler/playlist')

// 1. 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { add_comment_schema, delete_comment_schema, like_comment_schema } = require('../schema/user')

 // 获取用户收藏列表
router.get('/comments', playlist_handler.getPlaylistComments)
// 添加评论
router.post('/comments', expressJoi(add_comment_schema), playlist_handler.addPlaylistComment)
// 删除评论
router.delete('/comments/:id', expressJoi(delete_comment_schema), playlist_handler.deletePlaylistComment)
// 点赞评论
router.post('/comments/:id/like', expressJoi(like_comment_schema), playlist_handler.likePlaylistComment)


// 向外共享路由对象
module.exports = router