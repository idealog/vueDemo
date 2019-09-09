<template>
  <div>
    <div class="container">
      <form @submit.prevent="submit">
        <div class="table" v-for="i in num" :key="i">
          <div v-if="i>1" class="header">
            <span class="rank">第{{i}}段</span>
            <span class="del">
              <img :src="deleteIcon" class="del" @click.stop="deleteItem(item,index)">
            </span>
          </div>
          <div class="form-item">
            <span class="form-item-title">课程名称: </span>
            <input 
              type="text" 
              class="form-item-input" 
              placeholder="请输入课程名称，如：语文" 
              v-model="form.title">
          </div>
          <div class="form-item">
            <span class="form-item-title">课程内容: </span>
            <input 
              type="text" 
              class="form-item-input" 
              placeholder="请输入课程内容，如：第五课，赤壁赋" 
              v-model="form.content"> 
          </div>
          <div class="form-item">
            <span class="form-item-title">上课时间: </span>
            <span class="form-item-value" @click.stop="showPop('OptionPicker', 'time')">
              {{planTime}}
              <svg version="1.1" width="10" height="10"
              xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,0 8,5 0,10 0,0"
                style="fill:#000000;
                stroke:#000000;stroke-width:1"/>
              </svg>
            </span> 
            <span class="form-item-value" @click.stop="showPop('OptionPicker', 'weeks')"> 
              {{planDate}}
              <svg version="1.1" width="10" height="10"
                xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,0 8,5 0,10 0,0"
                style="fill:#000000;
                stroke:#000000;stroke-width:1"/>
              </svg>
            </span>
          </div>
          <div class="form-item">
            <span class="form-item-title">语音提醒：</span>
            <div class="switch" :class="{active:form.is_remind}"  @click.stop="toggle">
              <span class="switch-bar"></span>        
            </div>
          </div>
        </div>
        <!-- <div @click="num+=1" class="form-item add">
          <span>+ 添加其他时间段</span>
        </div> -->
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
          @setOption="setOption"
          @hidePop="hidePop">
        </component>
      </div>
    </Pop>
  </div>
</template>

<script>
import { api } from "@/service/util/api";
import { getWeek } from "@/service/util/mUtils";

import Pop from "@/components/common/pop/Pop";
import DatePicker from "@/components/common/picker/DatePicker";
import OptionPicker from "@/components/common/picker/OptionPicker";

export default {
  components: {
    Pop,
    DatePicker,
    OptionPicker
  },

  data() {
    return {
      form: {
        open_id: this.openid,
        // open_id: "oMI5zwbcRP0ipXiXyGlBS-DMBUo8",
        title: "",
        content: "",
        begin_time: "",
        is_remind: 0
      },
      num: 1,
      planDate: "",
      planTime: "",
      deleteIcon: require("@/assets/img/shanchu.png"),
      slot_business_component: "",
      show_pop_down_transition: false,
      pop_panel_height: "30rem",
      optionList: [],
      optionType: "",
      show_pop_ctrl: false,
      time: [
        { name: "第一节" },
        { name: "第二节" },
        { name: "第三节" },
        { name: "第四节" },
        { name: "第五节" },
        { name: "第六节" },
        { name: "第七节" }
      ],
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
      ]
    };
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    }
  },

  mounted() {
    this.initDate();
    this.websocket.init(this.openid);
  },

  methods: {
    submit() {
      this.switchDate();
      this.form.begin_time = this.planDate + " " + this.planTime;

      delete this.form.date;
      delete this.form.time;
      // delete this.form.weekDate;

      if (this.form.id) {
        api(
          `userCourse/${this.form.id}`,
          {
            ...this.form,
            open_id: this.openid
          },
          "PUT"
        ).then(r => {
          this.websocket.sendMessage({
            ...this.form,
            week_date: this.form.weekDate,
            action: "schedule"
          });
          this.$router.push({ path: "/lamp/timetable" });
          this.form = {};
        });
        return;
      }

      api("userCourse", { ...this.form, open_id: this.openid }, "POST").then(
        r => {
          this.websocket.sendMessage({
            ...this.form,
            week_date: this.form.weekDate,
            action: "schedule"
          });
          this.$router.push({ path: "/lamp/timetable" });
          this.form = {};
        }
      );
    },

    initDate() {
      this.planDate = this.$store.state.table.weekDate;
      this.planTime = this.$store.state.table.time;
      this.form = Object.assign({}, this.form, this.$store.state.table);
    },

    // init() {
    //   let data = this.$store.state.table;
    //   let date = this.$store.state.table.date.split(" ");
    //   this.planDate = date[0];
    //   this.planTime = date[1];
    //   this.form.title = data.title;
    //   this.form.action = "device_schedule";
    // },

    switchDate() {
      let week = this.planDate;
      let i = 0;
      switch (week) {
        case "周一":
          i = 0;
          break;
        case "周二":
          i = 1;
          break;
        case "周三":
          i = 2;
          break;
        case "周四":
          i = 3;
          break;
        case "周五":
          i = 4;
          break;
        case "周六":
          i = 5;
          break;
        case "周日":
          i = 6;
          break;
        default:
          break;
      }

      this.planDate = new Date().getFullYear() + "-" + getWeek(i);
    },

    toggle() {
      this.form.is_remind = 1 - this.form.is_remind;
    },

    showPop(picker, type) {
      switch (type) {
        case "weeks":
          this.optionList = this.weeks;
          break;
        case "time":
          this.optionList = this.time;
          break;
      }

      this.slot_business_component = picker;
      this.show_pop_ctrl = true;
      this.optionType = type;
    },

    setOption(val) {
      let type = this.optionType;
      switch (type) {
        case "time":
          this.planTime = val;
          break;
        case "weeks":
          this.planDate = val;
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
  height: 95vh;
  position: relative;
}

.table {
  margin-bottom: 0.5rem;
}

.header {
  padding: 5px 10px;
}

.del {
  float: right;
  width: 1.4rem;
}

.form-item-title {
  font-size: 1.5rem;
  padding-right: 1rem;
  width: 4rem;
}

.form-item-input {
  border: none;
  outline: none;
  width: calc(100% - 9rem);
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

.form-item.add {
  text-align: center;
  font-size: 1.5rem;
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
  border: transparent;
  border-radius: 0.4rem;
  bottom: 6%;
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