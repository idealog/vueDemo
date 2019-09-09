// 业务常量设置 写在这个文件中统一管理

const StateType = {
    STATE_NET: 1 << 0,
    STATE_VOL: 1 << 1,
    STATE_LED: 1 << 2,
    STATE_BAT: 1 << 3,
    STATE_CHILDLOCK: 1 << 4,
    STATE_WECHAT: 1 << 5,
    STATE_POWER: 1 << 6,
    STATE_SLEEP: 1 << 7,
    STATE_PLAYER: 1 << 8,
    STATE_REST_SLEEP: 1 << 9,
    STATE_CONNECT: 1 << 10, //增加上线，下线状态
    STATE_VERSION: 1 << 11,
    STATE_OTA: 1 << 12,
    STATE_STORAGE: 1 << 13, //容量状态
    STATE_SONGS: 1 << 14, //音频数量
    STATE_SPEECH_SET: 1 << 15, //语速
    STATE_SDCARD: 1 << 16 //T卡是否可用
};

const allStatusCode =
    StateType.STATE_NET +
    StateType.STATE_VOL +
    StateType.STATE_LED +
    StateType.STATE_BAT +
    StateType.STATE_CHILDLOCK +
    StateType.STATE_WECHAT +
    StateType.STATE_POWER +
    StateType.STATE_SLEEP + 
    StateType.STATE_PLAYER +
    StateType.STATE_REST_SLEEP +
    // StateType.STATE_CONNECT +
    StateType.STATE_VERSION +
    StateType.STATE_OTA +
    StateType.STATE_SPEECH_SET + 
    StateType.STATE_STORAGE +
    StateType.STATE_SONGS;

const VoiceType = {
    PLAY_TONE: 0,
    PLAY_WECHAT: 1,
    PLAY_DRIFT: 2,
    PLAY_AICHAT: 3,
    PLAY_AITONE: 4,
    PLAY_AIVOD: 5, //语音点播的单曲 //随便听听
    PLAY_AIMUSIC: 6, //语音点播的列表 //随便听听
    PLAY_LOCAL: 7, //本地四大分类和宝宝最爱
    PLAY_COLLECT: 8, //随便听听
    PLAY_LIST: 9,
    PLAY_NETVOD: 10, //网络点播的单曲
    PLAY_NETLIST: 11, //网络点播的歌曲列表
    PLAY_FAST: 12,
    PLAY_VOICE: 13,
    PLAY_INVAILD: 14
};

const ListType = {
    LIST_STORY: 0, //故事
    LIST_ENGLISH: 1, //英语
    LIST_SONGS: 2, //儿歌
    LIST_SINOLOGY: 3, //国学
    LIST_WECHAT: 4,
    LIST_COLLECT: 5,
    LIST_LIST: 6,
    LIST_DRIFT: 7,
    LIST_AIMUSIC: 8, //点播
    LIST_NET: 9,
    LIST_CNT: 10,
    LIST_INVALID: 11
};

//设备向服务器请求
const PlayerStatus = {
    STOP: 0, //没播歌
    PAUSE: 1,
    PLAYING: 2,
    NEXT: 3
};

const PlayerMode = {
    REPEAT: 0,
    ORDER: 1,
    LOOP: 2,
    RANDOM: 3
};

const action_type = {
    dianbo : 1,
    shiting: 2,
    collect : 3,
    add: 4,
    prev: 5,
    next: 6
}

//发给设备的category字段
const CategoryMode = {
    HAPPY_SONG: 1, //1 欢乐儿歌
    CLASSICS_CHINESE: 2, //2 国学经典
    FAIRY_TALES: 3, //3 童话故事
    ENLIGHTEN_ENGLISH: 4, //4 启蒙英语
    BABY_FAVOR: 5, //5 宝宝最爱
    ALBUM: 6, //6 ablum
    SINGLE_MUSIC: 7 //7 单曲
};

export default {
    StateType,
    allStatusCode,
    VoiceType,
    ListType,
    PlayerStatus,
    CategoryMode,
    action_type
}
