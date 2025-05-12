const db = require('../db/index')
// 协同过滤推荐处理
exports.collaborativeRecommend = (req, res) => {
    try {
        const userId = req.params.user_id

        const sql = `
      SELECT c.song_id, COUNT(*) as score 
      FROM collections c
      WHERE c.user_id IN (
        SELECT DISTINCT user_id 
        FROM collections 
        WHERE song_id IN (
          SELECT song_id 
          FROM collections 
          WHERE user_id = ?
        ) AND user_id != ?
      )
      AND c.song_id NOT IN (
        SELECT song_id 
        FROM collections 
        WHERE user_id = ?
      )
      GROUP BY c.song_id
      ORDER BY score DESC
      LIMIT 8
    `

        db.query(sql, [userId, userId, userId], (err, results) => {
            if (err) return res.cc(err)

            res.send({
                status: 0,
                message: '推荐获取成功',
                data: results
            })
        })
    } catch (err) {
        res.cc(err)
    }
}
exports.hotRecommend = (req, res) => {
    const sql = `
        SELECT song_id, COUNT(*) as collect_count 
        FROM collections 
        GROUP BY song_id 
        ORDER BY collect_count DESC 
        LIMIT 8
    `;

    db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: '热门推荐获取成功',
            data: results
        });
    });
}