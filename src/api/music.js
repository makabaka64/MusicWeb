import request from '@/utils/request'
// 获取歌手
export const getArtistData = (params) => {
  return request({
    url: '/artists',
    method: 'GET',
    params: params
  })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

//获取歌单
export const getPlaylistData = (params) => {
  return request({
    url: '/albums',
    method: 'GET',
    params: params
  })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

// 获取歌手热门曲目信息
export const getTopTracks = (params) => {
  return request({
    url: '/top-tracks',
    method: 'GET',
    params: params //
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error
    })
}
// 获取歌单歌曲
export const getPlaylistTracks = (params) => {
  return request({
    url: '/tracks',
    method: 'GET',
    params: params
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error
    })
}
// 搜索
export const getSearchResults = (params) => {
  return request({
    url: '/search',
    method: 'GET',
    params
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error
    })
}
// 获取单曲详情（用于音频播放）
export const getTrackDetail = (params) => {
  return request({
    url: '/track',
    method: 'GET',
    params
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error
    })
}
