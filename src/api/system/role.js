import request from '@/utils/request'

// 获取所有的Role
export function getAll() {
  return request({
    url: '/core/baseRole/list',
    method: 'get'
  })
}

export function add(data) {
  let apiRoles = 'api/roles'
  return request({
    url: "/core/baseRole/save",
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/core/baseRole/detail/' + id,
    method: 'get'
  })
}

export function getLevel() {
  return request({
    // url: 'api/roles/level',
    url: '/core/baseRole/level',
    method: 'get'
  })
}

export function del(ids) {
  let data = { batchIdList: ids }
  return request({
    // url: 'api/roles',
    url: '/core/baseRole/batch/delete',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/core/baseRole/save',
    method: 'post',
    data
  })
}

export function editMenu(data) {
  return request({
    // url: 'api/roles/menu',
    url: '/core/baseRole/updateMenu',
    method: 'post',
    data
  })
}

export default { add, edit, del, get, editMenu, getLevel }
