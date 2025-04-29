import request from '@/utils/request'
// 获取歌手
export const getArtistData = (params) => request.get('/artists', { params })

//获取歌单
export const getPlaylistData = (params) => request.get('/albums', { params })

// 获取歌手热门曲目信息
export const getTopTracks = (params) => request.get('/top-tracks', { params })

// 获取歌单歌曲
export const getPlaylistTracks = (params) => request.get('/tracks', { params })

// 搜索
export const getSearchResults = (params) => request.get('/search', { params })

// 获取单曲详情（用于音频播放）
export const getTrackDetail = (params) => request.get('/track', { params })
