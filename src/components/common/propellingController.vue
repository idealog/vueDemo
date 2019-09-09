<template>
	<div> 
	    <div class="foot_box" v-bind:class="{offline:!$store.state.device_online_state}" @click="showCtrlDialog()" style="visibility:visible;">
	        <div class="foot">
	            <div class="line bgk" v-bind:style="{width:`${$store.state.player_progress}%`}"></div>
	            <div class="ficon lr">
	                <a  class="play" v-bind:class="{pause:$store.state.state_player.status == 2 || $store.state.state_player.status == 3 }" @click.stop="playOrPause()"></a>
	                <a  class="next" @click.stop="playNext()"></a>
	                <a  class="plist" @click.stop="showPlayList()"></a>
	            </div>
	            <div class="fsh lf">
	                <img src="../../../../images_new/default_head.png"/>
	            </div>
	            <div class="ftitle">
	                <h3 style="height:2.2rem;overflow:hidden">
	                    <span>{{$store.state.state_player.song_name}}</span>
	                </h3>
	                <p>{{$store.state.state_player.album_name ||$store.state.device_state.status}}</p>
	            </div>
	        </div>
	        <img src="../../../../images_new/default_head.png"
	             style="visibility:hidden;width:0px;height:0px;"/>
	    </div>
	    <div class="ctrl_dialog autoHeight" v-bind:class="{show:show, '':!show}" >
	        <div class="ctl_wd" style="margin-bottom:2rem;position:relative">
	            <div class="ctl_title">
	                <h3>{{$store.state.state_player.song_name}}</h3>
	                <a class="cd_close lf close middleicon" @click="hide()"></a>
	                <!-- <a  class="battery" @click.stop="showBattery()">
	                    <span v-bind:style="{background: `url(${HOST}/images/battery_normal_level${$store.state.battery}.png) center center no-repeat`}"></span>
	                    <em></em>
	                </a> -->
	            </div>
	            <!--加入轮播-->
	           <div>
		            <component :is="carousel"  :indicators="false" :auto="0" style="height: 0px; padding-bottom: 75%; overflow:hidden;" ref="carousel">
						<div class="robot_div" v-for ="item,index in robot_div">
			            	<img src="../../../../images_new/default_head.png" style="width:30vh;height:30vh;margin-top:6vh;" v-if="item.is_pic" />
			            	<p v-if="item.content">{{item.content || lyrics}}</p>
			            </div>
		            </component>
	           </div>
	        </div>
	        <div style="clear:both;display:block"></div>
	        <div >
		        <div class="ctl_btns">
		            <ul class="cnbox clearfix">
		                <li class="light" v-bind:class="{on:$store.state.led == '1'}" @click.stop="controllLight()"></li>
		                <!--<li style="display:none"></li>-->
		                <li class="sleep" @click.stop="setSleepTime()"></li>
		                <li class="lock" v-bind:class="{on:$store.state.childlock}" @click.stop="setLock()"></li>
		                <li class="like" :class="{yes:$store.state.state_player.collect_status}" @click.stop="collect()"></li>
		            </ul>
		        </div>
		        <div class="play_progress clearfix">
		            <a>{{formatTime($store.state.player_count)}}</a>
		            <div class="progress">
		                <div>
		                    <p v-bind:style="{width:`${$store.state.player_progress}%`}"></p>
		                </div>
		            </div>
		            <a>{{formatTime($store.state.state_player.song_duration)}}</a>
		        </div>
		        <div class="ctl_play">
		            <a  class="mode" v-bind:class="{mode1: $store.state.play_mode == 1,mode2: $store.state.play_mode==2,mode3: $store.state.play_mode == 3,mode4:$store.state.play_mode == 4 }"  @click.stop="changeModel()"></a>
		            <a  class="prev" @click.stop="playPrev()"></a>
		            <a  :class="{pause:$store.state.state_player.status == 2,play:$store.state.state_player.status != 2}" @click.stop="playOrPause()"></a> 
		            <a  class="next" @click.stop="playNext()"></a>
		            <a  class="plist" @click.stop="showPlayList()"></a>
		        </div>
		     </div>
	    </div>
	    <component :is="pop_component" v-on:finish="finish" v-on:cancel="cancel" :title="pop_title" :content="pop_content" :is_list="is_list" :is_capacity="is_capacity" :list="list" :type="type"  :item_key="key" :tips="tips" :capacity="capacity" :selected_item="selected_item" :ceil="ceil" @change_selected="change_selected">
        </component>
	</div>
