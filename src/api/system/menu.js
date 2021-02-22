import request from '@/utils/request'

export function getMenusTree(pid) {
  return request({
    // url: 'api/menus/lazy?pid=' + pid,
    url: '/core/baseMenu/lazy?pid=' + pid,
    method: 'get'
  })
}

export function getMenus(params) {
  return request({
    // url: 'api/menus',
    url: '/core/baseMenu/list',
    method: 'get',
    params
  })
}

export function getMenuSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    // url: 'api/menus/superior',
    url: '/core/baseMenu/superior',
    method: 'post',
    data
  })
}

export function getChild(id) {
  return request({
    url: '/core/baseMenu/child?id=' + id,
    method: 'get'
  })
}

export function buildMenus() {
  return request({
    // url: 'api/menus/build',
    url: '/core/baseMenu/build',
    method: 'get'
  })
}

export function add(data) {
  return request({
    // url: 'api/menus',
    url: '/core/baseMenu/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  let data = { batchIdList: ids }
  return request({
    url: '/core/baseMenu/batch/delete',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    // url: 'api/menus',
    url: '/core/baseMenu/update',
    method: 'post',
    data
  })
}

export default { add, edit, del, getMenusTree, getMenuSuperior, getMenus, getChild }
