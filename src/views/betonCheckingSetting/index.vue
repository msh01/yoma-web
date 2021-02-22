<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">

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

          ·
          <el-form-item label="所属工程" prop="projectId">
            <el-select v-model.number="form.projectId" placeholder="请选择">
              <el-option v-for="item in projects" :key="item.id" :label="item.projectName" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-upload
            :before-remove="handleBeforeRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList"
            :action="fastdfsUploadApi"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传对账单导出模板</el-button>
            <div slot="tip" style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过25M</div>
          </el-upload>

          <el-form-item label="生成方式" prop="createType">
            <el-radio v-for="item in createTypes" :key="item.code" v-model.number="form.createType"
                      :label="item.code">
              {{ item.text }}
            </el-radio>
          </el-form-item>

          <el-form-item label="生成周期" prop="createPeriod" v-show="form.createType==1">
            <el-radio v-for="item in periods" v-model.number="form.createPeriod"
                      :key="item.code"
                      :label="item.code">
              {{ item.text }}
            </el-radio>
          </el-form-item>


          <el-form-item label="小方补助" prop="compType">
            <el-radio v-for="item in compTypes" v-model="form.compType"
                      :label="item.code">
              {{ item.text }}
            </el-radio>
          </el-form-item>


          <el-form-item label="最小方量" v-show="form.compType==1">
            <el-input v-model="form.minCubicNum" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="每方补助金额" v-show="form.compType==1">
            <el-input v-model="form.minCubicNumPrice" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="容重标准" prop="rateType">
            <el-radio v-for="item in rateTypes" v-model="form.rateType" :label="item.code">
              {{ item.text }}
            </el-radio>
          </el-form-item>
          <el-form-item label="混凝土容重" v-show="form.rateType==0">
            <el-input v-model="form.rateHnt" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="砂浆容重" v-show="form.rateType==0">
            <el-input v-model="form.rateSj" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="加价状态" prop="priceMakupType">
            <el-radio v-for="item in priceMakupTypes" :key="item.code" v-model="form.priceMakupType" :label="item.code">
              {{ item.text }}
            </el-radio>
          </el-form-item>
          <!--  <el-form-item label="对账单模板URL">
              <el-input v-model="form.templateUrl" style="width: 370px;"/>
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
        <el-table-column prop="projectName" label="工程信息" width="200"/>
        <el-table-column prop="clientName" label="客户名称" width="200"/>
        <el-table-column prop="createPeriod" label="对账单生成周期"/>
        <el-table-column prop="compType" label="小方补助状态"/>
        <el-table-column prop="minCubicNum" label="最小方量"/>
        <el-table-column prop="minCubicNumPrice" label="每方补助金额"/>
        <el-table-column prop="rateTypeText" label="容重标准"/>
        <el-table-column prop="rateHnt" label="混凝土容重"/>
        <el-table-column prop="rateSj" label="砂浆容重"/>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','betonCheckingSetting:edit','betonCheckingSetting:del']" label="操作"
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
import crudBetonCheckingSetting from '@/api/betonCheckingSetting'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllProjects } from "@/api/betonProject"
import { getAllClients, getAllStations } from "@/api/betonClient"
import { mapGetters } from "vuex"
import crudQiNiu from "@/api/tools/qiniu"

const defaultForm = {
  id: null,
  clientId: null,
  fileId: null,
  betonClientId: null,
  projectId: null,
  type1: 1,
  createType: 1,
  createPeriod: null,
  compType: null,
  minCubicNum: null,
  minCubicNumPrice: null,
  rateType: null,
  rateHnt: null,
  rateSj: null,
  stations: [],
  test: 1,
  priceMakupType: null,
  projects: [],
  clients: [],
  // periodsShow: false,
  templateUrl: null,
  createTime: null,
  createTypes: [],
  createId: null,
  updateTime: null
}
export default {
  name: 'BetonCheckingSetting',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '对账周期设置',
      url: '/order/betonCheckingSetting/list',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudBetonCheckingSetting }
    })
  },
  data() {
    return {
      projects: [],
      clients: [],
      stations: [],
      periods: [],
      files: [],
      fileList: [],
      test: 1,
      clientInfos: [],
      createType: 0,
      createTypes: [],
      rateTypes: [],
      priceMakupTypes: [],
      compTypes: [],
      // periodsShow: false,
      permission: {
        add: ['admin', 'betonCheckingSetting:add'],
        edit: ['admin', 'betonCheckingSetting:edit'],
        del: ['admin', 'betonCheckingSetting:del']
      },
      rules: {
        clientId: [
          { required: true, message: '搅拌站ID 关联 t_client_infor 的 loginAppId不能为空', trigger: 'blur' }
        ],
        betonClientId: [
          { required: true, message: '商砼客户ID 关联 t_beton_client不能为空', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '工程信息ID 关联 t_beton_project不能为空', trigger: 'blur' }
        ],
        type1: [
          { required: true, message: '类型 0-搅拌站 1-客户不能为空', trigger: 'blur' }
        ],
        createType: [
          { required: true, message: '账单生成方式 0-手动 1-自动不能为空', trigger: 'blur' }
        ],
        compType: [
          { required: true, message: '小方补助状态 0-无补助 1-有补助, type=1 时 有效不能为空', trigger: 'blur' }
        ],
        rateType: [
          { required: true, message: '容重标准 0-固定值 1-实际值不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        createId: [
          { required: true, message: '创建人ID 0表示自动生成不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '修改时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    periodsShow() {
      let b = this.createType == 1
      return b
    },
    ...mapGetters([
      'fastdfsUploadApi'
    ])
  },
  methods: {
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      // const id = response.id
      const id = response.files[0].url
      this.files.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].uid === file.uid) {
          crudQiNiu.del([this.files[i].id]).then(res => {
          })
          return true
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.crud.notify(msg.message, CRUD.NOTIFICATION_TYPE.ERROR)
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      this.form.templateUrl = this.files[0].id
      this.files = []
      this.fileList = []
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      this.getProjects()
      this.getClients()
      this.getStations()
      this.createTypes = [{ code: 0, text: "手动" }, { code: 1, text: "自动" }]
      this.periods = [{ code: 1, text: "年" }, { code: 2, text: "月" }, { code: 3, text: "日" }]
      this.rateTypes = [{ code: 0, text: "固定值" }, { code: 1, text: "实际值" }]
      this.priceMakupTypes = [{ code: 0, text: "加价" }, { code: 1, text: "不加价" }]
      this.compTypes = [{ code: 0, text: "无补助" }, { code: 1, text: "有补助" }]
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
    }
  }
}
</script>

<style scoped>

</style>
