import request from '@/utils/request'
import { downloadFile } from "@/utils"

export function add(data) {
  return request({
    url: '/order/betonCheckingDetail/save',
    method: 'post',
    data
  })/*.then(result => {
    if(result.data.flag){
    }else {
    }
  }).catch(() => {
  })*/
}

export function del(ids) {
  let data = { batchIdList: ids }
  return request({
    url: 'api/betonCheckingDetail/',
    method: 'post',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/order/betonCheckingDetail/save',
    method: 'post',
    data
  })
}

export default { add, edit, del }
