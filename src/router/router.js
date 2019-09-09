/*const Index = r => require.ensure([], () => r(require('@/components/index')), 'index') //故事云首页
const Album = r => require.ensure([], () => r(require('@/components/common/AlbumList')), 'Album') // 专辑
const SongList = r => require.ensure([], () => r(require('@/components/common/SongList')), 'SongList') // 歌曲列表
const SongDetail = r => require.ensure([], () => r(require('@/components/common/SongDetail')), 'SongDetail') // 歌曲详情
const UserGuide =  r => require.ensure([], () => r(require('@/components/userguide/UserGuide')), 'UserGuide') // 用户指南
const DeviceManage = r => require.ensure([], () => r(require('@/components/devicemanage/DeviceManage')), 'DeviceManage') // 设备管理
const Steward = r => require.ensure([], () => r(require('@/components/steward/Steward')), 'Steward') // 闹钟提醒
const Family = r => require.ensure([], () => r(require('@/components/set/Family')), 'Family') // 家庭成员
const Share = r => require.ensure([], () => r(require('@/components/set/Share')), 'Share') // 设备分享
const TestMode = r => require.ensure([], () => r(require('@/components/testmode/TestMode')), 'TestMode') // 产品选择
const Result = r => require.ensure([], () => r(require('@/components/testmode/Result')), 'Result') // 测试模式结果
const Rank = r => require.ensure([], () => r(require('@/components/rank/Rank')), 'Rank') // 排行榜
const Interaction = r => require.ensure([], () => r(require('@/components/rank/Interaction')), 'Interaction') // 排行榜
const SynCourse = r => require.ensure([], () => r(require('@/components/content/syncourse/syncourse')), 'SynCourse') // 同步教材

//喜马拉雅
const XmlyTag = r => require.ensure([], () => r(require('@/components/content/xmly/xmly_tag')), 'XmlyTag') // 喜马拉雅标签
const XmlyContent = r => require.ensure([], () => r(require('@/components/content/xmly/xmly_content')), 'XmlyContent')

//更多
const AllListenMore = r => require.ensure([], () => r(require('@/components/content/all/AllListenMore')), 'AllListenMore') // 大家都爱听更多
const LatestMore = r => require.ensure([], () => r(require('@/components/content/latest/LatestMore')), 'LatestMore') // 最新更多
const RecommendMore = r => require.ensure([], () => r(require('@/components/content/recommend/RecommendMore')), 'RecommendMore') // 最新更多

//十万个为什么
const WonderTag = r => require.ensure([], () => r(require('@/components/content/wonder_why/wonder_tag')), 'WonderTag') // 十万个为什么标签
const WonderList = r => require.ensure([], () => r(require('@/components/content/wonder_why/wonder_list')), 'WonderList')

//电台
const Radio = r => require.ensure([], () => r(require('@/components/content/radio/Radio')), 'Radio')

//推送记录
const PushRecord = r => require.ensure([], () => r(require('@/components/content/push_record/push_record')), 'PushRecord')

//本地内容
const LocalMusic = r => require.ensure([], () => r(require('@/components/content/localmusic/localmusic')), 'LocalMusic')

//机器人
const Robot = r => require.ensure([], () => r(require('@/components/robot/Robot')), 'Robot')

//足迹
const FootPrint =  r => require.ensure([], () => r(require('@/components/footprint/footprint')), 'FootPrint')

//关于
const About = r => require.ensure([], ()=> r(require('@/components/about/about')),'About')

//宝宝信息
const BabyInfo = r => require.ensure([], ()=> r(require('@/components/set/BabyInfo')),'BabyInfo')

const Product = r => require.ensure([], () => r(require('@/components/product/Product')), 'Product') 

//搜索
const SearchResult = r => require.ensure([], () => (require('@/components/search/SearchResult')) , 'SearchResult')

const Introduce = r => require.ensure([], () => (require('@/components/introduce/Introduce')) , 'Introduce')*/

