import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// 登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

// 获取用户基本信息
export const userGetInfoService = () => request.get('/my/userinfo')
// 更新用户数据

export const userUpDateService = ({ id, nickname, email, username }) =>
  request.put('/my/userinfo', { id, nickname, email, username })
// 更新用户图像
export const userUpImgSerice = (avatar) =>
  request.patch('/my/update/avatar', { avatar })
// 更换用户密码
export const userChangePasswordSerice = (old_pwd, new_pwd, re_pwd) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
