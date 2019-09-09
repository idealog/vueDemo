<template>
  <div>
    <div class="header">
      <span class="line"></span>
      <span>
        计划详情
      </span>
    </div>
    <div class="list-wrap">
      <ul>
        <li :key="index" v-for="(item,index) in list" @click="update(item)" class="list-item">
          <div>
            <div>
              <span class="list-circle"></span>
              <span v-bind:style="{'color': item.color}" class="title">{{item.title}}</span>
              <span class="time">{{showWeekDays(item.week_period) || "不重复"}}</span>
              <span class="time">{{formatTime(item.begin_time)}}</span>
              <span>{{item.remind_type}}</span>
              <span><img :src="deleteIcon" class="del" @click.stop="deletePlan(item,index)"></span>
            </div>
            <div>
              内容：
            </div>
            <div style="margin-left: 1.3rem;">
              {{item.content}}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
//课程表组件列表组件
import Config from "@/components/lamp/Config";
import { api } from "@/service/util/api";
import { showWeekDays } from "@/service/util/mUtils";

export default {
  mixins: [Config],
  data() {
    // 1、铃声   2、震动
    // 周日 - 周六  0 - 6
    // 类型 planType 1 写作业  2 预习   3 收拾书包
    return {
      list: [],
      showWeekDays,
      ringTypeList: [
        {
          typeId: 1,
          text: "铃声"
        },
        {
          typeId: 2,
          text: "震动"
        }
      ],
      deleteIcon: require("@/assets/img/delete.png"),
      planTypeList: []
    };
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    }
  },

  mounted() {
    this.planTypeList = this.$parent.planTypeList;
    this.addColorAttr();
    this.getList();
  },

  methods: {
    getList() {
      api("lamp/remind/list", {
        type_name: "time_table",
        open_id: this.openid
        // open_id: "oMI5zwRHtuohiw47oHwiKIeoCZp4"
      }).then(r => {
        this.list = r.data.data.reverse();
      });
    },

    update(item) {
      // console.log("item", item);
      this.$store.commit("CHANGE_UPDATING_PLAN", item);

      this.$router.push({ path: `/lamp/planedit` });
    },

    deletePlan(item, index) {
      item.alarm_operation = "del";
      this.list.splice(index, 1);
      api("lamp/remind/one", item, "DELETE");
    },

    formatTime(date) {
      let time = new Date(date);
      let h = time.getHours();
      let min = time.getMinutes();
      h < 10 ? (h = "0" + h) : (h = h);
      min < 10 ? (min = "0" + min) : (min = min);
      time = h + ":" + min;
      return time;
    },

    addColorAttr() {
      this.list.map((item, index) => {
        this.$set(item, "color", this.planTypeList[item.planType - 1].color);
      });
    },

    showRingType(arr) {
      let result = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        for (let i = 0; i < this.ringTypeList.length; i++) {
          if (arr.indexOf(this.ringTypeList[i]["typeId"]) > -1) {
            result.push(this.ringTypeList[i]["text"]);
          }
        }
        if (result.length > 1) {
          return result.join("+");
        } else {
          return result.join("");
        }
      } else {
        return arr;
      }
    }
  }
};
</script>

<style scoped>
.line {
  display: inline-block;
  width: 0.2rem;
  height: 1.5rem;
  background: rgb(76, 178, 252);
}

.header {
  padding: 1rem;
  border-bottom: 0.3rem solid rgb(243, 248, 251);
}

.header span {
  vertical-align: middle;
}

.list-wrap {
  height: 85vh;
  overflow: auto;
}

.list-item {
  padding: 1rem;
  border-bottom: 1px solid rgb(220, 244, 254);
}

.del {
  width: 1.8rem;
}

.list-item div,
span {
  font-size: 1.5rem;
}

.title {
  font-size: 1.8rem;
  margin-right: 0.8rem;
  color: rgb(76, 178, 252);
}

.list-item > div:first-child > div:first-child > span:last-child {
  float: right;
}
</style>