import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/qiNiuContent/config',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'api/qiNiuContent/config',
    data,
    method: 'put'
  })
}

export function download(id) {
  return request({
    url: 'api/qiNiuContent/download/' + id,
    method: 'get'
  })
}

export function sync() {
  return request({
    url: 'api/qiNiuContent/synchronize',
    method: 'post'
  })
}
export function excelImport(data) {
  // data:data
  return request({
    url: '/order/betonOrder/excel/import',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/qiNiuContent',
    method: 'delete',
    data: ids
  })
}

export default { del, download, sync ,excelImport}
