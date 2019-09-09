//所有的状态数据  提供给vue实例使用
export default {
  default_album_icon: 'icon_happy_song.png',
  catch_img: {},
  product: null,
  device_online_state: false,
  media_id: '',
  mac: '',
  led: '', //灯的状态
  version: '', //版本
  song_num: '', //音频数量
  ota: '', // ota版本
  charger: '',
  battery: 1, //电池状态
  childlock: '', //童锁
  wechat_mode: '', //
  charger: '', //
  sleep_time: '', //休眠时间
  sleep_reset_time: '', //剩余时间
  voice_type: '', //声音类型
  sdcard_free_size: '', //剩余存储卡容量
  sdcard_total_size: '', //存储卡总容量
  device_state: {
    status: ''
  },
  show_extra: false,
  listen_item: '', //试听
  listening_item: '', //歌曲列表 展开 进行记录
  play_url: '', // 歌曲列表试听的时候 记录正在试听的哪首歌曲
  show_propelling: false,
  state_player: {},

  play_list: [],

  play_mode: '',

  player_timer: '',
  player_progress: 0,

  player_timer: '',

  player_count: 0,

  title: '智能机器人',
  keyword: '',

  /* lamp相关 */
  light_status: 1, // 灯的状态
  use_time: 0, // 台灯使用时间
  lightness: 6, // 灯的亮度
  mode: 0, // 当前的模式
  ra: { // 指数值
    start: 0,
    end: 0
  },
  color_temp: 0, // 色温

  led_on_time: 0, // 开灯时间
  sit_normal_time: 0, // 坐姿正常时间
  sit_error_time: 0, // 坐姿错误时间
  sit_remind_count: 0, // 坐姿提醒次数
  rest_remind_count: 0, // 休息提醒次数

  icon_title: '', // 添加计划的标题

  alarm_type: 0, // 计划类型

  updatingPlan: {},
  table: {}, // 用于存储每个课程表的单元格的数据

  is_online: false, //设备是否在线

  openid: '',
  device_id: '',
  volume: '', //音量

  sign: {}, // jssdk签名包
  ticket: "", // wx临时票据

  playing_song: {}, //正在播放的歌曲
}
