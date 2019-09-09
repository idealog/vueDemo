<template>
  <div>
    <div class="container">
      <form @submit.prevent="submit">
        <div class="form-item">
          <span class="form-item-title" >标题：</span>
          <input class="form-item-input" placeholder="请输入标题，如：上课" v-model="form.title"/>
        </div>
        <div class="form-item extra-margin">
          <span class="form-item-title" >内容：</span>
          <input class="form-item-input" placeholder="请输入内容，如：下午3点上课" v-model="form.content"/>
        </div>
        <div class="form-item">
          <span class="form-item-title" >开始时间：</span>
          <span 
            class="form-item-value" 
            style="padding-left: 2rem;"
            @click.stop="showPop('TimePicker', 'date')">
            {{planTime}}
            <svg version="1.1" width="10" height="10"
            xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,0 8,5 0,10 0,0"
              style="fill:#000000;
              stroke:#000000;stroke-width:1"/>
            </svg>
          </span> 
          <span 
            class="form-item-value" 
            style="padding-left: 2rem;"
            @click.stop="showPop('DatePicker', 'date')"> 
            {{planDate}}
            <svg version="1.1" width="10" height="10"
              xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,0 8,5 0,10 0,0"
              style="fill:#000000;
              stroke:#000000;stroke-width:1"/>
            </svg>
          </span>
        </div>
        <div @click.stop="showPop('OptionPicker','weekRepeat')" class="form-item">
          <span class="form-item-title">重复：</span>
          <span class="form-item-value">
            {{form.week_period}}
            <svg version="1.1" width="12" height="18"
              xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,0 8,9 0,18"
              style="fill:#ffffff;
              stroke:#c5c5c5;stroke-width:1"/>
            </svg>
          </span>
        </div>
        <div @click.stop="showPop('OptionPicker','remind')" class="form-item">
          <span class="form-item-title">提醒方式：</span>
          <span class="form-item-value">
            {{form.remind_type}}
            <svg version="1.1" width="12" height="18"
              xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,0 8,9 0,18"
              style="fill:#ffffff;
              stroke:#c5c5c5;stroke-width:1"/>
            </svg>
          </span>
        </div>
        <div @click.stop="showPop('OptionPicker','delay')" class="form-item extra-margin">
          <span class="form-item-title">自动延迟：</span>
          <span class="form-item-value">
          {{form.auto_delay}}分钟
          <svg version="1.1" width="12" height="18"
          xmlns="http://www.w3.org/2000/svg">
            <polyline points="0,0 8,9 0,18"
              style="fill:#ffffff;
              stroke:#c5c5c5;stroke-width:1"/>
          </svg>
          </span>
        </div>
        <div class="form-item switch-container">
          <p>
            <span class="form-item-title">语音播报</span><br/>
            <span class="font-small font-color-c5">提醒闹钟响铃之后，按键语音播报计划内容</span>
          </p>
          <div class="switch" :class="{active:form.is_voice_broadcast}"  @click.stop="toggle">
            <span class="switch-bar"></span>        
          </div>
        </div>
        <button class="form-button" type="submit">完成</button>
      </form>
    </div>
    <Pop :show_pop_ctrl="show_pop_ctrl"
      :slot_business_component="slot_business_component" 
      :show_pop_down_transition="show_pop_down_transition" 
      :pop_panel_height="pop_panel_height">
      <div :slot="slot_business_component">
        <component :is="slot_business_component"
          :list="optionList"
          :keyName="optionType"
          @setDate="setDate"
          @setTime="setTime"
          @setOption="setOption"
          @hidePop="hidePop">
        </component>
      </div>
    </Pop>
  </div>
</template>

<script>
// 课程表 编辑组件
import Pop from "@/components/common/pop/Pop";
import DatePicker from "@/components/common/picker/DatePicker";
import TimePicker from "@/components/common/picker/TimePicker";
import OptionPicker from "@/components/common/picker/OptionPicker";

import { api } from "@/service/util/api";
import { transformWeekToArr, transformArrToWeek } from "@/service/util/mUtils";

