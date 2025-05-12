const express = require('express')
const router = express.Router()
const recommendHandler = require('../router_handler/recommend')
const expressJoi = require('@escook/express-joi')
const { recommend_schema } = require('../schema/user')

// 协同过滤推荐
router.get(
    '/collaborative/:user_id',
    expressJoi(recommend_schema),
    recommendHandler.collaborativeRecommend
)
router.get('/hotRecommend/:user_id', expressJoi(recommend_schema), recommendHandler.hotRecommend)
module.exports = router