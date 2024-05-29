import request from '@/utils/request'
//  分类：获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')

//  分类：添加文章分类
export const artAddChannelsSerive = (data) => request.post('/my/cate/add', data)

//  分类：编辑文章分类
export const artEditChanelsSerive = (data) => request.put('/my/cate/info', data)

//  分类：删除文章分类
export const artDelChannelsSerive = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

// 文章：获取文章列表
export const artGetListSerive = (params) =>
  request.get('/my/article/list', {
    params
  })

// 添加文章
// 注意：data需要是一个formDare格式的对象
export const artPublishSerive = (data) => request.post('/my/article/add', data)

// 获取文章详情
export const artGetDetailSerive = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })

// 文章：编辑文章接口
export const artUpdateSerive = (data) => request.put('/my/article/info', data)
