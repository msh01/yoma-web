<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <template slot="left">
        <!--<el-button class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="dialog = true">
          导入excel
        </el-button>-->
        <!-- 配置 -->
      </template>


      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">

          <el-form-item label="数据日期" prop="beginDataDate">
            <el-date-picker v-model="form.beginDataDate" type="date" style="width: 170px;" placeholder="开始"/>
            <el-date-picker v-model="form.endDataDate" type="date" style="width: 170px;" placeholder="截止"/>
          </el-form-item>

          <el-form-item label="搅拌站" prop="clientId">
            <el-select v-model.number="form.clientId" placeholder="请选择">
              <el-option v-for="item in stations" :key="item.loginAppId" :label="item.companyName"
                         :value="item.loginAppId"/>
            </el-select>
          </el-form-item>

          <el-form-item label="商砼客户" prop="betonClientId">
            <el-select v-model.number="form.betonClientId" placeholder="请选择">
              <el-option v-for="item in clients" :key="item.id" :label="item.clientName" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item label="所属工程" prop="projectId">
            <el-select v-model.number="form.projectId" placeholder="请选择">
              <el-option v-for="item in projects" :key="item.id" :label="item.projectName" :value="item.id"/>
            </el-select>
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
        <!--<el-table-column prop="id" label="主键"/>-->
        <el-table-column prop="dataDate" label="数据日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dataDate) }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="clientId" label="搅拌站ID 关联 t_client_infor 的 loginAppId"/>
        <el-table-column prop="betonClientId" label="商砼客户ID 关联 t_beton_client"/>
        <el-table-column prop="projectId" label="工程信息ID 关联 t_beton_project"/>-->
        <el-table-column prop="parts" label="施工部位"/>
        <el-table-column prop="castType" label="浇筑方式"/>
        <el-table-column prop="conStrength" label="砼标号"/>
        <el-table-column prop="realityTon1" label="净重 搅拌站"/>
        <el-table-column prop="cubicNum1" label="方量 搅拌站"/>
        <el-table-column prop="mortarTon1" label="砂浆净重 搅拌站"/>
        <el-table-column prop="mortarCubicNum1" label="砂浆方量 搅拌站"/>
        <el-table-column prop="realityTon2" label="净重 客户"/>
        <el-table-column prop="cubicNum2" label="方量 客户"/>
        <el-table-column prop="mortarTon2" label="砂浆净重 客户"/>
        <el-table-column prop="mortarCubicNum2" label="砂浆方量 客户"/>
        <el-table-column prop="realityTon" label="净重 结算"/>
        <el-table-column prop="cubicNum" label="方量 搅拌站结算"/>
        <el-table-column prop="cubicNum01" label="方量 客户结算"/>
        <el-table-column prop="mortarTon" label="砂浆净重 结算"/>
        <el-table-column prop="mortarCubicNum" label="砂浆方量 搅拌站结算"/>
        <el-table-column prop="mortarCubicNum01" label="砂浆方量 客户结算"/>
        <el-table-column prop="compCubicNum" label="小方补助方量"/>
        <el-table-column prop="compMoney" label="小方补助金额"/>
        <el-table-column prop="unitPrice1" label="含税单价 搅拌站"/>
        <el-table-column prop="unitPriceSum1" label="含税金额 搅拌站"/>
        <el-table-column prop="unitSellingPrice1" label="不含税单价 搅拌站"/>
        <el-table-column prop="unitSellingPriceSum1" label="不含税金额 搅拌站"/>
        <el-table-column prop="priceMakup1" label="加价(单价增加) 搅拌站"/>
        <el-table-column prop="unitPrice2" label="含税单价 客户"/>
        <el-table-column prop="unitPriceSum2" label="含税金额 客户"/>
        <el-table-column prop="unitSellingPrice2" label="不含税单价 客户"/>
        <el-table-column prop="unitSellingPriceSum2" label="不含税金额 客户"/>
        <el-table-column prop="priceMakup2" label="加价(单价增加)"/>
        <el-table-column prop="checkingNo1" label="搅拌站对账编号"/>
        <el-table-column prop="checkingNo2" label="客户对账编号"/>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createId" label="创建人ID 0表示自动生成"/>
        <el-table-column prop="updateTime" label="修改时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','betonCheckingDetail:edit','betonCheckingDetail:del']" label="操作"
                         width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
import crudBetonCheckingDetail from '@/api/betonCheckingDetail'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllProjects } from "@/api/betonProject"
import { getAllClients, getAllStations } from "@/api/betonClient"

const defaultForm = {
  id: null,
  dataDate: null,
  clientId: null,
  betonClientId: null,
  projectId: null,
  parts: null,
  unitPriceSum2: null,
  unitSellingPrice2: null,
  unitSellingPriceSum2: null,
  priceMakup2: null,
  checkingNo1: null,
  checkingNo2: null,
  createTime: null,
  createId: null,
  updateTime: null
}
export default {
  name: 'BetonCheckingDetail',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '对账明细',
      url: '/order/betonCheckingDetail/list',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudBetonCheckingDetail }
    })
  },
  data() {
    return {
      dialog: false,
      title: '生成对账明细',
      beginDataDate: null,
      endDataDate: null,
      projects: [],
      clients: [],
      stations: [],
      periods: [],
      permission: {
        add: ['admin', 'betonCheckingDetail:add'],
        edit: ['admin', 'betonCheckingDetail:edit'],
        del: ['admin', 'betonCheckingDetail:del']
      },
      rules: {
        beginDataDate: [
          { required: true, message: '数据日期开始不能为空', trigger: 'blur' }
        ],
        endDataDate: [
          { required: true, message: '数据日期截止不能为空', trigger: 'blur' }
        ],
        clientId: [
          { required: true, message: '搅拌站ID 关联 t_client_infor 的 loginAppId不能为空', trigger: 'blur' }
        ],
        betonClientId: [
          { required: true, message: '商砼客户ID 关联 t_beton_client不能为空', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '工程信息ID 关联 t_beton_project不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      this.getProjects()
      this.getClients()
      this.getStations()
      // form.enabled = form.enabled.toString()
    },
    // 获取弹窗内岗位数据
    getProjects() {
      getAllProjects().then(res => {
        this.projects = res.data.list
      }).catch(() => {
      })
    },
    getClients() {
      getAllClients().then(res => {
        this.clients = res.data.list
      }).catch(() => {

      })
    },
    getStations() {
      getAllStations().then(res => {
        this.stations = res.data.list
      }).catch(() => {

      })
    },

    // 七牛云配置
    doConfig() {
      // const _this = this.$refs.form
      // _this.init()
      // _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
