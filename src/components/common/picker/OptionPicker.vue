<template>
  <div>
    <h3 class="title">
      <span class="tag" @click.stop="hidePop($event)">{{cancel_txt}}</span>
      <span class='finish_tip' @click.stop="setOption($event)">{{finish_tip}}</span>
    </h3>
    <div class="option-wrapper">
      <div 
        v-for="(item,index) in list"
        :key="index"
        @click="handleCheck(item)"
        class="option-item" 
      >
        <label>{{item.name}}</label>
        <input :class="[wx_checkbox, {on: item.checked}]" :type="inputType" :id="item.name" :value="item.name" :checked="item.checked">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    keyName: {
      // 解决动态组件data数据共用的问题，监听此变量，变化时清空checkedName
      type: String
    },
    inputType: {
      default: "radio",
      type: String,
    }
  },
  data() {
    return {
      cancel_txt: "取消",
      finish_tip: "完成",
      checkedName: [],
      wx_checkbox: "wx_checkbox",
      selected: false
    };
  },
  mounted() {
    this.list;
  },
  methods: {
    hidePop(e) {
      this.$emit("hidePop", false);
    },

    setOption(e) {
      let str = this.checkedName.join("，");
      this.$emit("setOption", str);
    },

    handleCheck(item) {
      this.$set(item, "checked", !item.checked);

      const checkedName = this.checkedName;
      const index = checkedName.findIndex(checked => checked === item.name);
      item.checked ? checkedName.push(item.name) : checkedName.splice(index, 1);
    }
  },
  watch: {
    keyName: function() {
      this.checkedName = [];
    }
  }
};
</script>
<style scoped>
.option-item {
  line-height: 4rem;
  font-size: 1.5rem;
  text-align: left;
  border-bottom: 1px solid #c5c5c5;
  position: relative;
}

.option-item label {
  text-align: left;
}

.title {
  padding: 1rem 2rem;
  line-height: 4rem;
  border-bottom: 0.1rem solid rgb(245, 245, 245);
}

.finish_tip {
  float: right;
  color: red;
}

.option-wrapper {
  padding: 0 2rem;
  margin-bottom: 2rem;
}

.wx_checkbox {
  position: absolute;
  right: 1%;
  top: 22%;
}
</style>