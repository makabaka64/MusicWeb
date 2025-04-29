import request from '@/utils/request'

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
