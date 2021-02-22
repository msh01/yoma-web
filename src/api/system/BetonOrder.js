import request from '@/utils/request'

export function getAllJob() {
  const params = {
    page: 0,
    size: 9999,
    enabled: true
  }
  return request({
    url: '/order/betonOrder/list',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/order/betonOrder/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  let jsonStr = JSON.stringify(ids)
  let batchIdStr = ids.join()
  let data = { "batchIdStr": batchIdStr }
  return request({
    url: '/order/betonOrder/batch/de2lete',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/order/betonOrder/save',
    method: 'post',
    data
  })
}

export default { add, edit, del }
