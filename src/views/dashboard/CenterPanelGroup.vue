<template>
  <!-- 个人中心 显示 当前账户金额使用 -->
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('apply')">
        <div class="card-panel-icon-wrapper icon-money-onway">
          <svg-icon icon-class="money-onway" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            付款中金额
          </div>
          <count-to :start-val="0" :end-val="pg.applyMoney" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('apply')">
        <div class="card-panel-icon-wrapper icon-money-contract">
          <svg-icon icon-class="money-contract" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            可申请金额
          </div>
          <count-to :start-val="0" :end-val="pg.money" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('freeze')">
        <div class="card-panel-icon-wrapper icon-money-freeze">
          <svg-icon icon-class="money-freeze" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            冻结金额
          </div>
          <count-to :start-val="0" :end-val="pg.frozenMoney" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {getDetail} from "@/api/report/userMoney";

export default {
  components: {
    CountTo
  },
  //props: ["pg"], // props 接收 父组件 传递过来的值
  data(){
    return{
      pg: {
        frozenMoney: 0,
        applyMoney: 0,
        money: 0
      }
    }
  },
  mounted() {
    this.getDetailByMySelf()
  },
  methods: {
    handleSetLineChartData(type) { // 向父页面传值
      this.$emit('handleSetLineChartData', type)
    },
    getDetailByMySelf(){
      getDetail().then((data) => {
        this.pg = data.data
      }).catch(() => {
        // nothing to do
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-money-onway {
        background: #40c9c6;
      }

      .icon-money-contract {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-money-freeze {
        background: #34bfa3
      }
    }

    .icon-money-onway {
      color: #40c9c6;
    }

    .icon-money-contract {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-money-freeze {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
