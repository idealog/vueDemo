<template>
	<div class="base_list play_most" v-bind:class="{'show': isShow}">  <!--播放排行-->
	        <div class="title">
	            <h1 style="padding-left:1rem">播放排行</h1>
	        </div>
	        <ul id="play_most_list">
                <li v-for="item in list" @click="goSongDetail(item)">
                    <a id="daily_play" class="list_play lbtn" @click.stop="send(item)"  ztoucheclass="normalClick">
                    </a> 
                    <div class="cover">
                        <img style="width:100%" :src="item.icon" />
                    </div> 
                    <div class="tt">
                        <h3> {{item.nickname}}</h3>
                        <p>{{formatTime(item.duration)}}</p>
                    </div> 
                </li>
            </ul>
	  </div>
</template>
<script>
	export default{
		name:'playmost',
		data() {
			return {
                list: [],
                isShow:false
            }
		},
		mounted(){
            this.getPlayMost();
        },
        methods:{
        	getPlayMost:function(){
        		let host = this.HOST;
        		let This = this;
        		let param = {
        			type:2,
        			page:1,
        			limit:3
        		};
        		this.axios({
                  method:'get',
                  url:host + '/api/v1/qly/hot',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                	This.list = [...response.data.data.data];
                    if(response.data.data.data.length === 0){
                        This.isShow = false;
                    }else{
                        This.isShow = true;
                    }
        		});
        	},
            goSongDetail:function(item){
                this.$router.push({path:'/song',query:{"song_id":item.id,'source':item.source}});
            },
            send:function(item){
                console.log(item)
                const action = "device_play"
                const play_ctrl = "play"
                const source = item.source
                const song_id = item.id
                const song_name = item.title
                const song_url = item.play_url
                const duration = item.duration
                const category = this.CategoryMode.SINGLE_MUSIC //单曲
                const sendData = {action,play_ctrl,category,source,song_id,song_name,song_url,duration}               
                if(!this.isBind()){
                    this.$toast(this.tips["unbind"])
                    return
                }
                this.websocket.sendMessage({action,play_ctrl,category,source,song_id,song_name,song_url,duration})
                this.$toast(this.tips["send"])
                this.addPushRecord(sendData)
            }
        }
	}
</script>