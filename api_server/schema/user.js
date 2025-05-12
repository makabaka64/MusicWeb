// 导入定义验证规则的包
const joi = require('joi')

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi
    .string()
    .pattern(/^[\S]{6,12}$/)
    .required()

// 定义 id, nickname, email 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const user_email = joi.string().email().required()
const songName = joi.string().required()
const singerName = joi.string().required()
// 对于专辑介绍，可以是字符串或数字，根据实际业务调整
const introduction = joi.string().required()
const song_id = joi.string().required()
// 定义评论内容的验证规则
const user_id = joi.number().integer().min(1).required()
const playlist_id = joi.string().required()
const content = joi.string().min(1).max(300).required() // 限制 1~300 字符

// 定义验证 avatar 头像的验证规则
const avatar = joi.string().dataUri().required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password,
    },
}

// 验证规则对象 - 更新用户基本信息
exports.update_userinfo_schema = {
    // 需要对 req.body 里面的数据进行验证
    body: {
        id,
        nickname,
        email: user_email,
    },
}

// 验证规则对象 - 更新密码
exports.update_password_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
}

// 验证规则对象 - 更新头像
exports.update_avatar_schema = {
    body: {
        avatar
    }
}

// 验证规则对象 - 收藏歌曲
exports.collect_song_schema = {
    body: {
        user_id: id,
        song_id,
        songName,
        singerName,
        introduction
    }
}

// 验证规则对象 - 取消收藏歌曲
exports.cancel_collect_song_schema = {
    body: {
        user_id: id,
        song_id
    }
}

// 定义评论的验证规则对象
exports.add_comment_schema = {
    body: {
        user_id,
        playlist_id,
        content,
        nickname: joi.string().required(),
        parent_id: joi.number().integer().allow(null),
        user_pic: joi.string().required()
    }
}

// 定义删除评论的验证规则
exports.delete_comment_schema = {
    params: {
        id: joi.number().integer().min(1).required() // 需要一个评论 ID
    }
}

// 定义点赞评论的验证规则
exports.like_comment_schema = {
    params: {
        id: joi.number().integer().min(1).required() // 需要一个评论 ID
    }
}

// 推荐验证规则
exports.recommend_schema = {
    params: {
        user_id: id  
    }
}