export default {
  components: {
    Pop,
    DatePicker,
    TimePicker,
    OptionPicker
  },

  data() {
    return {
      form: {
        open_id: this.openid,
        // open_id: "oMI5zwbcRP0ipXiXyGlBS-DMBUo8",
        action: "alarm",
        alarm_operation: "add",
        type_name: "",
        title: "",
        content: "",
        begin_time: "",
        week_period: "", // JSON.stringify
        remind_type: "",
        auto_delay: 0,
        is_voice_broadcast: 0, // 0 or 1
        alarm_tag: "",
        alarm_switch: 1,
        alarm_type: 0
      },
      weekTag: 0,
      show_pop_ctrl: false,
      slot_business_component: "",
      show_pop_down_transition: false,
      pop_panel_height: "30rem",
      planTime: "",
      planDate: "",
      optionType: "",
      optionList: [],
      link: "planlist",
      weeks: [
        {
          name: "周一"
        },
        {
          name: "周二"
        },
        {
          name: "周三"
        },
        {
          name: "周四"
        },
        {
          name: "周五"
        },
        {
          name: "周六"
        },
        {
          name: "周日"
        }
      ],
      remindType: [{ name: "语音提示" }, { name: "音乐提示" }],
      delayTime: [{ name: 5 }, { name: 10 }, { name: 30 }, { name: 60 }]
    };
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    }
  },

  mounted() {
    this.initForm();
  },

  beforeDestroy() {
    this.$store.commit("CHANGE_UPDATING_PLAN", {});
  },

  methods: {
    /**
     * 通过form表单中是否存在id字段，来判断此次操作是添加还是更新任务
     */
    submit() {
      let model = "POST";

      if (this.form.id) {
        model = "PUT";
        this.form.alarm_operation = "update";
      } else {
        // this.form.remind_type = 0;
        this.form.alarm_type = this.$store.state.alarm_type;
      }

      let remind_type = this.form.remind_type;

      switch (remind_type) {
        case "语音提示":
          this.form.remind_type = "0";
          break;
        case "音乐提示":
          this.form.remind_type = "1";
          break;
        case "语音提示，音乐提示":
        case "音乐提示，语音提示":
          this.form.remind_type = "0，1";
          break;
      }

      this.form.begin_time = this.planDate + " " + this.planTime;
      // this.form.week_period = this.transformWeek();
      this.form.week_period = transformWeekToArr(this.form.week_period);
      this.calWeekTag(this.form.week_period);
      this.initTag();

      // console.log('this.form2', this.form);
      api(
        "lamp/remind/one",
        { ...this.form, open_id: this.openid },
        model
      ).then(r => {
        if (r.data.status == 1) {
          alert("输入不完整，请重新输入");
          return;
        }
        this.$router.push({ path: `/lamp/${this.link}` });
        this.form = {};
      });
    },

    /**
     * 通过各种数据拼接得出alarm_type
     */
    initTag() {
      let date = this.planDate.split("-");
      let time = this.planTime.split(":");
      this.form.alarm_tag =
        date[0] +
        date[1] +
        date[2] +
        time[0] +
        time[1] +
        "00" +
        this.form.alarm_type +
        this.weekTag;
    },

    /**
     * 计算得出week_tag字段
     */
    calWeekTag(arr) {
      let count = 0;
      arr.forEach(item => {
        count += Math.pow(2, item);
      });
      if (count < 10) {
        count = "00" + count;
      } else if (count < 100) {
        count = "0" + count;
      }
      this.weekTag = count;
    },

    /**
     * 初始化表单数据
     */
    initForm() {
      // 如果是提醒
      if (this.$route.query.title) {
        this.form.title = this.$route.query.title;
        this.form.type_name = "time_table";
        this.link = "planlist";
      }

      // 如果是更新提醒
      if (JSON.stringify(this.$store.state.updatingPlan) != "{}") {
        this.form = Object.assign({}, this.$store.state.updatingPlan);
        // console.log("this.form", this.form);

        // 转化时间
        let date = new Date(this.form.begin_time);

        this.planTime = date.getHours() + ":" + date.getMinutes();
        this.planDate =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();

        // 转化重复周期
        let weekArr = this.form.week_period.split(",");
        this.form.week_period = transformArrToWeek(weekArr);

        // 转化提醒方式
        let remind_type = this.form.remind_type;

        switch (remind_type) {
          case "0":
            this.form.remind_type = "语音提示";
            break;
          case "1":
            this.form.remind_type = "音乐提示";
            break;
          case "0，1":
            this.form.remind_type = "语音提示，音乐提示";
            break;
        }
      }
    },

    toggle() {
      this.form.is_voice_broadcast = 1 - this.form.is_voice_broadcast;
    },

    showPop(picker, type) {
      switch (type) {
        case "date":
          break;
        case "weekRepeat":
          this.optionList = this.weeks;
          break;
        case "remind":
          this.optionList = this.remindType;
          break;
        case "delay":
          this.optionList = this.delayTime;
          break;
      }

      this.slot_business_component = picker;
      this.show_pop_ctrl = true;
      this.optionType = type;
    },

    setDate(val) {
      this.planDate = val;
      this.setHideTransition();
    },

    setTime(val) {
      this.planTime = val;
      this.setHideTransition();
    },

    setOption(val) {
      let type = this.optionType;
      switch (type) {
        case "weekRepeat":
          this.form.week_period = val;
          break;
        case "remind":
          this.form.remind_type = val;
          break;
        case "delay":
          this.form.auto_delay = parseInt(val);
          break;
        default:
          break;
      }
      this.setHideTransition();
    },

    hidePop() {
      this.setHideTransition();
    },

    /**
     * 弹出层动画效果
     */
    setHideTransition() {
      const vm = this;
      vm.show_pop_down_transition = true;
      setTimeout(function() {
        vm.show_pop_down_transition = false;
        vm.show_pop_ctrl = false;
      }, 300);
    }
  }
};
</script>

