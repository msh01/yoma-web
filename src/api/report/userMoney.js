/**
 * 用户资金明细表
 * @author xingyuan
 * @date 2020/12/23 15:24.
 */
import request from '@/utils/request'

export function add(data) {
  return request({
    "url": '/core/userMoney/save',
    "method": 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/core/userMoney/save',
    method: 'post',
    data
  })
}

export function getDetail() {
  return request({
    url: '/core/userMoney/detailByMySelf',
    method: 'post'
  })
}

export default { add, edit, getDetail}
