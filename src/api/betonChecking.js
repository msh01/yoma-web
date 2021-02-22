import request from '@/utils/request'
import { parseTime } from "@/utils"

export function add(data) {
  return request({
    url: '/order/betonChecking/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  let data = { batchIdList: ids }
  return request({
    url: '/order/betonChecking/batch/delete',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/order/betonChecking/save',
    method: 'put',
    data
  })
}

// export function downloadFile(obj, name, suffix) {
//   const url = window.URL.createObjectURL(new Blob([obj]))
//   const link = document.createElement('a')
//   link.style.display = 'none'
//   link.href = url
//   const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
//   link.setAttribute('download', fileName)
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
// }


export default { add, edit, del }
