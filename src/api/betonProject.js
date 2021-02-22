import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/order/betonProject/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  let data = { batchIdList: ids }
  return request({
    url: '/order/betonProject/batch/delete',
    method: 'delete',
    data
  })
}

// export function updateState(data) {
//   return request({
//     url: '/order/betonProject/save',
//     method: 'post',
//     data
//   })
// }

export function getAllProjects(id) {
  const params = {
    page: 0,
    size: 9999,
    enabled: true,
    betonClientId: id
  }
  return request({
    url: '/order/betonProject/list',
    method: 'get',
    params
  })
}

export function getCheckingDetails(data) {
  // const params = {
  //   page: 0,
  //   size: 9999,
  //   enabled: true
  // }
  return request({
    url: '/order/betonCheckingDetail/list',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/order/betonProject/save',
    method: 'post',
    data
  })
}

export default { add, edit, del }