<style scoped>
.container {
  background: rgb(243, 248, 251);
  z-index: -1;
}

form {
  height: 94vh;
  position: relative;
}

.form-item-title {
  font-size: 1.5rem;
  width: 4rem;
}

.form-item-input {
  border: none;
  outline: none;
  width: calc(100% - 7rem);
  font-size: 1.5rem;
  height: 3rem;
}

.form-item {
  padding: 0 1rem;
  border-bottom: 1px solid rgb(216, 238, 252);
  background: white;
  min-height: 4rem;
  line-height: 4rem;
  padding-right: 1rem;
  position: relative;
}

.form-item-value {
  float: right;
  margin-left: 2rem;
  display: inline-block;
  position: relative;
  font-size: 1rem;
}

.form-item-value svg {
  vertical-align: middle;
  margin-left: 0.8rem;
}

.form-button {
  display: block;
  position: absolute;
  width: 90%;
  background: #41abf5;
  color: #fff;
  padding: 0.8rem 0;
  margin-bottom: 2rem;
  border: transparent;
  border-radius: 0.4rem;
  bottom: 3%;
  left: 5%;
  right: 5%;
}

.extra-margin {
  margin-bottom: 0.8rem;
}

.switch-container {
  line-height: initial;
  height: 5rem;
}

.switch-container p {
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.switch {
  float: right;
  width: 4rem;
  height: 2rem;
  background: white;
  border-radius: 2rem;
  border: 1px solid #c5c5c5;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.font-small {
  font-size: 1.3rem;
  letter-spacing: 0.02rem;
}

.font-color-c5 {
  color: #c5c5c5;
}

.switch-bar {
  width: 1.98rem;
  height: 1.98rem;
  border-radius: 50%;
  background: #c5c5c5;
  display: inline-block;
  position: absolute;
  transition: transform 400ms ease;
}

.switch.switch.active {
  border: 1px solid #41abf5;
}

.switch.active .switch-bar {
  transform: translate(1.79rem, 0);
  background: #41abf5;
}
</style>