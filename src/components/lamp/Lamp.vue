<template>
  <div> 
    <router-view />

    <ul class="wrap">
        <template v-for="item in subRouteList">
          <li>
            <v-touch  v-on:tap="activeChild(item)"> 
              <router-link active-class="active" :to="{path:item.childPath}" exact>
                <h3 class="bottom-title-bar" :class="{active: activeItemId === item.id}" >{{item.text}}</h3>
              </router-link>
            </v-touch>
          </li>
        </template>
    </ul>
  </div>
</template>

<script>
//import Config from  '@/components/lamp/Config'
export default {
  name: "Lamp",
  //mixins:[Config],
  data() {
    return {
      subRouteList: [
        {
          id: 0,
          childPath: "mode",
          text: "护眼模式"
        },
        {
          id: 1,
          childPath: "timetable",
          text: "课程表"
        },
        {
          id: 2,
          childPath: "remind",
          text: "事件提示"
        },
        {
          id: 3,
          childPath: "setting",
          text: "设置"
        }
      ],
      extraRouteList: [
        {
          id: 1,
          childPath: "planlist",
          text: "计划列表"
        },
        {
          id: 1,
          childPath: "panedit",
          text: "计划添加"
        },
        {
          id: 2,
          childPath: "remindlist",
          text: "事件列表"
        },
        {
          id: 2,
          childPath: "remindedit",
          text: "事件编辑"
        }
      ],
      activeItemId: "",
      planTypeList: [
        {
          color: "rgb(76,178,250)",
          id: 1,
          text: "写作业"
        },
        {
          color: "rgb(255,130,54)",
          id: 2,
          text: "预习"
        },
        {
          color: "rgb(204,76,251)",
          id: 3,
          text: "收拾书包"
        }
      ],

      currentScale: 0, // 灯光亮度
      hours: 0, // 灯光使用时间
    };
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    },

    playingSong() {
      return this.$store.state.openid;
    }
  },

  watch: {
    $route: function(newRoute, oldRoute) {
      let index = 0;
      //父组件中获取当前的子路由
      this.setActiveItem(newRoute.path);
    }
  },

  mounted() {
    console.log('this.$route.query.openid', this.$route.query.openid);
    this.$store.commit("CHANGE_OPENID", this.$route.query.openid);
    this.websocket.init(this.$route.query.openid);
    let index = 0;
    this.setActiveItem(this.$route.path);
  },

  methods: {
    activeChild(item) {
      this.activeItemId = item.id;
    },
    setActiveItem(path) {
      let index = 0,
        temp;
      let list = [...this.subRouteList, ...this.extraRouteList];
      //console.log(list)
      if (typeof path === "string") {
        if (path.indexOf("/") > -1) {
          temp = path.split("/");
        } else {
          temp = path;
        }
        const isArray =
          Object.prototype.toString.call(temp) === "[object Array]";
        for (; index < list.length; index++) {
          if (isArray) {
            if (temp.indexOf(list[index]["childPath"]) > -1) {
              this.activeItemId = list[index]["id"];
              break;
            }
          } else {
            if (list[index]["childPath"] === temp) {
              this.activeItemId = list[index]["id"];
              break;
            }
          }
        }
      } else {
        this.activeItemId = -1;
      }
    }
  }
};
</script>

<style scoped>
.wrap {
  position: fixed;
  bottom: 0;
  display: -webkit-flex;
  width: 100%;
  max-height: 4.5rem;
}
.wrap li {
  flex: 1;
  line-height: 4.5rem;
  text-align: center;
  font-size: 1.6rem;
  color: rgb(100, 100, 100);
  background-color: white;
}

.wrap li:nth-child(2) {
  border-left: 1px solid rgb(248, 248, 248);
  border-right: 1px solid rgb(248, 248, 248);
}

.active {
  background-color: rgb(191, 191, 191);
}

.router-link-active {
  text-decoration: none;
}

.bottom-title-bar {
  color: rgb(104, 104, 104);
  /* padding-right: 1rem; */
}

.bottom-title-bar:last-child {
  padding-right: 0;
}

a {
  text-decoration: none;
}
</style>