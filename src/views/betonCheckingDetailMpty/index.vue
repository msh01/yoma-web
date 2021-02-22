<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据日期" prop="dataDate">
            <el-input v-model="form.dataDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据类型 1-扣方 2-调差价 3-纠错" prop="dataType">
            <el-input v-model="form.dataType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="砼标号" prop="conStrength">
            <el-input v-model="form.conStrength" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="小票方量">
            <el-input v-model="form.cubicNum1" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="结算方量" prop="cubicNum">
            <el-input v-model="form.cubicNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="含税单价" prop="unitPrice">
            <el-input v-model="form.unitPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="不含税单价" prop="unitSellingPrice">
            <el-input v-model="form.unitSellingPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="含税金额" prop="unitPriceSum">
            <el-input v-model="form.unitPriceSum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="不含税金额" prop="unitSellingPriceSum">
            <el-input v-model="form.unitSellingPriceSum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="信息价(含税)">
            <el-input v-model="form.officialPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="信息价(不含税)">
            <el-input v-model="form.officialSellingPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="主键" />
        <el-table-column prop="checkingNo" label="对账编号（与对账结果表中 对账编号 相同）" />
        <el-table-column prop="type1" label="类型 0-搅拌站 1-客户" />
        <el-table-column prop="dataDate" label="数据日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dataDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dataType" label="数据类型 1-扣方 2-调差价 3-纠错" />
        <el-table-column prop="conStrength" label="砼标号" />
        <el-table-column prop="cubicNum1" label="小票方量" />
        <el-table-column prop="cubicNum" label="结算方量" />
        <el-table-column prop="unitPrice" label="含税单价" />
        <el-table-column prop="unitSellingPrice" label="不含税单价" />
        <el-table-column prop="unitPriceSum" label="含税金额" />
        <el-table-column prop="unitSellingPriceSum" label="不含税金额" />
        <el-table-column prop="officialPrice" label="信息价(含税)" />
        <el-table-column prop="officialSellingPrice" label="信息价(不含税)" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="updateTime" label="修改时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','betonCheckingDetailMpty:edit','betonCheckingDetailMpty:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudBetonCheckingDetailMpty from '@/api/betonCheckingDetailMpty'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, checkingNo: null, type1: null, dataDate: null, dataType: null, conStrength: null, cubicNum1: null, cubicNum: null, unitPrice: null, unitSellingPrice: null, unitPriceSum: null, unitSellingPriceSum: null, officialPrice: null, officialSellingPrice: null, remark: null, createTime: null, createId: null, updateTime: null }
export default {
  name: 'BetonCheckingDetailMpty',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '补充细项明细', url: 'api/betonCheckingDetailMpty', idField: 'id', sort: 'id,desc', crudMethod: { ...crudBetonCheckingDetailMpty }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'betonCheckingDetailMpty:add'],
        edit: ['admin', 'betonCheckingDetailMpty:edit'],
        del: ['admin', 'betonCheckingDetailMpty:del']
      },
      rules: {
        checkingNo: [
          { required: true, message: '对账编号（与对账结果表中 对账编号 相同）不能为空', trigger: 'blur' }
        ],
        type1: [
          { required: true, message: '类型 0-搅拌站 1-客户不能为空', trigger: 'blur' }
        ],
        dataDate: [
          { required: true, message: '数据日期不能为空', trigger: 'blur' }
        ],
        dataType: [
          { required: true, message: '数据类型 1-扣方 2-调差价 3-纠错不能为空', trigger: 'blur' }
        ],
        conStrength: [
          { required: true, message: '砼标号不能为空', trigger: 'blur' }
        ],
        cubicNum: [
          { required: true, message: '结算方量不能为空', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '含税单价不能为空', trigger: 'blur' }
        ],
        unitSellingPrice: [
          { required: true, message: '不含税单价不能为空', trigger: 'blur' }
        ],
        unitPriceSum: [
          { required: true, message: '含税金额不能为空', trigger: 'blur' }
        ],
        unitSellingPriceSum: [
          { required: true, message: '不含税金额不能为空', trigger: 'blur' }
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
      }    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
