const express = require('express');
const axios = require('axios');
// const ytdlp = require('yt-dlp-exec'); 
const app = express();
const cors = require('cors');
const joi = require('joi')
const expressJWT = require('express-jwt');
const config = require('./config'); 
const clientId = config.spotify.clientId;
const clientSecret = config.spotify.clientSecret;

app.use(cors());
app.use(express.json()); // 解析 JSON 数据
app.use(express.urlencoded({ extended: false }))
const db = require('./db/index')

// 路由之前，封装 res.cc 函数
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

// 打印请求日志
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('请求头:', req.headers);
    console.log('请求体:', req.body);
    next();
});

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({
    path: [
        /^\/api/,        // 用户登录、注册等接口
        /^\/artists/,    // 歌手信息接口
        /^\/top-tracks/, // 歌手热门歌曲
        /^\/albums/,     // 专辑信息
        /^\/tracks/,     // 专辑歌曲
        /^\/search/, 
        /^\/track/,    
        
    ] }))


const memoryCache = {}
// 缓存助手
async function getOrSetCache(key, fetchFn, ttl = 3600) {
    const now = Date.now();
    const entry = memoryCache[key];
    if (entry && entry.expireAt > now) {
        console.log(`Cache hit: ${key}`);
        return entry.value;
    }
    console.log(`Cache miss: ${key}`);
    const fresh = await fetchFn();
    memoryCache[key] = { value: fresh, expireAt: now + ttl * 1000 };
    return fresh;
}
let cachedToken = null;
let tokenExpireTime = 0;
async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpireTime) return cachedToken;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    console.log('Client ID:', clientId); // 验证 clientId
    console.log('Auth Header:', auth); // 验证生成的 Basic Auth 头
    for (let i = 0; i < 3; i++) {
        try {
            const resp = await axios.post(
                'https://accounts.spotify.com/api/token',
                new URLSearchParams({ grant_type: 'client_credentials' }),
                { headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            cachedToken = resp.data.access_token;
            tokenExpireTime = now + resp.data.expires_in * 1000 - 60000;
            return cachedToken;
        } catch (err) {
            console.error('Token Error:', err.response?.data || err.message);
            if (i === 2) return null;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

//获取歌手信息
app.get('/artists', async (req, res) => {
    const ids = req.query.ids
    if (!ids) return res.status(400).send('Missing artist IDs')
    try {
        const data = await getOrSetCache(`artists:${ids}`, async () => {
            const token = await getAccessToken()
            const resp = await axios.get(
                `https://api.spotify.com/v1/artists?ids=${ids}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            return resp.data
        })
        res.json(data)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message });
    }
})

//获取歌手热门歌曲
app.get('/top-tracks', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send('Missing artist ID');
    try {
        const key = `top-tracks:${id}`;
        const data = await getOrSetCache(key, async () => {
            const token = await getAccessToken();
            const resp = await axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return resp.data;
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


//获取歌单信息
app.get('/albums', async (req, res) => {
    const ids = req.query.ids;
    if (!ids) return res.status(400).send('Missing albums IDs');
    try {
        const key = `albums:${ids}`;
        const data = await getOrSetCache(key, async () => {
            const token = await getAccessToken();
            const resp = await axios.get(`https://api.spotify.com/v1/albums?ids=${ids}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return resp.data;
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

//获取歌单歌曲
app.get('/tracks', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send('Missing album ID');
    try {
        const key = `tracks:${id}`;
        const data = await getOrSetCache(key, async () => {
            const token = await getAccessToken();
            const resp = await axios.get(`https://api.spotify.com/v1/albums/${id}/tracks?market=US`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return resp.data;
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

//搜索歌曲
app.get('/search', async (req, res) => {
    const { q, type, market = 'US', limit = 20, offset = 0 } = req.query;
    if (!q || !type) return res.status(400).send('Missing query parameters');
    try {
        const key = `search:${q}:${type}:${market}:${limit}:${offset}`;
        const data = await getOrSetCache(key, async () => {
            const token = await getAccessToken();
            const resp = await axios.get(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}&market=${market}&limit=${limit}&offset=${offset}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return resp.data;
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 获取单曲详情
app.get('/track', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send('Missing track ID');
    try {
        const key = `track:${id}`;
        const data = await getOrSetCache(key, async () => {
            const token = await getAccessToken();
            const resp = await axios.get(`https://api.spotify.com/v1/tracks/${id}?market=US`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return resp.data;
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
// 导入并使用收藏音乐模块
const songcollectionRouter = require('./router/songcollection')
app.use('/my', songcollectionRouter)
// 导入并使用评论路由模块
const playlistRouter = require('./router/playlist')
app.use('/my', playlistRouter)
// 导入推荐路由模块
const recommendRouter = require('./router/recommend')
app.use('/my', recommendRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 身份认证失败后的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知的错误
    return res.cc(err)
})

app.listen(8080, () => {
    console.log('Server running at http://127.0.0.1:8080');
});
(async function preload() {
    try {
        const token = await getAccessToken();
        if (!token) {
            console.error('预加载失败：无法获取 Spotify Token');
            return;
        }

        // 要预加载的歌手 IDs
        const preloadArtistIds = [
            '2CIMQHirSU0MQqyYHq0eOx',
            '57dN52uHvrHOxijzpIgu3E',
            '1vCWHaC5f2uS3yhpwWbIA6',
            '2YZyLoL8N0Wb9xBt1NhZWg',
            '1Xyo4u8uXC1ZmMpatF05PJ',
            '06HL4z0CvFAxyc27GXpf02',
            '66CXWjxzNUsdJxJ2JdwvnR',
            '0Y5tJX1MQlPlqiwlOH1tJY',
            '6qqNVTkY8uBg9cP3Jd7DAH',
            '6vWDO969PvNqNYHIOW5v0m',];
        if (preloadArtistIds.length) {
            // 一次批量拿回 artists[].  然后分别缓存到 memoryCache
            const resp = await axios.get(
                `https://api.spotify.com/v1/artists?ids=${preloadArtistIds.join(',')}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            resp.data.artists.forEach(artist => {
                if (!artist) return;
                // 直接写入内存缓存
                const key = `artists:${artist.id}`;
                memoryCache[key] = {
                    value: { artists: [artist] },
                    expireAt: Date.now() + 3600 * 1000
                };
            });
        }

        // 同理预加载专辑
        const preloadAlbumIds = [
            '382ObEPsp2rxGrnsizN5TX',
            '1A2GTWGtFfWp7KSQTwWOyo',
            '2noRn2Aes5aoNVsU6iWThc',
            '1kCHru7uhxBUdzkm4gzRQc',
            '5H7ixXZfsNMGbIE5OBSpcb',
            '7aJuG4TFXa2hmE4z1yxc3n',
            '6i7mF7whyRJuLJ4ogbH2wh',
            '03guxdOi12XJbnvxvxbpwG',
            '3mH6qwIy9crq0I9YQbOuDf',
            '3iPSVi54hsacKKl1xIR2eH',];
        if (preloadAlbumIds.length) {
            const resp = await axios.get(
                `https://api.spotify.com/v1/albums?ids=${preloadAlbumIds.join(',')}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            resp.data.albums.forEach(album => {
                if (!album) return;
                const key = `albums:${album.id}`;
                memoryCache[key] = {
                    value: { albums: [album] },
                    expireAt: Date.now() + 3600 * 1000
                };
            });
        }

        console.log('Preload completed successfully');
    } catch (err) {
        console.error('Preload error:', err);
    }
})();
