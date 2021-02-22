import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/order/betonCheckingSetting/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  let batchIdList = ids
  let data = { batchIdList }
  return request({
    url: '/order/betonCheckingSetting/batch/delete',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/order/betonCheckingSetting/save',
    method: 'post',
    data
  })
}

export default { add, edit, del }
