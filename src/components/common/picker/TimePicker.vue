<template>
	<div class="wrap">
		<h3 class="title">
			<span class="tag" @click.stop="hidePop($event)">{{cancel_txt}}</span>
			<span class='finish_tip' @click.stop="setTime($event)">{{finish_tip}}</span>
		</h3>
		<!--选择属性-->
		<div class="flex_container">
			<div class="flex_item">
				<Picker :items="time_range.hour_list" :initValue="initHour" :currentValue.sync="showHour">
				</Picker>
			</div>
			<div class="flex_item">
				<Picker :items="time_range.minute_list" :initValue="initMinute" :currentValue.sync="showMinute">
				</Picker>
			</div>
			<!--<div class="flex_item">
				<Picker :items="time_range.second_list" :initValue="initSecond" :currentValue.sync="showSecond">
				</Picker>
			</div>-->
		</div>
	</div>
</template>
<script type="text/javascript">
import Picker from "@/components/common/picker/Picker";
export default {
  components: {
    Picker
  },
  data() {
    return {
      cancel_txt: "取消",
      finish_tip: "完成",
      time_range: {
        hour_list: [],
        minute_list: [],
        second_list: []
      },
      initHour: null, //初始值
      initMinute: null,
      initSecond: null,
      showHour: "",
      showMinute: "",
      showSecond: ""
    };
  },
  mounted() {
    this.getInitVal();
  },
  methods: {
    //天数判断 是闰年还是平年
    isLeapYear(year) {
      if (isNaN(year)) {
        return year;
      }
      return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    },
    valDays(days) {
      const day_list = [];
      for (let i = 1; i <= days; i++) {
        day_list.push(i);
      }
      this.$set(this.time_range, "day_list", day_list); //动态设置里面的天数
    },
    getInitVal() {
      const date = new Date();
      for (let i = 0; i <= 23; i++) {
        this.time_range.hour_list.push(i);
      }
      for (let i = 0; i <= 59; i++) {
        this.time_range.minute_list.push(i);
      }
      for (let i = 0; i <= 59; i++) {
        this.time_range.second_list.push(i);
      }
      this.initHour = date.getHours();
      this.initMinute = date.getMinutes();
      const vm = this;
      //天数涉及 多次计算 放入异步队列里面进行处理
      setTimeout(function() {
        vm.initSecond = date.getSeconds();
      }, 100);
    },
    hidePop(e) {
      this.$emit("hidePop", false);
    },
    setTime(e) {
      let [hour, minute] = [this.showHour, this.showMinute];
      this.$emit("setTime", `${hour}:${minute}`);
    }
  }
};
</script>
<style type="text/css" scoped>
.title {
  padding: 1rem 2rem;
  line-height: 4rem;
  border-bottom: 0.1rem solid rgb(245, 245, 245);
}
.finish_tip {
  float: right;
  color: red;
}
.flex_container {
  display: -webkit-flex;
  padding: 0 4rem;
}
.flex_item {
  flex: 1;
}
</style>
