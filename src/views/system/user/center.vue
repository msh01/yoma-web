<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img :src="user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar" title="点击上传头像" class="avatar" @click="toggleShow">
                <myUpload
                  v-model="show"
                  :headers="headers"
                  :url="updateAvatarApi"
                  @crop-upload-success="cropUploadSuccess"
                />
              </div>
            </div>
            <ul class="user-info">
              <li><div style="height: 100%"><svg-icon icon-class="login" /> 登录账号<div class="user-right">{{ user.username }}</div></div></li>
              <li><svg-icon icon-class="user1" /> 姓名 <div class="user-right">{{ user.nickName }}</div></li>
              <li><svg-icon icon-class="dept" /> 所属部门 <div class="user-right"> {{ user.dept ? user.dept.name : '' }}</div></li>
              <li><svg-icon icon-class="phone" /> 手机号码 <div class="user-right">{{ user.phone }}</div></li>
              <li><svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">{{ user.email }}</div></li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                  <a @click="$refs.email.dialog = true">修改邮箱</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="moneyShow" :xs="24" :sm="24" :md="16" :lg="18" :xl="19" class="pad-2">
        <!-- 账户资金 -->
        <el-card class="box-card">
          <template>
            <!-- :pg="pg" 给子组件 传递值 :pg 为自定义 参数名 在子页面使用该值接收 -->
            <!--<panel-group :pg="pgData" @handleSetLineChartData="handleSetLineChartData" />-->
            <panel-group @handleSetLineChartData="handleSetLineChartData" />
          </template>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!--    用户资料    -->
            <el-tab-pane label="用户资料" name="first">
              <el-form ref="form" :model="form" :rules="rules" style="margin-top: 10px;" size="small" label-width="65px">
                <el-form-item label="姓名" prop="nickName">
                  <el-input v-model="form.nickName" style="width: 35%" />
                  <span style="color: #C0C0C0;margin-left: 10px;">姓名不作为登录使用</span>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" style="width: 35%;" />
                  <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="form.gender" style="width: 178px">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                  <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!--    操作日志    -->
            <el-tab-pane label="操作日志" name="second">
              <el-table v-loading="loading" :data="data" style="width: 100%;">
                <el-table-column prop="description" label="行为" />
                <el-table-column prop="requestIp" label="IP" />
                <el-table-column :show-overflow-tooltip="true" prop="address" label="IP来源" />
                <el-table-column prop="browser" label="浏览器" />
                <el-table-column prop="time" label="请求耗时" align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="right" >
                  <template slot="header">
                    <div style="display:inline-block;float: right;cursor: pointer" @click="init">创建日期<i class="el-icon-refresh" style="margin-left: 40px" /></div>
                  </template>
                  <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页组件-->
              <el-pagination
                :total="total"
                :current-page="page + 1"
                style="margin-top: 8px;"
                layout="total, prev, pager, next, sizes"
                @size-change="sizeChange"
                @current-change="pageChange"
              />
            </el-tab-pane>
            <!-- 已申请金额列表 -->
            <!--<el-tab-pane v-if="moneyShow" label="已申请付款列表" name="applyMoney">
              <el-table v-loading="loading" :data="data" class="w100">
                <el-table-column prop="processNo" label="申请编号"/>
                <el-table-column prop="applyMoney" label="申请金额"/>
                <el-table-column prop="linkName" label="当前环节"/>
                <el-table-column prop="linkDate" label="触发时间"/>
                <el-table-column prop="nextLinkName" label="下一环节"/>
                <el-table-column prop="remark" label="备注"/>
              </el-table>
              <pagination/>
            </el-tab-pane>-->
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <updateEmail ref="email" :email="user.email" />
    <updatePass ref="pass" />
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import { mapGetters } from 'vuex'
import updatePass from './center/updatePass'
import updateEmail from './center/updateEmail'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { isvalidPhone } from '@/utils/validate'
import { parseTime } from '@/utils/index'
import crud from '@/mixins/crud'
import { editUser } from '@/api/system/user'
import Avatar from '@/assets/images/avatar.png'
import PanelGroup from '@/views/dashboard/CenterPanelGroup'

export default {
  name: 'Center',
  components: { updatePass, updateEmail, myUpload, PanelGroup},
  mixins: [crud],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      moneyShow: true,
      show: false,
      Avatar: Avatar,
      activeName: 'first',
      saveLoading: false,
      headers: {
        'Authorization': getToken()
      },
      form: {},
      rules: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'updateAvatarApi',
      'baseApi'
    ])
  },
  created() {
    this.form = { id: this.user.id, nickName: this.user.nickName, gender: this.user.gender, phone: this.user.phone }
    store.dispatch('GetInfo').then(() => {})
  },
  methods: {
    parseTime,
    toggleShow() {
      this.show = !this.show
    },
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.init()
      }
    },
    beforeInit() {
      this.url = 'api/logs/user'
      return true
    },
    cropUploadSuccess(jsonData, field) {
      store.dispatch('GetInfo').then(() => {})
    },
    doSubmit() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            editUser(this.form).then(() => {
              this.editSuccessNotify()
              store.dispatch('GetInfo').then(() => {})
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    },
    handleSetLineChartData(type) {
      if(type == 'apply'){
        console.log("已申请付款列表")
      }else if(type == 'freeze'){
        console.log("查看冻结金额列表")
      }else{
        console.log("参数与错误")
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .user-info {
    padding-left: 0;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 11px 0;
      font-size: 13px;
    }
    .user-right {
      float: right;
      a{
        color: #317EF3;
      }
    }
  }
</style>