const Lamp = r => require.ensure([], () => (require('@/components/lamp/Lamp')), 'Lamp')
const LampHome = r => require.ensure([], () => (require('@/components/lamp/children/lamphome/LampHome')), 'LampHome')
const LampMode = r => require.ensure([], () => (require('@/components/lamp/children/lampmode/LampMode')), 'LampMode')
const Remind = r => require.ensure([], () => (require('@/components/lamp/children/remind/Remind')), 'Remind')
const TimeTable = r => require.ensure([], () => (require('@/components/lamp/children/timetable/TimeTable')), 'TimeTable')
const RemindList = r => require.ensure([], () => (require('@/components/lamp/children/remind/RemindList')), 'RemindList')
const PlanList = r => require.ensure([], () => (require('@/components/lamp/children/timetable/PlanList')), 'PlanList')
const PlanEdit = r => require.ensure([], () => (require('@/components/lamp/children/timetable/PlanEdit')), 'PlanEdit')
const TableList = r => require.ensure([], () => (require('@/components/lamp/children/timetable/TableList')), 'TableList')
const TableEdit = r => require.ensure([], () => (require('@/components/lamp/children/timetable/TableEdit')), 'TableEdit')
const Setting = r => require.ensure([], () => (require('@/components/lamp/children/setting/Setting')), 'Setting')
const Mine = r => require.ensure([], () => (require('@/components/lamp/children/setting/Mine')), 'Mine')
const Talk = r => require.ensure([], () => (require('@/components/lamp/children/setting/Talk')), 'Talk')
const Family = r => require.ensure([], () => (require('@/components/lamp/children/setting/Family')), 'Family')
const Collection = r => require.ensure([], () => (require('@/components/lamp/children/setting/Collection')), 'Collection')

