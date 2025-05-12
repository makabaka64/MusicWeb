const db = require('../db/index')

// 获取歌单的所有评论（使用递归查询）
exports.getPlaylistComments = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ status: 1, message: '身份认证失败！' })
    }
    // const { playlistId } = req.query
    // const sql = 'SELECT * FROM comments WHERE playlist_id = ? ORDER BY create_time DESC'
    const { playlistId } = req.query
    const sql = `
        WITH RECURSIVE comment_tree AS (
            SELECT 
                id,
                parent_id,
                user_id,
                nickname,
                user_pic,
                content,
                up,
                create_time,
                playlist_id,
                1 AS level
            FROM comments
            WHERE parent_id IS NULL AND playlist_id = ?
            UNION ALL
            SELECT 
                c.id,
                c.parent_id,
                c.user_id,
                c.nickname,
                c.user_pic,
                c.content,
                c.up,
                c.create_time,
                c.playlist_id,
                ct.level + 1
            FROM comments c
            JOIN comment_tree ct ON c.parent_id = ct.id
        )
        SELECT * FROM comment_tree WHERE playlist_id = ? ORDER BY create_time DESC;
    `
    db.query(sql, [playlistId, playlistId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(results)
    })
}

exports.addPlaylistComment = (req, res) => {
    const { content, playlist_id, user_id, nickname, user_pic, parent_id } = req.body;
    // 先算好层级
    const level = parent_id
        ? // 如果有 parent_id，就去查一次它的 level
        null  // 后面用异步方式查
        : 1;

    const create_time = new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

    // 如果有 parent_id，先查父评论的 level
    if (parent_id) {
        const lvlSql = 'SELECT level FROM comments WHERE id = ?';
        return db.query(lvlSql, [parent_id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!rows.length) return res.status(400).json({ error: '父评论不存在' });

            const newLevel = rows[0].level + 1;
            // 再插入
            const insertSql = `
        INSERT INTO comments
          (content, playlist_id, user_id, nickname, user_pic, parent_id, level, create_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
            const params = [
                content,
                playlist_id,
                user_id,
                nickname,
                user_pic,
                parent_id,
                newLevel,
                create_time,
            ];
            db.query(insertSql, params, (err2, result) => {
                if (err2) {
                    console.error('SQL Error:', err2);
                    return res.status(500).json({ error: err2.message });
                }
                res.json({
                    id: result.insertId,
                    parent_id,
                    content,
                    user_id,
                    playlist_id,
                    up: 0,
                    create_time,
                    level: newLevel,
                });
            });
        });
    }

    // 没有 parent_id，直接插一级评论
    const insertSql = `
    INSERT INTO comments
      (content, playlist_id, user_id, nickname, user_pic, parent_id, level, create_time)
    VALUES (?, ?, ?, ?, ?, NULL, 1, ?)
  `;
    const params = [content, playlist_id, user_id, nickname, user_pic, create_time];
    db.query(insertSql, params, (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: result.insertId,
            parent_id: null,
            content,
            user_id,
            playlist_id,
            up: 0,
            create_time,
            level: 1,
        });
    });
};

// 删除自己的评论
exports.deletePlaylistComment = (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    const sql = 'DELETE FROM comments WHERE id = ? AND user_id = ?'
    db.query(sql, [id, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message })
        if (result.affectedRows === 0) return res.status(403).json({ error: '无权删除' })
        res.json({ success: true })
    })
}

// 点赞评论
exports.likePlaylistComment = (req, res) => {
    const { id } = req.params
    const sql = 'UPDATE comments SET up = up + 1 WHERE id = ?'
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ success: true })
    })
}