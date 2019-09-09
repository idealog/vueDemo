<template>
	<div class="wrap">
		<div class="top_bg sp_top">
	        <div class="res_cover cover" v-bind:class="{playing:showPlayer}" @click="controlPlay(item)">
	            <p>
	                <template v-if="item.icon"><img :src="item.icon"/></template>
                    <template v-if="item.audio_pic_url"><img :src="item.audio_pic_url"/></template>
	                <span class="black_cover"></span>
	            </p>
	            <span class="detail_play_pause icon_detail_play_pause" v-bind:class="{pause:showPlayer}"></span>
	        </div>
	        <div class="title">
	            <h3> {{item.title || item.audio_name}} </h3>
	            <p> {{item.nickname || item.audio_tags || item.course}} </p>
	            <p class="description" style="-webkit-box-orient: vertical;"> {{item.description || `暂无歌曲介绍`}} </p>
	        </div>
	        <div class="plco">
                <PlayerProgress :show="showPlayer"  :duration="item.duration" :play_url="item.play_url" :id="item.id" :ceil="ceil" :init_duration_show="hideDuration" @changeProgress="changeProgress" ref="player"></PlayerProgress>
	        </div>
	    </div>
	    <div class="rdpages clearfix">
	        <div class="rdpage1 null" style="font-size:1.5rem">
	        	{{item.lyrics || item.audio_intro || item.description || `暂无歌词`}}
	        </div>
	    </div>
	    <div class="footBtnsBox">
	        <ul class="footBtns show">
	            <li @click.stop="send(item)">
	                <em class="icon_detail_play_on_device"></em>
	                <p style="color:black">点播</p>
	            </li>
	        </ul>
	    </div>
		<Loading :show="showLoading"></Loading>
    </div>
</template>
<script type="text/javascript">
	import '@/assets/css/network'
    import PlayerProgress from '@/components/listen_progress/player'
	import Loading from '@/components/loading/Loading'
	export default {
		name:'SongDetail',
		components: {
	        Loading,
            PlayerProgress
	    },
		data(){
			return {
				list:[],
                item:{
                    icon:'',
                    title:'',
                    nickname:'',
                    description:'',
                    lyrics:''
                },
                fm:{},
                showLoading:false,
                showPlayer:false,
                ceil:'px',
                hideDuration:true
			}
		},

        created(){
            if(this.$route.query.type == 'fm'){
                this.getFM()
            }else{
                this.getDetail(this.$route.query)
            }
        },

        mounted() {
        	let This = this
        	this.$on('changeProgress',This.changeProgress)
        },

        beforeRouterLeave(to,from,next){
            console.log(to)
            next();
        },
        beforeDestroy() {
           // this.$pause()
        },
		methods:{
            send:function(item){
                const song_id = item.id.toString()
                const song_name = item.title
                const song_url = item.play_url
                const category = this.CategoryMode.SINGLE_MUSIC
                const source = 1
                const action = "device_play"
                const play_ctrl = "play"
                const duration = item.duration
                const data = {song_id,song_name,song_url,category,source,action,play_ctrl,duration}
                console.log(data)
                if(!this.isBind()){
                    this.$toast(this.tips["unbind"])
                }else{
                    if(!this.$store.state.device_online_state){
                        this.$toast(this.tips["offline"])
                    }else{
                        this.$toast(this.tips["send"])
                    }
                    this.websocket.sendMessage(data)
                    this.addPushRecord(data)
                }
            },
            transformData:function(item,operate = 1){
                const list = []
                const sequence = item.sequence
                const source = item.source
                const song_name = item.title
                const song_url = item.play_url
                const song_id = item.id + ''
                const album_name = item.album_detail.album_title
                const album_id = item.album_detail.album_id + ''
                const song_icon = item.icon
                const album_icon = item.album_detail.icon
                const category_id = item.album_detail.category
                const data = {sequence,source,song_id,song_name,song_url,album_name,album_id}
                const playlist = [data]
                const sendData = {
                  "action": "device_play",
                  "play_ctrl": "play",
                  "category": this.CategoryMode.ALBUM,
                  sequence,
                  source,
                  song_id,
                  song_name,
                  song_url,
                  "operate": operate,
                  "duration": item.duration,
                  song_icon,
                  album_icon,
                  category_id,
                  album_name,
                  playlist
                }
                return sendData
            },
            getDetail:function(item){
                let host = this.HOST;
                let This = this;
                let param = {
                    song_id:item.song_id,
                    source:item.source
                };
                This.showLoading = true
                this.axios({
                  method:'get',
                  url:host + '/api/v1/qly/song/detail',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                    This.item = response.data.data.data;
                    This.showLoading = false
                });
            },
            // 外部控制播放开关
            controlPlay:function(item){
            	this.showPlayer = !this.showPlayer
            	if(this.showPlayer){
            		this.hideDuration = true
            	}else{
            		this.showDuration = false
            	}
            	//this.showDuration = !this.showDuration
            	if(this.showPlayer){
            		this.$refs.player.play("play") 
            	}else{
            		this.$refs.player.play("pause")
            	}
            },
            // 播放完之后设置相应的标志
            changeProgress(value){
            	this.progress = value
            	if(value === 0 || value >= this.item.duration){
            		this.showPlayer = false
            	}
            },

            getFM: function(){
                let host = this.HOST;
                let This = this;
                let param = {
                };
                This.showLoading = true
                this.axios({
                  method:'get',
                  url:host + '/api/v1/xmly/get_fm',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                    console.log(response.data)
                    This.fm = response.data
                    This.item = response.data
                    This.item['duration'] = This.item['audio_duration']
                    This.item['play_url'] = This.item['audio_url'].replace('http://','https://')
                    This.showLoading = false
                });
            }
		}

	}	
</script>	


<style type="text/css" scoped>
.wrap{
    overflow: hidden;
}
.description{
    color:black;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    background: transparent;
    font-size:1.3rem;
    padding-right: 1rem;
}

.sp_top .plco {
    position: absolute;
    top: 13.5rem; 
    left: 3rem;
    right: 3rem;
    z-index: 100;
   /*  margin-top:.6rem; */
}

.plco .pro .point {
    border: none;
}

.plco .pro .pro_play p {
    background-color: #fff;
} 

.title{
    font-size: 1.5rem;
}



</style>