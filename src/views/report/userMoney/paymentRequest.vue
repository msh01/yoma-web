<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="headSearch" v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-row>
          <el-col v-if="userType == 1" :span="6">
            <label class="el-form-item-label">公司名称</label>
            <el-input v-model="query.companyName" clearable placeholder="公司名称"
                      @keyup.enter.native="crud.toQuery"/>
          </el-col>
          <el-col v-if="userType == 2" :span="6">
            <label class="el-form-item-label">车牌号</label>
            <el-input v-model="query.cardNo" clearable placeholder="如：豫A 12345，检索输入：12345"
                      @keyup.enter.native="crud.toQuery"/>
          </el-col>
          <el-col :span="6">
            <label class="el-form-item-label">联系人姓名</label>
            <el-input v-model="query.contact" clearable placeholder="联系人姓名"
                      @keyup.enter.native="crud.toQuery"/>
          </el-col>
          <el-col :span="6">
            <label class="el-form-item-label">业务员</label>
            <el-input v-model="query.salesmanName" clearable placeholder="业务员姓名"
                      @keyup.enter.native="crud.toQuery"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="20">
            <rrOperation :crud="crud"/>
          </el-col>
        </el-row>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" class="w100"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="processNo" label="申请编号"/>
        <el-table-column v-if="userType == 2" label="车牌号">
          <template slot-scope="scope">
            {{scope.row.cardOrigin + " " + scope.row.cardNo}}
          </template>
        </el-table-column>
        <el-table-column v-if="userType == 1" prop="companyName" label="公司名称"/>
        <el-table-column prop="contact" label="联系人"/>
        <el-table-column prop="contactTel" label="联系人电话"/>
        <el-table-column prop="applyMoney" label="申请金额"/>
        <el-table-column prop="linkName" label="当前环节"/>
        <el-table-column prop="linkDate" label="触发时间"/>
        <el-table-column prop="nextLinkName" label="下一环节"/>
        <el-table-column prop="remark" label="备注"/>
        <el-table-column prop="salesmanName" label="业务员姓名"/>
        <el-table-column label="操作" fixed="right" align="left" :min-width="80">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="8">
                <el-button
                  v-if="scope.row.approvalType == 0 || scope.row.approvalType == 1"
                  size="mini"
                  type="primary"
                  icon="el-icon-check"
                  title="审核"
                  @click="openAuthApply(scope.$index, scope.row)">审核</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
    <el-dialog title="付款申请审批" :visible.sync="checkPaymentRequestDialog" width="1000px" >
      <div class="flex">
        <div class="flex-v" style="width: 700px;">
          <el-form :inline="true" :model="checkForm" ref="checkForm" :rules="rules" size="small" label-width="100px">
            <el-form-item v-show="userType == 2" label="车牌号">
              <el-input :disabled="true" v-model="checkForm.cardOrigin + ' ' + checkForm.cardNo" />
            </el-form-item>
            <el-form-item v-show="userType == 1" label="公司名称">
              <el-input :disabled="true" v-model="checkForm.companyName" />
            </el-form-item>
            <el-form-item label="联系人">
              <el-input :disabled="true" v-model="checkForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input :disabled="true" v-model="checkForm.contactTel" />
            </el-form-item>
            <el-form-item label="申请金额">
              <el-input :disabled="true" v-model="checkForm.applyMoney" >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="上一环节">
              <el-input :disabled="true" v-model="checkForm.linkName" />
            </el-form-item>
            <el-form-item label="触发时间">
              <el-input :disabled="true" v-model="checkForm.linkDate" />
            </el-form-item>
            <el-form-item label="当前环节">
              <el-input :disabled="true" v-model="checkForm.nextLinkName" />
            </el-form-item>
            <el-form-item label="业务员">
              <el-input :disabled="true" v-model="checkForm.salesmanName"/>
            </el-form-item>
            <el-form-item v-if="checkForm.nextLinkCode == '020005'" label="实付金额" prop="payMoney">
              <el-input :disabled="false" v-model="checkForm.payMoney">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input :disabled="true" type="textarea" v-model="checkForm.remark" style="width: 500px;" />
            </el-form-item>
            <el-form-item label="审核备注" prop="notes">
              <el-input type="textarea" v-model="checkForm.notes" style="width: 500px;" />
            </el-form-item>
          </el-form>
        </div>
        <div class="block flex-v" style="width: 300px; height: 320px; top: 0px;">
          <el-timeline v-if="procunitPerform && procunitPerform.length > 0" :reverse="reverse">
            <el-timeline-item
              v-for="(item, index) in procunitPerform"
              :key="index"
              :color="item.color"
              :size="item.size"
              :timestamp="item.createTime">
              {{item.linkName}}<br/>
              <span class="font-7 color-777">{{item.notes}}</span>
            </el-timeline-item>
          </el-timeline>
          <span v-else-if="!procunitPerform || procunitPerform.length == 0">
            暂无流程信息
          </span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="text" @click="checkPaymentRequestDialog = false">取消</el-button>-->
        <template>
          <el-popconfirm title="确定要驳回吗？" @confirm="authRejected()" >
            <el-button type="danger" slot="reference" >驳回审核</el-button>
          </el-popconfirm>
        </template>
        <template>
          <el-popconfirm title="确定要通过审核吗？" @confirm="authPushNextLink()" >
            <el-button type="primary" slot="reference" >审核通过</el-button>
          </el-popconfirm>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import crudPaymentRequest from '@/api/report/paymentRequest'
  import CRUD, {presenter, header, crud, form} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm ={
    id:'',
    contact: '',
    contactTel: '',
    money: '',
    applyMoney: '',
    frozenMoney: '',
    salesmanName: ''
  }

  export default {
    name: 'paymentRequest', // 与菜单配置中路由地址相同
    // pagination 分页插件 // crudOperation 表格上边操作按钮插件 rrOperation 搜索及重置按钮插件 udOperation 数据行显示的操作按钮
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    created() {
      this.crud.optShow = {
        add: false,
        edit: false,
        del: false,
        reset: true
      }
    },
    cruds() {
      return CRUD({
        title: '账户资金列表',
        url: '/core/paymentRequest/list/',
        idField: 'id',
        sort: 'id,desc',
        crudMethod: {...crudPaymentRequest}
      })
    },
    data() {
      let rulesPayMoneyCheck = (rule, value, callback) => {
        if(value == '' || value <= 0){
          callback(new Error('实付金额为必输项，且必须大于0'));
        }else{
          callback();
        }
      };
      return {
        reverse: true, // 控制时间线 是正序或倒叙
        procunitPerform: null, // 流程环节明细
        checkForm: {}, // 审核时回显信息
        checkInLine: 0,
        checkPaymentRequestDialog: false, // 控制审核 dialog 框显示隐藏
        userType: 0, // 路由传值使用
        permission: {
          add: ['admin', 'paymentRequest:add'],
          edit: ['admin', 'paymentRequest:edit'],
          del: ['admin', 'paymentRequest:del']
        },
        rules: {
          payMoney: [{ required: true, validator: rulesPayMoneyCheck, trigger: 'blur' }],
        }
      }
    },
    watch: {
      // 监听 审批面板打开 获取审批流程明细
      "checkPaymentRequestDialog": function (val){
        if(val){
          crudPaymentRequest.getProcunitPerform(this.checkForm.processNo).then((data) => {
            if(data.data.list && data.data.list.length > 0){
              this.$set(data.data.list[0], 'color', "#0bbd87")
              this.$set(data.data.list[0], 'size', "large")
              this.procunitPerform = data.data.list
            }
          }).catch(() => {

          })
        }
      }
    },
    methods: {
      // 钩子：在获取表格数据之前执行，false 则代表不获取数据
      [CRUD.HOOK.beforeRefresh]() {
        let path = this.$route.path
        if(path.endsWith("/beton")){
          this.userType = '1'
        }
        if(path.endsWith("/car")){
          this.userType = '2'
        }
        if(path.endsWith("/applyMySelf")){
          this.userType = '3'
        }
        this._self.$crud.default.url = '/core/paymentRequest/list/'+this.userType
        return true
      },
      // 打开审核面板
      openAuthApply(index, row){
        this.checkPaymentRequestDialog = true
        this.checkForm = row
        this.checkInLine = index
      },
      // 推送到下个环节
      authPushNextLink(){
        this.$refs['checkForm'].validate((valid) => {
          if(valid){
            crudPaymentRequest.pushNextLink(this.checkForm.id, this.checkForm.notes, this.checkForm.payMoney).then(() => {
              if (this.$refs[this.checkInLine]) {
                this.$refs[this.checkInLine].doClose()
              }
              this.crud.notify('申请已通过', CRUD.NOTIFICATION_TYPE.SUCCESS)
              this.crud.dleChangePage(1)
              this.crud.toQuery()
              this.checkPaymentRequestDialog = false
            }).catch(() => {
              if (this.$refs[this.checkInLine]) {
                this.$refs[this.checkInLine].doClose()
              }
            })
          }
        })
      },
      // 驳回审核
      authRejected(){
        if(!!!this.checkForm.notes){
          this.crud.notify('驳回时必须输入审核备注', CRUD.NOTIFICATION_TYPE.ERROR)
          return
        }
        crudPaymentRequest.rejected(this.checkForm.id, this.checkForm.notes).then(() => {
          if (this.$refs[this.checkInLine]) {
            this.$refs[this.checkInLine].doClose()
          }
          this.crud.notify('申请已驳回', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.crud.dleChangePage(1)
          this.crud.toQuery()
          this.checkPaymentRequestDialog = false
        }).catch(() => {
          if (this.$refs[this.checkInLine]) {
            this.$refs[this.checkInLine].doClose()
          }
        })
      }
    }
  }
  </script>

<style scoped>

</style>
