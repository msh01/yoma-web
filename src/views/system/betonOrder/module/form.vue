<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="980px"
  >
    <el-form ref="form" :model="form" :rules="rules" :inline="true" size="small" label-width="100px">
      <el-form-item label="所属工程" prop="projectId">
        <el-select v-model.number="form.projectId" placeholder="请选择">
          <el-option v-for="item in projects" :key="item.id" :label="item.projectName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input v-model.number="form.orderNo"/>
      </el-form-item>
      <el-form-item label="砼强度" prop="conStrength">
        <el-input v-model="form.conStrength"/>
      </el-form-item>
      <el-form-item label="生产日期" prop="manufactureTime" >
        <el-date-picker v-model="form.manufactureTime" style="width: 100px"/>
      </el-form-item>
      <el-form-item label="砼落度" prop="slump">
        <el-input v-model="form.slump"/>
      </el-form-item>
      <el-form-item label="车号" prop="carNo1">
        <el-input v-model.number="form.carNo1"/>
      </el-form-item>
      <el-form-item label="车牌号" prop="carNo2">
        <el-input v-model.number="form.carNo2"/>
      </el-form-item>
      <el-form-item label="车次" prop="carNum">
        <el-input v-model.number="form.carNum"/>
      </el-form-item>
      <el-form-item label="毛重(搅拌站)" prop="grossTon1">
        <el-input v-model.number="form.grossTon1"/>
      </el-form-item>
      <el-form-item label="皮重(搅拌站)" prop="realityTon1">
        <el-input v-model.number="form.realityTon1"/>
      </el-form-item>
      <el-form-item label="净重(搅拌站)" prop="realityTon1">
        <el-input v-model="form.realityTon1"/>
      </el-form-item>
      <el-form-item label="毛重(施工方)" prop="grossTon2">
        <el-input v-model="form.grossTon2"/>
      </el-form-item>
      <el-form-item label="皮重(施工方)" prop="tareTon2">
        <el-input v-model="form.tareTon2"/>
      </el-form-item>
      <el-form-item label="净重(施工方)" prop="realityTon2">
        <el-input v-model="form.realityTon2"/>
      </el-form-item>

      <el-form-item label="方量(搅拌站)" prop="cubicNum2">
        <el-input v-model="form.cubicNum2"/>
      </el-form-item>
      <el-form-item label="方量(施工方)" prop="cubicNum2">
        <el-input v-model="form.cubicNum2"/>
      </el-form-item>
      <el-form-item label="浇筑方式" prop="castType">
        <el-input v-model.number="form.castType"/>
      </el-form-item>

      <el-form-item label="坍落度" prop="slump">
        <el-input v-model="form.slump"/>
      </el-form-item>
      <el-form-item label="渗透等级" prop="permeate">
        <el-input v-model="form.permeate"/>
      </el-form-item>
      <el-form-item label="施工部位" prop="parts">
        <el-input v-model.number="form.parts"/>
      </el-form-item>

      <el-form-item v-if="form.pid !== 0" label="是否超时" prop="enabled">
        <el-radio v-for="item in jobStatus" :key="item.id" v-model="form.enabled" :label="item.value === 'true'">
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item label="离场时间" prop="phone">
        <el-date-picker v-model.number="form.phone"/>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CRUD, { form } from '@crud/crud'
import { getAllJob } from "@/api/system/job"
import { getAllProjects } from "@/api/betonProject"

const defaultForm = {
  id: null,
  name: '',
  jobSort: 999,
  jobs: [],
  jobDatas: [],
  enable: true
}
// const defaultForm = {
//   id: null, username: null, nickName: null, gender: '男', email: null,
//   enabled: 'false', roles: [], jobs: [], dept: { id: null }, phone: null
// }
export default {
  mixins: [form(defaultForm)],
  props: {
    jobStatus: {
      type: Array,
      required: true
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      this.getProjects()
      // form.enabled = form.enabled.toString()
    },
    // 获取弹窗内岗位数据
    getProjects() {
      getAllProjects().then(res => {
        // this.jobs = res.data.list
        this.projects = res.data.list
      }).catch(() => {
      })
    }
  },
  data() {
    return {
      jobs: [], jobDatas: [], projectId: 0, projects: [],
      rules: {
        // name: [
        //   { required: true, message: '请输入名称', trigger: 'blur' }
        // ],
        // jobSort: [
        //   { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        // ]
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
