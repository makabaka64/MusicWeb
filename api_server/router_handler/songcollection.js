// 导入数据库操作模块
const db = require('../db/index')

// 收藏歌曲的处理函数
exports.collect = (req, res) => {
    // 从请求体中获取收藏信息
    const { user_id, song_id, songName, singerName, introduction } = req.body

    // 定义 SQL 语句，判断该用户是否已经收藏该歌曲
    const checkSql = 'SELECT * FROM collections WHERE user_id = ? AND song_id = ?'
    db.query(checkSql, [user_id, song_id], (err, results) => {
        if (err) return res.cc(err)
        // 如果已存在收藏记录，则返回提示信息
        if (results.length > 0) {
            return res.cc('该歌曲已被收藏！')
        }
        // 定义插入收藏记录的 SQL 语句
        const insertSql = 'INSERT INTO collections SET ?'
        const newCollection = { user_id, song_id, songName, singerName, introduction }
        db.query(insertSql, newCollection, (err, results) => {
            if (err) return res.cc(err)
            // 判断受影响的行数是否为 1
            if (results.affectedRows !== 1) return res.cc('收藏歌曲失败，请稍后再试！')
            res.cc('收藏歌曲成功！', 0)
        })
    })
}

// 取消收藏歌曲的处理函数
exports.deletecollect = (req, res) => {
    // 从请求体中获取取消收藏所需的参数
    const { user_id, song_id } = req.body
    if (!user_id || !song_id) {
        return res.cc('参数不完整！')
    }
    // 定义删除收藏记录的 SQL 语句
    const deleteSql = 'DELETE FROM collections WHERE user_id = ? AND song_id = ?'
    db.query(deleteSql, [user_id, song_id], (err, results) => {
        if (err) {
            console.log('删除收藏错误:', err);
            return res.cc(err)
        }
        console.log('删除收藏结果:', results);
        // 若受影响行数不为 1，则表示删除失败或记录不存在
        if (results.affectedRows !== 1) return res.cc('取消收藏失败，请稍后再试！')
        res.cc('取消收藏成功！', 0)
    })
}
// 获取用户收藏列表的处理函数
exports.getcollect = (req, res) => {
    // 从请求体中获取用户 id
    // console.log('获取收藏列表请求:', req.query)
    const user_id = req.query.user_id
    // 定义查询用户收藏列表的 SQL 语句
    const sql = `SELECT * FROM collections WHERE user_id = ?`
    db.query(sql, user_id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取收藏列表成功！',
            data: results,
        })
    })
}