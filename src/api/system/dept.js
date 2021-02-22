import request from '@/utils/request'

export function getDepts(params) {
  return request({
    // url: 'api/dept',
    url: '/core/baseDept',
    method: 'get',
    params
  })
}

export function getDeptSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    // url: 'api/dept/superior',
    url: '/core/baseDept/superior',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    // url: 'api/dept',
    url: '/core/baseDept/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  let data = { batchIdList: ids }
  return request({
    url: '/core/baseDept/batch/delete',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/dept',
    method: 'put',
    data
  })
}

export default { add, edit, del, getDepts, getDeptSuperior }
