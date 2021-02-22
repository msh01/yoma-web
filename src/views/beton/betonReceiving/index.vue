<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="headSearch" v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-row>
          <el-col :span="6">
            <label class="el-form-item-label">搅拌站</label>
            <el-input v-model="query.companyName" clearable placeholder="搅拌站名称"
                      @keyup.enter.native="crud.toQuery"/>
          </el-col>
          <el-col :span="6">
            <label class="el-form-item-label">客户</label>
            <el-input v-model="query.betonClientName" clearable placeholder="客户名称"
                      @keyup.enter.native="crud.toQuery"/>
          </el-col>
          <el-col :span="6">
            <label class="el-form-item-label">项目工程</label>
            <el-input v-model="query.projectName" clearable placeholder="项目工程名称"
                      @keyup.enter.native="crud.toQuery"/>
          </el-col>
          <el-col :span="6">
            <label class="el-form-item-label">付款时间</label>
            <el-input v-model="query.payTime" clearable placeholder="付款时间"
                      @keyup.enter.native="crud.toQuery"/>
          </el-col>
          <el-col :span="6">
            <label class="el-form-item-label">收款单位</label>
            <el-input v-model="query.receivingUnit" clearable placeholder="收款单位名称"
                      @keyup.enter.native="crud.toQuery"/>
          </el-col>
          <el-col :span="6">
            <label class="el-form-item-label">付款单位</label>
            <el-input v-model="query.paymentUnit" clearable placeholder="付款单位名称"
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
        <el-table-column prop="companyName" label="搅拌站"/>
        <el-table-column label="项目工程" :min-width="200">
          <template slot-scope="scope">
            <el-row>
              <el-col v-show="scope.row.betonClientName" :span="24">
                {{scope.row.betonClientName}}
              </el-col>
              <el-col v-show="scope.row.projectName" :span="24">
                {{scope.row.projectName}}元
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="审核状态"/>
        <el-table-column prop="paymentType" label="收付款类型"/>
        <el-table-column prop="payType" label="付款方式"/>
        <el-table-column prop="tradeNo" label="银行流水号" :min-width="180">
          <template slot-scope="scope">
            <el-row>
              <el-col v-show="scope.row.tradeNo" :span="24">
                {{scope.row.tradeNo}}
              </el-col>
              <el-col v-show="scope.row.paymentAmount" :span="24">
                {{scope.row.paymentAmount}}元
              </el-col>
              <el-col v-show="scope.row.payTime" :span="24">
                {{scope.row.payTime}}
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="收款单位" :min-width="250">
          <template slot-scope="scope">
            <el-row>
              <el-col v-show="scope.row.receivingUnit" :span="24">
                名称:{{scope.row.receivingUnit}}
              </el-col>
              <el-col v-show="scope.row.receivingBank" :span="24">
                银行:{{scope.row.receivingBank}}
              </el-col>
              <el-col v-show="scope.row.receivingCard" :span="24">
                卡号:{{scope.row.receivingCard}}
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="付款单位" :min-width="250">
          <template slot-scope="scope">
            <el-row>
              <el-col v-show="scope.row.paymentUnit" :span="24">
                名称:{{scope.row.paymentUnit}}
              </el-col>
              <el-col v-show="scope.row.paymentBank" :span="24">
                银行:{{scope.row.paymentBank}}
              </el-col>
              <el-col v-show="scope.row.paymentCard" :span="24">
                卡号:{{scope.row.paymentCard}}
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="转账凭证">
          <template slot-scope="scope">
            <div class="demo-image__preview">
              <el-image
                style="width: 40px; height: 40px"
                :src="imgBaseUrl + scope.row.voucher.split(',')[0]"
                :preview-src-list="imgLoadUrl"
                @click="imgLoad(scope.row.voucher)">
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" :min-width="200"/>
        <el-table-column prop="updateTime" label="修改时间" :min-width="140"/>
        <el-table-column label="操作" fixed="right" align="left" :min-width="160">
          <template slot-scope="scope">
            <el-row>
              <el-col v-if="scope.row.state == 0 || scope.row.state == 2" :span="16">
                <udOperation v-permission="['admin','betonReceiving:edit','betonReceiving:del']"
                             :data="scope.row"
                             :permission="permission"/>
              </el-col>
              <el-col v-if="scope.row.state == 1" :span="16">
                <el-link :underline="false" type="info">已审核</el-link>
              </el-col>
              <el-col v-if="scope.row.state == 99" :span="16">
                <el-link :underline="false" type="info">已删除</el-link>
              </el-col>
              <el-col :span="8">
                <el-button
                  v-if="scope.row.state == 0 || scope.row.state == 2"
                  size="mini"
                  type="primary"
                  icon="el-icon-check"
                  title="审核"
                  @click="checkReceiving(scope.$index, scope.row)"></el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false"  :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
               :title="crud.status.title" width="1000px" >
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="搅拌站" prop="clientId">
          <el-select v-model.number="form.clientId" filterable placeholder="请选择">
            <el-option v-for="item in stations" :key="item.loginAppId" :label="item.companyName"
                       :value="item.loginAppId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商砼客户" filterable prop="betonClientId">
          <el-select v-model.number="form.betonClientId" placeholder="请选择">
            <el-option v-for="item in clients" :key="item.id" :label="item.clientName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属工程" filterable prop="projectId">
          <el-select v-model.number="form.projectId" placeholder="请选择">
            <el-option v-for="item in projects" :key="item.id" :label="item.projectName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="收付款类型" prop="paymentType">
          <el-select v-model.number="form.paymentType" placeholder="请选择">
            <el-option v-for="item in paymentTypes" :key="item.code" :label="item.text" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式" prop="payType">
          <el-select v-model.number="form.payType" placeholder="请选择">
            <el-option v-for="item in payTypes" :key="item.code" :label="item.text" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="银行流水号" prop="tradeNo">
          <el-input v-model="form.tradeNo" />
        </el-form-item>
        <el-form-item label="收款单位" prop="receivingUnit">
          <el-input v-model="form.receivingUnit" />
        </el-form-item>
        <el-form-item label="收款银行" prop="receivingBank">
          <el-input v-model="form.receivingBank" />
        </el-form-item>
        <el-form-item label="收款卡号" prop="receivingCard">
          <el-input v-model="form.receivingCard" />
        </el-form-item>
        <el-form-item label="付款单位" prop="paymentUnit">
          <el-input v-model="form.paymentUnit" />
        </el-form-item>
        <el-form-item label="付款银行" prop="paymentBank">
          <el-input v-model="form.paymentBank" />
        </el-form-item>
        <el-form-item label="付款卡号" prop="paymentCard">
          <el-input v-model="form.paymentCard" />
        </el-form-item>
        <el-form-item label="付款时间" prop="payTime">
          <el-date-picker v-model="form.payTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="付款金额" prop="paymentAmount">
          <el-input v-model="form.paymentAmount" @input="valDouble">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label=" ">
          <!-- 占位使用 -->
        </el-form-item>
        <el-form-item label="转账凭证" prop="voucher">
          <el-upload :limit="voucherUpload.maxSize"
                     class="upload-demo"
                     ref="upload"
                     list-type="picture-card"
                     :file-list="imgUpLoadUrl"
                     :on-success="uploadSuccess"
                     :on-error="uploadErr"
                     :action="fastdfsUploadApi"
                     :on-remove="removeImg"
                     :on-exceed="exceedImg"
                     :auto-upload="true">
            <el-link :underline="false" type="primary" class="upload-demo">点击上传凭证</el-link>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" style="width: 800px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>

    <!--审核 仅允许平台财务进行审核-->
    <el-dialog title="审核收付款信息" :visible.sync="checkReceivingDialog" width="1000px" >
      <el-form :inline="true" :model="checkForm" size="small" label-width="100px">
        <el-form-item label="搅拌站">
          <el-input :disabled="true" v-model="checkForm.companyName" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input :disabled="true" v-model="checkForm.betonClientName" />
        </el-form-item>
        <el-form-item label="所属工程">
          <el-input :disabled="true" v-model="checkForm.projectName" />
        </el-form-item>
        <el-form-item label="收付款类型">
          <el-select disabled v-model.number="checkForm.paymentType" placeholder="请选择">
            <el-option v-for="item in paymentTypes" :key="item.code" :label="item.text" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-select disabled v-model.number="checkForm.payType" placeholder="请选择">
            <el-option v-for="item in payTypes" :key="item.code" :label="item.text" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="银行流水号">
          <el-input :disabled="true" v-model="checkForm.tradeNo" />
        </el-form-item>
        <el-form-item label="收款单位">
          <el-input :disabled="true" v-model="checkForm.receivingUnit" />
        </el-form-item>
        <el-form-item label="收款银行">
          <el-input :disabled="true" v-model="checkForm.receivingBank" />
        </el-form-item>
        <el-form-item label="收款卡号">
          <el-input :disabled="true" v-model="checkForm.receivingCard" />
        </el-form-item>
        <el-form-item label="付款单位">
          <el-input :disabled="true" v-model="checkForm.paymentUnit" />
        </el-form-item>
        <el-form-item label="付款银行">
          <el-input :disabled="true" v-model="checkForm.paymentBank" />
        </el-form-item>
        <el-form-item label="付款卡号">
          <el-input :disabled="true" v-model="checkForm.paymentCard" />
        </el-form-item>
        <el-form-item label="付款时间">
          <el-date-picker :disabled="true" v-model="checkForm.payTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="付款金额">
          <el-input :disabled="true" v-model="checkForm.paymentAmount" @input="valDouble">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label=" ">
          <!-- 占位使用 -->
        </el-form-item>
        <el-form-item label="转账凭证">
          <div class="demo-image__preview flex">
            <div class="flex-v" v-for="img in imgLoadUrl">
              <el-image
                style="width: 148px; height: 148px; padding: 10px"
                :src="img"
                :preview-src-list="imgLoadUrl">
              </el-image>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :disabled="true" type="textarea" v-model="checkForm.remark" style="width: 800px;" />
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input type="textarea" v-model="checkForm.checkRemark" style="width: 800px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="text" @click="checkReceivingDialog = false">取消</el-button>-->
        <template>
          <el-popconfirm title="确定要驳回吗？" @confirm="submitCheckReceiving(2)" >
            <el-button type="danger" slot="reference">驳回审核</el-button>
          </el-popconfirm>
        </template>
        <template>
          <el-popconfirm title="确定信息正确吗？" @confirm="submitCheckReceiving(1)" >
            <el-button type="primary" slot="reference" >审核通过</el-button>
          </el-popconfirm>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import crudBetonReceiving from '@/api/beton/betonReceiving'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import { getAllProjects } from "@/api/betonProject"
  import crudBetonClient, { getAllClients, getAllStations } from "@/api/betonClient"
  import { inDouble } from "@/utils/validate"
  import {mapGetters} from "vuex";
  import {Notification} from "element-ui";

  const defaultForm = {
    id: null, // 主键
    clientId: null, // 搅拌站ID 关联 t_client_infor 的 loginAppId
    betonClientId: null, // 商砼客户ID 关联 t_beton_client
    projectId: null, // 工程信息ID 关联 t_beton_project
    paymentType: 1, // 收付款类型 1-回款（客户） 2-付款（搅拌站） 3-付款（车辆）
    state: 0, // 0-未审核 1-审核通过 2-审核驳回 99-删除
    payType: 1, // 付款方式 1-手动付款 2-系统自动付款
    tradeNo: null, // 银行流水号
    receivingUnit: null, // 收款单位名称
    receivingBank: null, // 收款银行(总行名称)
    receivingCard: null, // 收款卡号
    paymentUnit: null, // 付款单位名称
    paymentBank: null, // 付款银行(总行名称)
    paymentCard: null, // 付款卡号
    payTime: null, // 付款时间
    paymentAmount: null, // 付款金额
    voucher: null, // 转账凭证图片地址
    remark: null, // 备注
    checkRemark: null, // 审核备注
    createTime: null, // 创建时间
    createId: null, // 创建人ID 0表示自动生成
    updateTime: null, // 修改时间

    stations: [], // 搅拌站 下拉选
    projects: [], // 工程项目 下拉选
    clients: [], // 商砼客户 下拉选
  }
  export default {
    name: 'BetonReceiving', // 与菜单配置中路由地址相同
    // pagination 分页插件 // crudOperation 表格上边操作按钮插件 rrOperation 搜索及重置按钮插件 udOperation 数据行显示的操作按钮
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    created() {
      this.crud.optShow = {
        add: true,
        edit: true,
        del: true,
        download: false,
        reset: true
      }
    },
    cruds() {
      return CRUD({
        title: '收付款明细',
        url: '/order/betonReceiving/list',
        idField: 'id',
        sort: 'id,desc',
        crudMethod: {...crudBetonReceiving}
      })
    },
    data() {
      return {
        checkForm: {},
        checkInLine: 0,
        checkReceivingDialog: false,
        isUpload: false,
        imgLoadUrl:['@/assets/images/loading.gif'],
        imgUpLoadUrl: [],
        voucherUpload: {  // 转账凭证
          maxSize: 3,
          voucherUrl: []
        },
        stations: [], // 搅拌站 下拉选
        projects: [], // 工程项目 下拉选
        clients: [], // 商砼客户 下拉选
        paymentTypes: [
          {code: 1, text: '回款（客户）'},
          {code: 2, text: '付款（搅拌站）'},
          {code: 3, text: '付款（车辆）'}
        ],
        payTypes: [
          {code: 1, text: '手动付款'},
          {code: 2, text: '自动付款'},
        ],
        permission: {
          add: ['admin', 'betonReceiving:add'],
          edit: ['admin', 'betonReceiving:edit'],
          del: ['admin', 'betonReceiving:del']
        },
        rules: {
          clientId: [
            { required: true, message: '请选择搅拌站', trigger: 'blur' }
          ],
          betonClientId: [
            { required: true, message: '请选择客户', trigger: 'blur' }
          ],
          projectId: [
            { required: true, message: '请选择项目工程', trigger: 'blur' }
          ],
          paymentType: [
            { required: true, message: '请选择收付款类型', trigger: 'blur' }
          ],
          payType: [
            { required: true, message: '请选择付款方式', trigger: 'blur' }
          ],
          receivingUnit: [
            { required: true, message: '请填写收款单位名称', trigger: 'blur' }
          ],
          receivingBank: [
            { required: true, message: '请填写收款银行', trigger: 'blur' }
          ],
          paymentUnit: [
            { required: true, message: '请填写付款单位名称', trigger: 'blur' }
          ],
          paymentBank: [
            { required: true, message: '请填写付款银行', trigger: 'blur' }
          ],
          payTime: [
            { required: true, message: '请填写付款时间', trigger: 'blur' }
          ],
          paymentAmount: [
            { required: true, message: '请填写付款金额', trigger: 'blur' },
          ],
          voucher: [
            { required: true, message: '请上传转账凭证', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      // 新增面板打开 请求搅拌站列表
      "crud.status.cu": function (newVal) {
        let _self = this
        _self.imgUpLoadUrl = []
        if (newVal > 0) {
          if(_self.form.id){
            // id 有值表示是修改
            _self.form.voucher.split(',').forEach((item, index) => {
              // 固定参数 必须这样写
              _self.imgUpLoadUrl.push({
                  'name': index,
                  'url': _self.imgBaseUrl + item,
                  'response': {
                    'files': [
                      {
                        'url': item
                      }
                    ],
                    'success': true
                  }
                })
            })
          }
          _self.getStations()
        }
      },
      // 搅拌站变化 请求客户列表
      "form.clientId": function (newVal) {
        if(newVal){
          this.getClients(newVal)
        }
      },
      // 客户变化 请求项目列表
      "form.betonClientId": function (newVal) {
        if(newVal){
          this.getProjects(newVal)
        }
      },
      // 上传或删除图片时 更新表单内的凭证地址属性
      "voucherUpload.voucherUrl": function (newVal) {
        this.form.voucher = newVal.toString()
      }
    },
    computed: {
      ...mapGetters([
        'fastdfsUploadApi',
        'imgBaseUrl'
      ])
    },
    methods: {
      // 钩子：在获取表格数据之前执行，false 则代表不获取数据
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
      // 工程项目 下拉选
      getProjects(id) {
        getAllProjects(id).then(res => {
          this.projects = res.data.list
        }).catch(() => {
        })
      },
      // 客户 下拉选
      getClients(id) {
        getAllClients(id).then(res => {
          this.clients = res.data.list
        }).catch(() => {

        })
      },
      // 搅拌站 下拉选
      getStations() {
        getAllStations().then(res => {
          this.stations = res.data.list
        }).catch(() => {

        })
      },
      // 格式化金额
      valDouble(){
        this.form.paymentAmount = inDouble(this.form.paymentAmount)
      },
      // 上传文件 成功
      uploadSuccess(response, file, fileList) {
        this.voucherUpload.voucherUrl = []
        fileList.forEach(item => {
          this.voucherUpload.voucherUrl.push(item.response.files[0].url)
        });
      },
      // 上传文件失败
      uploadErr(err, file, fileList){
        Notification.error({
          title: '上传失败，请重新上传',
          duration: 5000
        })
      },
      // 删除文件
      removeImg(file, fileList){
        this.voucherUpload.voucherUrl = []
        fileList.forEach(item => {
          this.voucherUpload.voucherUrl.push(item.response.files[0].url)
        });
      },
      // 超出上传张数
      exceedImg(files, fileList){
        Notification.error({
          title: '仅允许上传'+this.voucherUpload.maxSize+'张凭证',
          duration: 5000
        })
      },
      // 查看图片时 加载大图
      imgLoad(uri){
        this.imgLoadUrl = []
        uri.split(',').forEach(item => {
          this.imgLoadUrl.push(this.imgBaseUrl + item)
        })
      },
      checkReceiving(index, row){
        this.checkReceivingDialog = true
        this.checkForm = row
        this.checkInLine = index
        this.imgLoadUrl = []
        row.voucher.split(',').forEach(item => {
          this.imgLoadUrl.push(this.imgBaseUrl + item)
        })
      },
      submitCheckReceiving(state){
        let data = {
          id: this.checkForm.id,
          state: state,
          checkRemark: this.checkForm.checkRemark
        }
        crudBetonReceiving.check(data).then(() => {
          if (this.$refs[this.checkInLine]) {
            this.$refs[this.checkInLine].doClose()
          }
          this.crud.notify(state == 1 ? '审核通过' : '审核驳回', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.crud.dleChangePage(1)
          this.crud.toQuery()
          this.checkReceivingDialog = false
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
