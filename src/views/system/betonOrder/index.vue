<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission"/>
      <crudOperation :permission="permission">
        <template slot="left">
          <!--<el-button
           class="filter-item"
           size="mini"
           type="primary"
           icon="el-icon-plus"
           @click="add">新增</el-button>-->
          <!-- 上传 -->
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="dialog = true">
            导入excel
          </el-button>
          <!--<el-button :icon="icon" class="filter-item" size="mini" type="warning" @click="synchronize">同步</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-s-tools"
            @click="doConfig"
          >配置
          </el-button>-->
        </template>
      </crudOperation>
      <!-- 文件上传 -->
      <el-dialog :visible.sync="dialog" :close-on-click-modal="false" append-to-body width="500px">
        <el-upload
          :before-remove="handleBeforeRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :headers="headers"
          :action="fastdfsUploadApi"
          class="upload-demo"
          multiple
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过15M</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="doSubmit">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55"/>

      <el-table-column prop="orderNo" label="订单号" width="200px"/>
      <el-table-column prop="betonClientName" label="企业名称" width="200px"/>
      <el-table-column prop="orderNoERP" label="ERP编号" width="200px"/>
      <el-table-column prop="manufactureTime" label="生产时间" width="200px"/>
      <el-table-column prop="carNo2" label="车牌号"/>
      <el-table-column prop="carNo1" label="车号"/>
      <el-table-column prop="projectName" label="工程名称"/>
      <el-table-column prop="permeate" label="渗透等级"/>
      <el-table-column prop="carNum" label="车次"/>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!--   编辑与删除   -->
      <el-table-column
        v-permission="['admin','job:edit','job:del']"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
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
    <!--表单渲染-->
    <eForm :job-status="dict.job_status"/>
  </div>
</template>

<script>
import crudJob from '@/api/system/BetonOrder'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'

import crudQiNiu from '@/api/tools/qiniu'
import { getToken } from "@/utils/auth"
import { mapGetters } from "vuex"
import rrOperation from "@crud/RR.operation"
import DateRangePicker from "@/components/DateRangePicker/index"

export default {
  name: 'betonOrder',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '销售单',
      url: '/order/betonOrder/list',
      sort: ['jobSort,asc', 'id,desc'],
      crudMethod: { ...crudJob }
    })
  },
  // 新增与编辑前做的操作
  [CRUD.HOOK.afterToCU](crud, form) {
    this.jobs = []
  },
  created() {
    this.crud.optShow = {
      add: true,
      edit: true,
      del: true,
      download: true
    }
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['job_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'betonOrder:add'],
        edit: ['admin', 'betonOrder:edit'],
        del: ['admin', 'betonOrder:del']
      },
      title: '文件', dialog: false,
      icon: 'el-icon-refresh',
      url: '', headers: { 'Authorization': getToken() },
      dialogImageUrl: '', dialogVisible: false, fileList: [], files: [], newWin: null
    }
  },
  computed: {
    ...mapGetters([
      'fastdfsUploadApi'
    ])
  },
  watch: {
    url(newVal, oldVal) {
      if (newVal && this.newWin) {
        this.newWin.sessionStorage.clear()
        this.newWin.location.href = newVal
        // 重定向后把url和newWin重置
        this.url = ''
        this.newWin = null
      }
    }
  },
  methods: {
    // 七牛云配置
    doConfig() {
      const _this = this.$refs.form
      _this.init()
      _this.dialog = true
    },
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
    // 刷新列表数据
    doSubmit() {
      this.fileList = []
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialog = false
      let postData = { fileId: this.files[0].id }
      crudQiNiu.excelImport(postData).then(res => {
        this.files = []
        this.icon = 'el-icon-refresh'
        this.$message({
          showClose: true,
          message: '文件导入成功',
          type: 'success',
          duration: 1500
        })
        this.crud.toQuery()
      }).catch(err => {
        this.icon = 'el-icon-refresh'
        console.log(err.response.data.message)
      })
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.crud.notify(msg.message, CRUD.NOTIFICATION_TYPE.ERROR)
    },
    // 下载文件
    download(id) {
      this.downloadLoading = true
      // 先打开一个空的新窗口，再请求
      this.newWin = window.open()
      crudQiNiu.download(id).then(res => {
        this.downloadLoading = false
        this.url = res.url
      }).catch(err => {
        this.downloadLoading = false
        console.log(err.response.data.message)
      })
    },
    // 同步数据
    synchronize() {
      this.icon = 'el-icon-loading'
      crudQiNiu.sync().then(res => {
        this.icon = 'el-icon-refresh'
        this.$message({
          showClose: true,
          message: '数据同步成功',
          type: 'success',
          duration: 1500
        })
        this.crud.toQuery()
      }).catch(err => {
        this.icon = 'el-icon-refresh'
        console.log(err.response.data.message)
      })
    },

    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.job_status[val] + '" ' + data.name + '岗位, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudJob.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.job_status[val] + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
