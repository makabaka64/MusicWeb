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

//注册接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reguser', { username, password, repassword })

//登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

//获取用户基本信息
export const userGetInfoService = () => request.get('/my/userinfo')

//更新用户基本信息
export const userUpdateInfoService = (userInfo) =>
  request.post('/my/userinfo', userInfo)
//更新用户头像
export const userUploadAvatarService = (avatar) =>
  request.post('/my/update/avatar', { avatar }).then((res) => res.data)
//更新密码信息
export const userUpdatePassService = ({ oldPwd, newPwd }) =>
  request.post('/my/updatepwd', { oldPwd, newPwd })
//添加收藏
export const userAddFavoriteService = (params) =>
  request.post('/my/collect', params)
//取消收藏
export const userDeleteFavoriteService = ({ user_id, song_id }) =>
  request.delete('/my/deletecollect', { data: { user_id, song_id } })
//获取收藏列表
export const userGetFavoriteListService = (user_id) =>
  request.get('/my/collects', { params: { user_id } })
// 获取歌单的所有评论
export const getPlaylistCommentsService = (playlistId) =>
  request.get('/my/comments', { params: { playlistId } })

// 提交新评论
export const addPlaylistCommentService = (params) =>
  request.post('/my/comments', params)

// 删除自己的评论
export const deletePlaylistCommentService = (commentId) =>
  request.delete(`/my/comments/${commentId}`)

// 点赞评论
export const likePlaylistCommentService = (commentId) =>
  request.post(`/my/comments/${commentId}/like`)

// 协同推荐
export const getCollaborativeRec = (userId) =>
  request.get(`/my/collaborative/${userId}`)

// 热门推荐
export const getHotRec = (userId) => request.get(`/my/hotRecommend/${userId}`)
