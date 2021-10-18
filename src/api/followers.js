/**
 * 评论相关请求模块
 */
import request from '@/utils/request'
 /**
  * 获取文章列表
  */
export const getFollowers = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers',
    params
    })
}