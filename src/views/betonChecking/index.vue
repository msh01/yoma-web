<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="数据日期" prop="beginDataDate">
            <el-date-picker v-model="form.beginDataDate" type="date" style="width: 170px;" placeholder="开始"
                            value-format="yyyy-MM-dd"/>
            <el-date-picker v-model="form.endDataDate" type="date" style="width: 170px;" placeholder="截止"
                            value-format="yyyy-MM-dd"/>
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
          <el-button type="text" @click="this.getDetails">查询砼标号</el-button>
          <el-table v-loading="false" :data="form.checkingDetails" size="small"
                    style="width: 100%;margin-bottom: 15px">
            <el-table-column prop="conStrength" label="砼标号"/>
            <el-table-column prop="columnType" label="含税单价">
              <template slot-scope="scope">
                <el-input v-model="form.checkingDetails[scope.$index].unitPrice1" size="mini" class="edit-input"/>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="不含税单价">
              <template slot-scope="scope">
                <el-input v-model="form.checkingDetails[scope.$index].unitSellingPrice1" size="mini"
                          class="edit-input"/>
              </template>
            </el-table-column>
          </el-table>

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
        <el-table-column prop="checkingNo" label="对账单编号"/>
        <!--  <el-table-column prop="type1" label="类型"/>
          <el-table-column prop="cumNum" label="累积对账次数"/>
          <el-table-column prop="clientId" label="搅拌站ID"/>
          <el-table-column prop="betonClientId" label="商砼客户ID"/>-->
        <!-- <el-table-column prop="projectId" label="工程信息ID"/>-->
        <el-table-column prop="projectName" label="工程" width="200"/>
        <el-table-column prop="beginDate" label="数据开始日期" width="200">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.beginDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endDate" label="数据截止日期" width="200">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endDate) }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="realityTon" label="总净重"/>
        <el-table-column prop="cubicNum" label="总方量"/>
        <el-table-column prop="mortarTon" label="砂浆净重"/>-->
        <!--<el-table-column prop="mortarCubicNum" label="砂浆方量"/>
        <el-table-column prop="compMoney" label="小方补助金额"/>
        <el-table-column prop="unitPriceSum" label="含税金额"/>
        <el-table-column prop="unitSellingPriceSum" label="不含税金额"/>-->
        <!--<el-table-column prop="detailNum" label="对账明细数"/>-->
        <el-table-column prop="mptyNum" label="补充数据条数"/>
        <el-table-column prop="financeType" label="核对状态"/>
        <el-table-column prop="financeTime" label="搅拌站核对时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.financeTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="financeId" label="搅拌站审核人"/>
        <el-table-column prop="paasType" label="平台核对状态"/>
        <el-table-column prop="paasTime" label="平台核对时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.paasTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paasId" label="平台审核人"/>
        <el-table-column prop="enableType" label="是否生效"/>
        <el-table-column prop="enableTime" label="生效时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.enableTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','betonChecking:edit','betonChecking:del']" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
            <el-button type="primary" size="mini"
                       @click="downloadChecking(scope.row.id, scope.$index)">导出
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
import crudBetonChecking from '@/api/betonChecking'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllProjects, getCheckingDetails } from "@/api/betonProject"
import crudBetonClient, { getAllClients, getAllStations } from "@/api/betonClient"
import { downloadFile, downloadFileByRemoteURL } from "@/utils"
import { download } from "@/api/data"

const defaultForm = {
  distinctConStrength: 1,
  id: null,
  ifAgain: 0,
  data: [],
  checkingDetails: [],
  checkingNo: null,
  type1: null,
  cumNum: null,
  clientId: null,
  // loading:
  betonClientId: null,
  projectId: null,
  beginDate: null,
  endDate: null,
  realityTon: null,
  paasId: null,
  enableType: null,
  enableTime: null,
  createTime: null,
  createId: null,
  updateTime: null
}
export default {
  name: 'BetonChecking',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '对账单',
      url: '/order/betonChecking/list',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudBetonChecking }
    })
  },
  data() {
    return {
      data: [{ unitSellingPrice1: 1, unitPrice1: 1, conStrength: "aaaaa" }, {
        unitSellingPrice1: 2,
        unitPrice1: 2,
        conStrength: "bbbbbb"
      }],
      checkingDetails: [],
      fileList: [], files: [],
      beginDataDate: null,
      endDataDate: null,
      projects: [],
      clients: [],
      stations: [],
      periods: [],
      permission: {
        add: ['admin', 'betonChecking:add'],
        edit: ['admin', 'betonChecking:edit'],
        del: ['admin', 'betonChecking:del']
      },
      rules: {
        checkingNo: [
          { required: true, message: '对账单编号(导出时在字符串前增加显示-搅拌站对账编号以B开头,客户对账编号以C开头)不能为空', trigger: 'blur' }
        ],
        type1: [
          { required: true, message: '类型 0-搅拌站 1-客户不能为空', trigger: 'blur' }
        ],
        clientId: [
          { required: true, message: '搅拌站ID 关联 t_client_infor 的 loginAppId不能为空', trigger: 'blur' }
        ],
        betonClientId: [
          { required: true, message: '商砼客户ID 关联 t_beton_client不能为空', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '工程信息ID 关联 t_beton_project不能为空', trigger: 'blur' }
        ],
        beginDate: [
          { required: true, message: '数据开始日期不能为空', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '数据截止日期不能为空', trigger: 'blur' }
        ],
        enableType: [
          { required: true, message: '是否生效 0-未生效 1-待生效 2-已生效 99-删除不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    downloadChecking(key, index) {
      // debugger
      // let baseUrl = "http://img.dev.x-code.top/"
      // let obj = baseUrl + "group1/M00/00/00/rBBkGF_R_eiAem_yAAUNdfJmZVs86.xlsx"
      const ids = []
      if (key instanceof Array) {
        key.forEach(val => {
          ids.push(val.key)
        })
      } else {
        ids.push(key)
      }
      let data = { checkingId: ids[0] }
      // this.downloadLoading = true
      download("/order/betonChecking" + '/download', data).then(result => {
        downloadFile(result, "对账单", 'xlsx')
        // this.downloadLoading = false
      }).catch(() => {
        // this.downloadLoading = false
      })
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },// 新增与编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      if (form.id) {
        form.ifAgain = 1
      } else {
        form.ifAgain = 0
      }
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
    getDetails() {
      getCheckingDetails(this.form).then(res => {
        this.form.checkingDetails = res.data.list
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
    }
  }
}
</script>

<style scoped>

</style>
