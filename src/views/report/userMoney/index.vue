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
        <el-table-column v-if="userType == 2" label="车牌号">
          <template slot-scope="scope">
            {{scope.row.cardOrigin + " " + scope.row.cardNo}}
          </template>
        </el-table-column>
        <el-table-column v-if="userType == 1" prop="companyName" label="公司名称"/>
        <el-table-column prop="contact" label="联系人姓名"/>
        <el-table-column prop="contactTel" label="联系人电话"/>
        <el-table-column prop="money" label="账户剩余额度"/>
        <el-table-column prop="applyMoney" label="提现中额度"/>
        <el-table-column prop="frozenMoney" label="冻结额度"/>
        <el-table-column prop="salesmanName" label="业务员姓名"/>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
  import crudUserMoney from '@/api/report/userMoney'
  import CRUD, {presenter, header, crud, form} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  /*const defaultForm ={
    id:'',
    contact: '',
    contactTel: '',
    money: '',
    applyMoney: '',
    frozenMoney: '',
    salesmanName: ''
  }*/

  export default {
    name: 'userMoney', // 与菜单配置中路由地址相同
    // pagination 分页插件 // crudOperation 表格上边操作按钮插件 rrOperation 搜索及重置按钮插件 udOperation 数据行显示的操作按钮
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), crud()], //form(defaultForm),
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
        url: '/core/userMoney/list/',
        idField: 'id',
        sort: 'id,desc',
        crudMethod: {...crudUserMoney}
      })
    },
    data() {
      return {
        userType: 0, // 路由传值使用
        permission: {
          add: ['admin', 'userMoney:add'],
          edit: ['admin', 'userMoney:edit'],
          del: ['admin', 'userMoney:del']
        }
      }
    },
    watch: {

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
        this._self.$crud.default.url = '/core/userMoney/list/'+this.userType
        return true
      }
    }
  }
  </script>

<style scoped>

</style>