</template>
<script>
	import Pop from '@/components/pop/Pop'
	import Pop_Bottom from '@/components/pop/Pop_Bottom'
	import Pop_List from '@/components/pop/Pop_List'
	import Banner from '@/components/banner/Banner'

	import carousel from '@/components/carousel/index.js'
	export default {
		components:{
			Pop,
			Pop_Bottom,
			Pop_List,
			Banner,
			carousel
		},
		data(){
	        return {
	           show:false,
	           pop_component:null,
	           pop_title:'',
	           pop_content:'',
	           is_list:false,
	           list:[],
	           content_component:'',
	           type:'bottom', //如果是defaut 表示从底部弹框   center 从中间   bottom 从底部弹框,
	           key:'',
	           is_capacity:false,
	           tips:'',
	           capacity:'',
	           ceil:'',
	           collected: false,
	           banner:`${this.HOST}/images/banner.png`,
	           count:0,
	           timer:'',
	           progress:0,
	           timer:'',
	           count:0,
	           selected_item:'',
	           setlock:'',
	           setcollect:'',
	           setlight:'',
	           carousel:'',
	           lyrics:'',
	           robot_div:[
	           		{
	           			is_pic:true	
	           		},{
	           			is_pic:false,
	           			content:'暂无歌词'
	           		}	
	           ]
		    }
		},
	    mounted(){
	    	const This = this
	    	setTimeout(function(){
	    		This.carousel = "carousel"
	    	},300)
            this.init()
            //console.log(this.$store.state.player_progress)
           // this.setProgress()
            //console.log(this.$store.state.player)
	    },
	    deactivated(){
	    	console.log('deactivated')
	    	this.show = false
	    },
	    destroy(){
	    	console.log('destroy')
	    	this.show = false
	    },
	    methods:{
	    	getLyric:function(){
	    		const This = this
	    		this.axios({
	    			method:'get',
	    			params:{
	    				song_id:This.$store.state.state_player.song_id,
	    				source:This.$store.state.state_player.source
	    			},
	    			url:`${This.HOST}/api/v1/qly/song/detail`
	    		}).then(res => {
	    			console.log(res.data.data.data)
	    			if(res.data && res.data.data && res.data.data.data){
	    				This.lyrics = res.data.data.data.lyrics
	    			}
	    		})
	    	},
	    	setProgress(){
	    		const This = this
	    		clearTimeout(this.timer)
	    		this.timer = setTimeout(function(){
	    			if(!This.count){
	    				This.count = This.$store.state.state_player.song_position
	    			}
	    			if(This.$store.state.device_online_state && This.$store.state.state_player.status !== 1){
		    			if(This.count < This.$store.state.state_player.song_duration){
		    				This.progress = This.count * 100 / This.$store.state.state_player.song_duration
		    				This.count += 2 
		    			}else{
		    				This.count = 0
		    			}	
	    			}
	    			This.setProgress()
	    		},2000)
	    	},
	    	checkProgress(){
	    		const This = this
	    	},
	    	init(){
	    		console.log(1)
	    		this.isAdded()
	    	},
	    	isAdded(){
	    		let This = this
	            console.log(this.$store.state.state_player)
	            if(!this.$store.state.state_player["song_id"]){
	            	return
	            }
	            let param = {
	                openid: This.$route.query.openid,
	                song_id: this.$store.state.state_player.song_id,
	                source: this.$store.state.state_player.source,
	                //category: this.$store.state.state_player.album_detail.category,
	                table: 0 //代表收藏那张表
	            }
	            this.axios({
	                method:'get',
	                param: param,
	                url: This.HOST + '/api/v1/music/song/is_added'
	            }).then(res => {
	                if(res.data.data.collect_status){
	                    This.collect_status = res.data.data.collect_status

	                }
	            })
	    	},
	        hide(){
	            this.show = false
	        },
	        //显示整个面板
	        showCtrlDialog(){
	        	//添加 状态控制
	        	//console.log(this.$store.state.device_online_state)
	            if(this.$store.state.device_online_state)
	            {
	                this.show = true
	                this.getLyric()
	            }
	        },
	        // 显示歌曲列表
	        showPlayList(){
	        	const CategoryMode = this.constant.CategoryMode
	        	if(!this.$store.state.device_online_state){
	        		return
	        	}
	        	console.log("showPlayList")
	        	this.init()
	        	console.log(this.tips)
	        	this.pop_component = "Pop_Bottom"
	        	const list_type = this.$store.state.state_player.list_type
	        	console.log(this.$store.state.state_player.voice_type)
	        	console.log(this.constant.PlayerStatus.STOP)
	        	if(list_type == null){
	        		this.pop_title= "还没有播放歌曲"
	        		this.is_list = false
	        		this.type = "bottom"
	        		this.pop_content = "你可以播放设备上的歌曲或者从公众号推送歌曲到设备" //切换播放专辑
	        	}
	        	if(list_type === CategoryMode.SINGLE_MUSIC){
	        		this.pop_title= "随便听听"
	        		this.is_list = false
	        		this.type = "bottom"
	        		this.pop_content = "推送专辑歌曲换到列表模式" //切换播放专辑
	        	}
	        	if(list_type === CategoryMode.ALBUM){
	        		this.pop_title= this.$store.state.state_player.album_name
	        		console.log(this.$store.state.play_list)
	        		//this.pop_title= "歌曲列表显示demo" //专辑标题
		        	this.type = "bottom"
		        	this.is_list = true
		        	this.list= this.$store.state.play_list //专辑列表
		        	this.key = "song_name"
		        	for (let i = 0;i< this.$store.state.play_list.length;i++){
		        		if(this.$store.state.play_list[i].song_id === this.$store.state.state_player.song_id){
		        			this.selected_item = this.$store.state.play_list[i]
		        			//this.pop_title = this.$store.state.play_list[i].album_name
		        		}
		        	}
	        	}
	        	if(list_type && this.$store.state.state_player.status === this.constant.PlayerStatus.STOP){
					this.pop_title= "还没有播放歌曲"
	        		this.is_list = false
	        		this.type = "bottom"
	        		this.pop_content = "你可以播放设备上的歌曲或者从公众号推送歌曲到设备" //切换播放专辑
	        	}
	        	//儿歌 故事 国学 英语 本地音乐
	        	const type = ['收藏','欢乐儿歌','国学经典','童话故事','启蒙英语']
	        	if(this.$store.state.state_player.voice_type === this.constant.VoiceType.PLAY_LOCAL  || list_type === CategoryMode.HAPPY_SONG || list_type === CategoryMode.CLASSICS_CHINESE || list_type === CategoryMode.FAIRY_TALES || list_type === CategoryMode.ENLIGHTEN_ENGLISH){
	        		if(this.$store.state.play_list.length > 0){
	        			this.pop_title = type[parseInt(this.$store.state.play_list[0].category)]
	        		}else{
	        			this.pop_title = "本地音乐"
	        		}
		        	this.type = "bottom"
		        	this.is_list = true
		        	this.list= this.$store.state.play_list //本地音乐列表
		        	this.key = "song_name"
	        	}
	        },
	        // 推送上一曲
	        playPrev(){
	        	if(!this.$store.state.device_online_state){
	        		return
	        	}
	        	const sendData = {
                    "action": "device_play",
                    "play_ctrl": "ctrl",
                    "music_state": "prev"
                }
                this.websocket.sendMessage(sendData)
	        },
	        // 推送下一曲
	        playNext(){
	        	if(!this.$store.state.device_online_state){
	        		return
	        	}
	        	const sendData = {
                    "action": "device_play",
                    "play_ctrl": "ctrl",
                    "music_state": "next"
                }
                this.websocket.sendMessage(sendData)
	        },
	        // 播放或者暂停
	        playOrPause(){
	        	if(!this.$store.state.device_online_state){
	        		return
	        	}
	        	const status = this.$store.state.state_player.status
	        	let next_status
	        	if(status == 2){
	        		next_status = `pause`
	        		this.$store.state.state_player.status = 1
	        	}else{
	        		next_status = `play`
	        		this.$store.state.state_player.status = 2
	        	}
	        	const sendData = {
                    "action": "device_play",
                    "play_ctrl": "ctrl",
                    "music_state": `${next_status}`
                };
                this.websocket.sendMessage(sendData)
	        },
	        // 切换播放模式
	        changeModel(){
	        	if(!this.$store.state.device_online_state){
	        		return
	        	}
	        	this.init()
	        	this.pop_component = "Pop_Bottom"
	        	this.pop_title = "循环方式"
	        	this.type = "bottom"
	        	this.list= [
	        		{
	        			value:'单曲循环',
	        			id:0,
	        			tag:'mode',
	        			name:'repeat'
	        		},{
	        			value:'顺序播放',
	        			id:1,
	        			tag:'mode',
	        			name:'order'
	        		},{
	        			value:'列表循环',
	        			id:2,
	        			tag:'mode',
	        			name:'loop'
	        		},{
	        			value:'随机播放',
	        			id:3,
	        			tag:'mode',
	        			name:'radom'
	        		}
	        	]
	        	const mode = this.$store.state.state_player.mode
	        	if(!isNaN(mode)){
	        		this.selected_item = this.list[mode]
	        	}
	        	console.log(this.selected_item)
	        	this.key = 'value'
	        	this.is_list = true
	        },
	        // 控制灯
	        controllLight(){
	        	if(!this.$store.state.device_online_state){
	        		return
	        	}
	        	console.log("controllLight")
	        	this.init()
	        	this.pop_component = "Pop_Bottom"
	        	this.pop_title = "眼灯开关"
	        	this.pop_content = this.$store.state.led == '1' ? "你确定要关闭眼灯吗？" : "你确定要打开眼灯吗？"
	        	this.type = "bottom"
	        	this.list= []
	        	this.is_list = false
	        	this.setlight = true

	        },
	        // 设置睡眠时间
	        setSleepTime(){
	        	if(!this.$store.state.device_online_state){
	        		return
	        	}
	        	console.log("setSleepTime")
	        	this.init()
	        	this.pop_component = "Pop_Bottom"
	        	this.pop_title = "自动休眠"
	        	this.type = "bottom"
	        	this.list= [
	        		{	
	        			id:0,
	        			value:'不睡眠',
	        			sleep_rest_time: 0,
	        			tag:'sleep_time'
	        		},{
	        			id:1,
	        			value:'10分钟',
	        			sleep_rest_time: 10,
	        			tag:'sleep_time'
	        		},{
	        			id:2,
	        			value:'20分钟',
	        			sleep_rest_time: 20,
	        			tag:'sleep_time'
	        		},{
	        			id:3,
	        			value:'30分钟',
	        			sleep_rest_time: 30,
	        			tag:'sleep_time'
	        		},{
	        			id:4,
	        			value:'60分钟',
	        			sleep_rest_time: 60,
	        			tag:'sleep_time'
	        		}
	        	]
	        	this.key = 'value'
	        	this.is_list = true
	        	const sleep_rest_time = this.$store.state.sleep_time
	        	console.log(sleep_rest_time)
	        	const _ = this
	        	this.list.map((item) =>{
	        		if(item.sleep_rest_time === sleep_rest_time){
	        			_.selected_item = item
	        		}
	        	})
	        },
	        // 设置童锁
	        setLock(){
	        	if(!this.$store.state.device_online_state){
	        		return
	        	}
	        	console.log("setLock")
	        	this.init()
	        	this.pop_component = "Pop_Bottom"
	        	this.pop_title = "设置童锁"
	        	this.pop_content = this.$store.state.childlock ? "确认关闭童锁吗":"确认开启童锁吗"
	        	this.type = "bottom"
	        	this.setlock = true
	        	//this.finish = this.lock
	        },
	        lock(){
	        	let childlock 
	        	if(this.$store.state.childlock){
	        		childlock = "off"
	        	}else{
	        		childlock = "on"
	        	}
	        	const sendData = {
					"action": "device_ctrl",
	                "ctrl_type": 4,
	                "childlock":childlock
				}
				this.$store.state.childlock = this.$store.state.childlock == 0 ? 1 : 0
				this.pop_component = null
				this.finish = this.finish
				this.setlock = false
				this.websocket.sendMessage(sendData)
	        },
	        // 收藏
	        collect(){
	        	console.log("collect")
	        	this.init()
	        	this.pop_component = "Pop_Bottom"
	        	this.pop_title = "收藏"
	        	this.pop_content = !this.$store.state.state_player.collect_status ?  "确认要收藏吗" : "确认取消收藏吗"
	        	this.type = "bottom"
	        	this.is_list =  false
	        	//this.finish = this.add
	        	this.list = []
	        	this.setcollect = true
	        },
	        add(){
	        	let openid
	        	console.log('添加收藏')
	        	this.init()
	        	let This = this
	            console.log(this.$store.state.state_player)
	            if(!this.$store.state.state_player["song_id"]){
	            	return
	            }
	            if(sessionStorage.getItem("openid")){
	            	openid = sessionStorage.getItem("openid")
	            }
	            let db_url = This.HOST + '/api/v1/music/song/handle'
	            let ws_url
	            let param = {
	                table:0,
	                source:this.$store.state.state_player.source,
	                song_id:this.$store.state.state_player.song_id,
	                openid:openid,
	                song_local_path:'',
	                song_url:this.$store.state.state_player.song_url,
	                song_name:this.$store.state.state_player.song_name,
	                song_duration:this.$store.state.state_player.song_duration,
	                album_name:this.$store.state.state_player.album_name,
	                song_icon:this.$store.state.state_player.song_icon,
	                album_icon:this.$store.state.state_player.album_icon,
	                album_id:this.$store.state.state_player.album_id,
	            }
	            if(!this.$store.state.state_player.collect_status){
	                param.operate = 'add'
	                ws_url = This.HOST + '/api/v1/music/download_single_music'
	            }else{
	                param.operate = 'delete'
	                ws_url = This.HOST + '/api/v1/music/delete_single_music'
	            }
	            This.axios({
	                    method:'post',
	                    url:db_url,
	                    data:param,
	                    responseType:'json'
                }).then(res =>{
                     This.axios({
                        method:'get',
                        url:ws_url,
                        params:param,
                        responseType:'json'
                     }).then(response => {
                        console.log(response)
                        This.pop_component = null
                        This.setcollect = false
                     })
                })
	        },
	        // 显示电量
	        showBattery(){
	        	/*console.log("showBattery")
	        	this.init()
	        	this.pop_component = "Pop_Bottom"
	        	this.pop_title = "电量详情"
	        	this.type = "center"
	        	this.is_capacity = true
	        	this.capacity = `${this.$store.state.battery*100/5}%`  
	        	this.ceil =`小时`
	        	this.tips = "预计还可以使用"*/
	        },
	        finish() {
	        	if(!this.$store.state.device_online_state){
	        		this.$toast("设备离线")
	        		return
	        	}
	        	if(this.setlock){
	        	 	this.lock()
	        	 	return
	        	}
	        	if(this.setcollect){
	        		this.add()
	        		return
	        	}
	        	if(this.setlight){
	        		let status
	        		if(this.$store.state.led == '1'){
	        			status = "off"
	        			this.$store.state.led = 0
	        		}else{
	        			status = "on"
	        			this.$store.state.led = 1
	        		}
	        		const sendData = {
		                action: "device_ctrl",
		                ctrl_type: 1,
		                led: status
		            };
		            this.websocket.sendMessage(sendData)
		            this.setlight = false
	        	}
	        	if(this.selected_item){
	        		let sendData = this.selected_item
	        		if(sendData["song_url"]){
	        			sendData["operate"] = 0
	        			if(this.$store.state.state_player.song_url !== sendData.song_url){
	        				this.$store.state.player = sendData
	        				this.websocket.sendMessage(sendData)
	        			}
	        		}
	        		if(sendData["tag"] && sendData["tag"] === "mode"){
	        			sendData = {
                            action: "device_play",
                            play_ctrl: "ctrl",
                            play_mode: sendData.name
                        };
                        this.$store.state.play_mode = this.selected_item.id
                        this.websocket.sendMessage(sendData)
	        		}
	        		if(sendData["tag"] && sendData["tag"] === "sleep_time"){
	        			sendData = {
                            action: "device_set",
                            set_type: 4,
                            sleep_time: sendData.sleep_rest_time
                        };
                        this.$store.state.sleep_time = this.selected_item.sleep_rest_time
                        this.websocket.sendMessage(sendData)
	        		}
	        	}
            	this.init()
        	},
        	cancel:function(){
        		this.finish = this.finish
				this.pop_component = null
			},
        	init() {
        		this.pop_component = null
	            this.pop_title = ''
	            this.pop_content = ''
	            this.is_list = false
	            this.list = []
	            this.content_component = ''
	            this.type = 'bottom'
	            this.key = ''
	            this.is_capacity = false,
	            this.tips = ''
	            this.capacity = ''
	            this.ceil = ''

	            this.setlock = '',
	            this.setcollect = '',
	            this.setlight = ''
        	},
        	change_selected(value) {
        		this.selected_item = value
        	}
	}
}
</script>

