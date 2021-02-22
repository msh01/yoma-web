/**
 * 商砼销售收付款明细
 * @author xingyuan
 * @date 2020/12/9 15:24.
 */
import request from '@/utils/request'

export function add(data) {
  return request({
    "url": '/order/betonReceiving/save',
    "method": 'post',
    data
  })
}

export function del(ids) {
  let data = { batchIdList: ids }
  return request({
    url: '/order/betonReceiving/batch/delete',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: '/order/betonReceiving/save',
    method: 'post',
    data
  })
}

export function check(data) {
  return request({
    url: '/order/betonReceiving/check',
    method: 'post',
    data
  })
}

export default { add, edit, del, check }
