/**
 * 用户资金提现申请表
 * @author xingyuan
 * @date 2020/12/23 21:10.
 */
import request from '@/utils/request'

export function add(data) {
  return request({
    "url": '/core/paymentRequest/save',
    "method": 'post',
    data
  })
}

/**
 * 推送至下个环节
 * @param id
 * @param notes
 * @returns {AxiosPromise}
 */
export function pushNextLink(id, notes, payMoney) {
  let data = { id: id, notes: notes, payMoney: payMoney }
  return request({
    url: '/core/paymentRequest/pushNextLink',
    method: 'post',
    data
  })
}

/**
 * 驳回申请
 * @param id
 * @param notes
 * @returns {AxiosPromise}
 */
export function rejected(id, notes) {
  let data = { id: id, notes: notes }
  return request({
    url: '/core/paymentRequest/rejected',
    method: 'post',
    data
  })
}

/**
 * 撤销申请
 * @param id
 * @param notes
 * @returns {AxiosPromise}
 * @constructor
 */
export function Undo(id, notes) {
  let data = { id: id, notes: notes }
  return request({
    url: '/core/paymentRequest/Undo',
    method: 'post',
    data
  })
}

/**
 * 查询申请审批流程记录
 * @param processNo 流程编号
 * @returns {AxiosPromise}
 */
export function getProcunitPerform(processNo){
  let data = { processNo: processNo}
  return request({
    url: '/core/procunitPerform/list',
    method: 'post',
    data
  })
}
export function getListByApplyUserId(id){
  let data = { }
  return request({
    url: '/core/paymentRequest/list/',
    method: 'post',
    data
  })
}

export default { add, pushNextLink, rejected, Undo, getProcunitPerform, getListByApplyUserId}