export default [{
    path: '/lamp',
    component: Lamp,
    redirect: '/lamp/home', // 子tab 必须默认指定一个
    children: [{
        path: 'home',
        component: LampHome,
        meta: {
          title: '台灯'
        },
      },
      {
        path: 'mode',
        component: LampMode,
        meta: {
          title: '护眼模式'
        },
      },
      {
        path: 'remind',
        component: Remind,
        meta: {
          title: '事件提示'
        }
      },
      {
        path: 'setting',
        component: Setting,
        meta: {
          title: '设置'
        },
      },
      {
        path: 'mine',
        component: Mine,
        meta: {
          title: '我的信息'
        },
      },
      {
        path: 'talk',
        component: Talk,
        meta: {
          title: '萌宝说'
        }
      },
      {
        path: 'collection',
        component: Collection,
        meta: {
          title: '收藏'
        }
      },
      {
        path: 'family',
        component: Family,
        meta: {
          title: '家庭成员'
        }
      },
      {
        path: 'remindlist',
        component: RemindList,
        meta: {
          title: '事件列表'
        }
      },
      {
        path: 'timetable',
        component: TimeTable,
        meta: {
          title: '课程表'
        }
      },
      {
        path: 'tableedit',
        component: TableEdit,
        meta: {
          title: '添加课程'
        }
      },
      {
        path: 'tablelist',
        component: TableList,
        meta: {
          title: '课程详情'
        }
      },
      {
        path: 'planlist',
        component: PlanList,
        meta: {
          title: '计划列表'
        }
      }, {
        path: 'planedit',
        component: PlanEdit,
        meta: {
          title: '添加计划'
        }
      }
    ]
  },
  /*{
        path:'/index',
        name:'index',
        component:Index,
        meta: {
            title:'故事云',
            keepAlive: false //不缓存故事云首页
        }
    },*/
  /*{
        path:'/album/',
        name:'Album',
        component:Album,
        meta:{
            title:'专辑列表',
            keepAlive: true
        }
    },
    {
        path:'/songlist',
        name:'SongList',
        component:SongList,
        meta:{
            title:'单曲列表',
            keepAlive: true
        }
    },
    {
        path:'/song',
        name:'SongDetail',
        component:SongDetail,
        meta:{
            title:'单曲详情'
        }
    },
    {
    	path:'/userguide',
    	name:'UserGuide',
    	component:UserGuide,
        meta:{
            title:'使用指南'
        }
    },
    {
    	path:'/devicemanage',
    	name:'DeviceManage',
    	component:DeviceManage,
        meta:{
            title:'设备管理'
        }
    },
    {
        path:'/steward',
        name:'Steward',
        component:Steward
    },
	{
      path: '/testmode',
      name: 'TestMode', //测试模式
      component: TestMode,
      meta:{
            title:'测试模式'
        }
    },
    {
      path: '/testmode/result',
      name: 'Result', //测试结果
      component: Result
    },
	{
		path:'/rank/composite',
		name: 'Rank',
		component: Rank,
        meta:{
            title:'排行榜'
        }
	},
	{
		path:'/rank/Interaction',
		name: 'Interaction',
		component: Interaction,
        meta:{
            title:'排行榜'
        }
	},
	{
		path: '/set/family',
      	name: 'Family', //家庭成员
      	component: Family,
        meta:{
            title:'家庭成员'
        }
	},
	{
		path: '/set/share',
		name: 'Share',
		component: Share,
        meta:{
            title:'分享设备'
        }
	},
    {
        path: '/set/babyinfo',
        name: 'BabyInfo',
        component: BabyInfo,
        meta:{
            title:'宝宝信息'
        }
    },
	{
		path:'/syncourse',
		name:'SynCourse',
		component:SynCourse,
        meta:{
            title:'同步教材'
        }
	},
	{
		path:'/xmly',
		name:'XmlyTag',
		component:XmlyTag,
        meta:{
            title:'喜马拉雅',
            keepAlive:false
        }
	}, 
    {
        path:'/xmly_content',
        name:'XmlyContent',
        component:XmlyContent,
        meta:{
            title:'喜马拉雅',
            keepAlive: true
        }
    },
    {
        path:'/alllistenmore',
        name:'AllListenMore',
        component:AllListenMore,
        meta:{
            title:'更多',
            keepAlive:true
        }
    },   
    {
        path:'/latestmore',
        name:'LatestMore',
        component:LatestMore,
        meta:{
            title:'更多'
        }
    },
    {
        path:'/recommendmore',
        name:'RecommendMore',
        component:RecommendMore,
        meta:{
            title:'更多',
            keepAlive:true
        }
    },
    {
        path:'/wonder_tag',
        name:'WonderTag',
        component:WonderTag,
        meta:{
            title:'十万个为什么'
        }
    },
    {
        path:'/wonder_list',
        name:'WonderList',
        component:WonderList,
        meta:{
            title:'十万个为什么'
        }
    },
    {
        path:'/radio',
        name:'Radio',
        component:Radio,
        meta:{
            title:'电台'
        }
    },
    {
        path:'/push_record',
        name:'PushRecord',
        component:PushRecord,
        meta:{
            title:'推送记录'
        }
    },
    {
        path:'/robot',
        name:'Robot',
        component:Robot,
        meta:{
            title:'机器人'
        }
    },
    {
        path:'/localmusic',
        name:'LocalMusic',
        component:LocalMusic,
        meta:{
            title:'本地内容'
        }
    },
    {
        path:'/footprint',
        name:'FootPrint',
        component:FootPrint,
        meta:{
            title:'足迹'
        }
    },
    {
        path:'/about',
        name:'About',
        component:About,
        meta:{
            title:'关于'
        }
    },
    {
        path:'/searchresult',
        name:'SearchResult',
        component:SearchResult,
        meta:{
            title:'搜索结果'
        }
    },
    {
        path:'/introduce',
        component:Introduce,
        meta:{
            title:'公司介绍'
        }
    },
    {
        path: '/lamp/mode',
        component: LampMode
    },
    {
        path: '/lamp/reminder',
        component: Reminder
    },
    {
        path: '/lamp/timetable',
        component: TimeTable
    },
    /*{
        path:'/lamp',
        component: Lamp,
        children: [
            {
                path:'/mode',
                component: LampMode
            },
            {
                path: '/reminder',
                component: Reminder
            },
            {
                path: '/timetable',
                component: TimeTable
            }
        ]
    },*/

  {
    path: "/",
    redirect: '/lamp'
  }
]
