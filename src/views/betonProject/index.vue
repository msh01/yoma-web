<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">搅拌站ID</label>
        <el-input v-model="query.clientId" clearable placeholder="搅拌站ID" style="width: 185px;" class="filter-item"
                  @keyup.enter.native="crud.toQuery"/>
        <label class="el-form-item-label">商砼客户ID</label>
        <el-input v-model="query.betonClientId" clearable placeholder="商砼客户ID" style="width: 185px;" class="filter-item"
                  @keyup.enter.native="crud.toQuery"/>
        <label class="el-form-item-label">ERP中工程编号</label>
        <el-input v-model="query.projectERPNo" clearable placeholder="ERP中工程编号" style="width: 185px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <!-- <el-form-item label="搅拌站ID" prop="clientId">
             未设置字典，请手动设置 Select
           </el-form-item>
           <el-form-item label="商砼客户ID" prop="betonClientId">
             未设置字典，请手动设置 Select
           </el-form-item>-->
          <el-form-item label="商砼客户" prop="betonClientId">
            <el-select v-model.number="form.betonClientId" placeholder="请选择">
              <el-option v-for="item in clients" :key="item.id" :label="item.clientName" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="ERP中工程编号">
            <el-input v-model="form.projectERPNo" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="工程名称" prop="projectName">
            <el-input v-model="form.projectName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="施工单位">
            <el-input v-model="form.constructionUnit" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="项目地址" prop="addr">
            <el-input v-model="form.addr" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="施工部位" prop="parts">
            <el-input v-model="form.parts" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="浇筑方式" prop="castType">
            <el-input v-model.number="form.castType"/>
          </el-form-item>
          <el-form-item label="砼强度" prop="conStrength">
            <el-input v-model="form.conStrength" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="坍落度" prop="slump">
            <el-input v-model="form.slump" style="width: 370px;"/>
          </el-form-item>
          <!--<el-form-item label="浇筑方式 1-地泵 2-气泵 3-塔吊 4-自卸" prop="castType">
            未设置字典，请手动设置 Select
          </el-form-item>-->
          <el-form-item label="计划方量">
            <el-input v-model="form.cubicNum" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="运费(元/方)">
            <el-input v-model="form.freight" style="width: 370px;"/>
          </el-form-item>
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
        <!--<el-table-column prop="clientId" label="搅拌站ID" />
        <el-table-column prop="betonClientId" label="商砼客户ID" />-->
        <el-table-column prop="projectERPNo" label="ERP中工程编号"/>
        <el-table-column prop="projectName" label="工程名称"/>
        <el-table-column prop="constructionUnit" label="施工单位"/>
        <el-table-column prop="addr" label="项目地址"/>
        <el-table-column prop="parts" label="施工部位"/>
        <el-table-column prop="conStrength" label="砼强度"/>
        <el-table-column prop="slump" label="坍落度"/>
        <!--<el-table-column prop="castType" label="浇筑方式 1-地泵 2-气泵 3-塔吊 4-自卸" />-->
        <el-table-column prop="cubicNum" label="计划方量"/>
        <el-table-column prop="freight" label="运费(元/方)"/>
        <!--<el-table-column prop="state" label="状态 0-进行中 1-结束 99-删除" />-->
        <el-table-column prop="createtime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createtime) }}</span>
          </template>
        </el-table-column>
        <!--  <el-table-column prop="createid" label="创建人ID" />
          <el-table-column prop="createname" label="创建人姓名" />-->
        <el-table-column v-permission="['admin','betonProject:edit','betonProject:del']" label="操作" width="150px"
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
import crudBetonProject from '@/api/betonProject'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { updateState } from "@/api/monitor/online"
import { getAllClients } from "@/api/betonClient"

const defaultForm = {
  id: null,
  clientId: null,
  betonClientId: null,
  projectERPNo: null,
  projectName: null,
  constructionUnit: null,
  addr: null,
  parts: null,
  conStrength: null,
  slump: null,
  castType: null,
  cubicNum: null,
  freight: null,
  state: null,
  createtime: null,
  createid: null,
  createname: null
}
export default {
  name: 'BetonProject',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '工程',
      url: '/order/betonProject/list',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudBetonProject }
    })
  },
  data() {

    return {
      clients: [],
      permission: {
        add: ['admin', 'betonProject:add'],
        edit: ['admin', 'betonProject:edit'],
        del: ['admin', 'betonProject:del']
      },
      rules: {
        /* clientId: [
           { required: true, message: '搅拌站ID不能为空', trigger: 'blur' }
         ],
         betonClientId: [
           { required: true, message: '商砼客户ID不能为空', trigger: 'blur' }
         ],*/
        projectName: [
          { required: true, message: '工程名称不能为空', trigger: 'blur' }
        ],
        addr: [
          { required: true, message: '项目地址不能为空', trigger: 'blur' }
        ],
        parts: [
          { required: true, message: '施工部位不能为空', trigger: 'blur' }
        ],
        conStrength: [
          { required: true, message: '砼强度不能为空', trigger: 'blur' }
        ],
        slump: [
          { required: true, message: '坍落度不能为空', trigger: 'blur' }
        ]/*,
        castType: [
          { required: true, message: '浇筑方式 1-地泵 2-气泵 3-塔吊 4-自卸不能为空', trigger: 'blur' }
        ]*/
      },
      queryTypeOptions: [
        { key: 'clientId', display_name: '搅拌站ID' },
        { key: 'betonClientId', display_name: '商砼客户ID' },
        { key: 'projectERPNo', display_name: 'ERP中工程编号' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },// 新增与编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      // this.getProjects()
      this.getClients()
      // this.getStations()
      // form.enabled = form.enabled.toString()
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
      crudBetonProject.edit(data).then(() => {
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
      crudBetonProject.edit(data).then(() => {
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
    },
    getClients() {
      getAllClients().then(res => {
        this.clients = res.data.list
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>

</style>