<style type="text/css" scoped>
/* .ctrl_dialog {
    position: fixed;
    z-index: 1000;
    top: 100%;
    width: 100%;
    height: 100%;
    background-color: #fff;
    transition: transform 500ms;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    min-width: 320px;
    -webkit-transform: translateY(10%);
}	 */

/* .battery span {
    background: url(../../../../images_new/battery_normal_level3.png) center center no-repeat;
} */

.battery_pop div p {
    width: 100%;
    height: 100%;
    background-color: #ddd;
    transition: all 1000ms linear;
}

.line{
	height: 0.3rem;
    margin-top: -0.15rem;
}

.cnbox .yes {
    background: url(../../../../images_new/list_like_yes.png) center center no-repeat;
    background-size: 60%;
}

.robot_div{
	/* width: 100%; */
	height: 100%;
	text-align:center;
	background:white;
	/* border-bottom:1rem solid #ffffff; */
	/* position:relative; */
}

.robot_div p {
	height: 100%;
	padding-top:.5rem;
	background:#7ED2A9;
	overflow: hidden;
	white-space: normal;
	text-indent: 2em;
	padding: 0 1rem;
}



.progress div {
       height: 2px;
       background-color: #e5e5e5;
       border-radius: 1px;
       overflow: hidden;
       position: relative;
       top: 2rem;
       margin-top: -1px;
   }

     .progress div p {
        background-color: #4dcb9b;
        height: 2px;
    }

    .progress a {
        width: 3rem;
        height: 3rem;
        position: relative;
        margin-top: -1px;
        padding: 0.5rem;
        display: block;
        margin-left: -1.5rem;
        top: 0.5rem;
    }

    .progress a:before {
        content: "";
        width: 100%;
        height: 100%;
        display: block;
        background-color: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        border-radius: 50%;
    }

    .play_progress {
        height: 2rem;
        text-align: center;
    }

    .offline .play_progress {
        opacity: 0.38;
    }

    .play_progress a {
        display: inline-block;
        line-height: 2rem;
        color: #7f7f7f;
    }

    .play_progress .progress {
        display: inline-block;
        vertical-align: middle;
        width: 66%;
        margin: 0 0.5rem;
    }

    .play_progress .progress div {
        top: 0rem;
    }

/* .carousel-itemP{
	height:25rem;
}
 */
</style>