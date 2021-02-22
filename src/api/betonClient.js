import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/order/betonClient/save',
    method: 'post',
    data
  })
}

export function getAllClients(id) {
  const params = {
    enabled: true,
    clientId: id
  }
  return request({
    url: '/order/betonClient/list',
    method: 'get',
    params
  })
}

export function getAllStations() {
  const params = {
    enabled: true
  }
  return request({
    url: '/order/clientInfor/list',
    method: 'get',
    params
  })
}

export function updateState(data) {
  return request({
    url: '/order/betonClient/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  let data = { batchIdList: ids }
  return request({
    url: '/order/betonClient/batch/delete',
    method: 'post',
    data: data
  })
}

export function edit(data) {
  return request({
    url: '/order/betonClient/save',
    method: 'post',
    data
  })
}
// export function requestDownload(data) {
//   return request({
//     url: '/order/betonClient/save',
//     method: 'post',
//     data
//   })
// }

export default { add, edit, del }
