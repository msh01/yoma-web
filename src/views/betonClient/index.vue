<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">客户编号</label>
        <el-input v-model="query.clientNo" clearable placeholder="客户编号" style="width: 185px;" class="filter-item"
                  @keyup.enter.native="crud.toQuery"/>
        <label class="el-form-item-label">客户名称</label>
        <el-input v-model="query.clientName" clearable placeholder="客户名称" style="width: 185px;" class="filter-item"
                  @keyup.enter.native="crud.toQuery"/>
        <label class="el-form-item-label">客户类型</label>
        <el-input v-model="query.clientType" clearable placeholder="客户类型 1-普通客户" style="width: 185px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <label class="el-form-item-label">审核状态 </label>
        <el-input v-model="query.checkType" clearable placeholder="审核状态" style="width: 185px;" class="filter-item"
                  @keyup.enter.native="crud.toQuery"/>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <!-- <el-form-item label="搅拌站ID 关联 t_client_infor 的 loginAppId">
             未设置字典，请手动设置 Select
           </el-form-item>-->
          <el-form-item label="客户编号">
            <el-input v-model="form.clientNo" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="客户名称" prop="clientName">
            <el-input v-model="form.clientName" style="width: 370px;"/>
          </el-form-item>
          <!-- <el-form-item label="客户类型 1-普通客户">
             未设置字典，请手动设置 Select
           </el-form-item>
           <el-form-item label="性别 1-男 2-女">
                 未设置字典，请手动设置 Radio
           </el-form-item>-->
          <!--  <el-form-item label="审核状态 0-审核通过 1-未审核 2-审核未通过">
              <el-input v-model="form.checkType" style="width: 370px;" />
            </el-form-item>
            <el-form-item label="状态 0-正常 99-删除">
              <el-input v-model="form.state" style="width: 370px;" />
            </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <!--<el-table-column prop="clientId" label="搅拌站ID 关联 t_client_infor 的 loginAppId" />-->
        <el-table-column prop="clientNo" label="客户编号"/>
        <el-table-column prop="clientName" label="客户名称"/>
        <!--<el-table-column prop="clientType" label="客户类型 1-普通客户" />-->
        <el-table-column prop="checkType" label="审核状态"/>
        <el-table-column prop="state" label="状态"/>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createId" label="创建人ID"/>
        <el-table-column prop="createName" label="创建人姓名"/>
        <el-table-column v-permission="['admin','betonClient:edit','betonClient:del']" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
            <el-popover
              :ref="scope.$index"
              v-show="scope.row.state ==0"
              v-permission="['admin']"
              placement="top"
              width="180"
            >
              <p>确定锁定该客户吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
                <el-button type="primary" size="mini"
                           @click="lockMethod(scope.row.id, scope.$index)">确定
                </el-button>
              </div>
              <el-button slot="reference" size="mini" type="text" :loading="delLoading">锁定</el-button>
            </el-popover>
            <el-popover
              :ref="scope.$index"
              v-permission="['admin']"
              v-show="scope.row.state ==1"
              placement="top"
              width="180"
            >
              <p>确定解锁该客户吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
                <el-button type="primary" size="mini" :loading="delLoading"
                           @click="unlockMethod(scope.row.id, scope.$index)">确定
                </el-button>
              </div>
              <el-button slot="reference" size="mini" type="text">解锁</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
import crudBetonClient from '@/api/betonClient'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  clientId: null,
  clientNo: null,
  clientName: null,
  clientType: null,
  sex: null,
  checkType: null,
  state: null,
  createTime: null,
  createId: null,
  createName: null
}
export default {
  name: 'BetonClient',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '客户信息',
      url: '/order/betonClient/list',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudBetonClient }
    })
  },
  data() {
    return {
      delLoading: false,
      permission: {
        add: ['admin', 'betonClient:add'],
        edit: ['admin', 'betonClient:edit'],
        del: ['admin', 'betonClient:del']
      },
      rules: {
        clientName: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'clientNo', display_name: '客户编号' },
        { key: 'clientName', display_name: '客户名称' },
        { key: 'clientType', display_name: '客户类型 1-普通客户' },
        { key: 'checkType', display_name: '审核状态 0-审核通过 1-未审核 2-审核未通过' },
        { key: 'state', display_name: '状态 0-正常 99-删除' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    lockMethod(key, index) {
      const ids = []
      if (key instanceof Array) {
        key.forEach(val => {
          ids.push(val.key)
        })
      } else {
        ids.push(key)
      }
      let data = { id: ids[0], state: 1 }
      crudBetonClient.edit(data).then(() => {
        if (this.$refs[index]) {
          this.$refs[index].doClose()
        }
        this.crud.notify('锁定成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.crud.dleChangePage(1)
        this.crud.toQuery()
      }).catch(() => {
        if (this.$refs[index]) {
          this.$refs[index].doClose()
        }
      })
    },
    unlockMethod(key, index) {
      const ids = []
      if (key instanceof Array) {
        key.forEach(val => {
          ids.push(val.key)
        })
      } else {
        ids.push(key)
      }
      let data = { id: ids[0], state: 0 }
      this.delLoading = true
      crudBetonClient.edit(data).then(() => {
        this.delLoading = false
        if (this.$refs[index]) {
          this.$refs[index].doClose()
        }
        this.crud.notify('解锁成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.crud.dleChangePage(1)
        this.crud.toQuery()
      }).catch(() => {
        this.delLoading = false
        if (this.$refs[index]) {
          this.$refs[index].doClose()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
