<template>
	<div>
		<div>
			<div>
				<ul class="base_list">
					<li class="resli" :class="{'sibs':selected === item && item.category == '0'}" v-for="item,index in list" @click.stop="toggle(item,index)"> 
		                <a  class="list_play lbtn" @click.stop="send(item)"></a> 
		                <div class="tt">
		                	<h3> {{item.song_name}}</h3>
		                	<p>{{formatTime(item.duration)}}</p>
		                </div>
		                <div class="ibs" v-if="item.category == '0'">
		                	<div class="delres" @click.stop="del(item)">
		                		<p class="delete"></p>
		                		<p>删除</p>
		                	</div>
		                </div>
		           </li>
	           </ul>
           </div>
           <div v-if = "no_data" v-cloak>
           		<h4 style="text-align:center;margin-top:2rem">没有数据了</h4>
           </div>
		</div>
		<Loading :show="loading"></Loading>
		<PropellingController v-show="$store.state.show_propelling"></PropellingController>
	</div>	
</template>
<script type="text/javascript">
	import '@/assets/css/base_list'
	import PropellingController from '@/components/common/propellingController'
	import Loading from '@/components/loading/Loading'
	export default {
		name:'LocalMusic',
		components:{
			PropellingController,
			Loading
		},
		data(){
			return {
				list:[
					
				],
				selected:'',
				loading:false,
				no_data:''
			}
		},
		mounted(){
			this.getList()
		},
		methods:{
			toggle:function(item){
				if(!this.selected){
					this.selected = item
				}else{
					this.selected = ''
				}
			},
			del:function(item,index){
				const This = this
				console.log(item)
				let openid = this.$route.query.openid
				if(!openid){
					openid = sessionStorage.getItem("openid")
				}
				const param = {
						action: 'collect_song',
	                    table: 0,
	                    operate: 'remove',
	                    source: item.source,
	                    openid: openid,
	                    song_id: item.song_id,
	                    song_url: item.song_url,
	                    song_name: item.song_name
				}
				this.axios({
					method:'post',
					data:param,
					url:`${This.HOST}/api/v1/music/song/handle`
				}).then(res => {
					console.log(res.data.status)
					if(res.data.status === 0){
						This.list.splice(index,1)
						This.selected = ''
					}
					This.axios({
                        method:'get',
                        url:`${This.HOST}/api/v1/music/delete_single_music`,
                        params:param,
                        responseType:'json'
                    }).then(response => {
                    	console.log(response)
                    })
				})
			},
			getList:function(){
        		let host = this.HOST;
        		let This = this;
        		let param = {
        			category:parseInt(this.$route.query.type),
        			openid:this.$route.query.openid
        		};
        		this.loading = true
        		this.axios({
                  method:'get',
                  url:host + '/api/v1/music/local/list',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                	This.list = response.data.data
                	for(let i = 0 ; i < This.list.length; i++){
                		This.list[i]["sequence"] = i
                		This.list[i] = This.transformData(This.list[i],1)
                	}
                	This.loading = false
                	if(This.list.length === 0){
                		This.no_data = true
                	}
        		});
			},
			send:function(item){
				let operate = 0
	            const _ = this
	            let sendData = item
	            sendData["operate"] = operate
	            //判断是否绑定了
	            if(!this.isBind()){
	                this.$toast(this.tips["unbind"])
	                return
	            }
	            this.websocket.sendMessage(sendData) //推送数据
	            if(!this.$store.state.device_online_state){
	                this.$toast(this.tips["offline"])
	            }else{
	                this.$toast(this.tips["send"])
	            }
	            this.addPushRecord(sendData) // 添加推送记录
	            this.$store.dispatch('CHNAGE_PLAY_LIST',this.list) // 保存推送的列表数据 ， 如果用户刷新了页面 保存至sessionStorage中去 后面进行处理
	            this.LStorage.setItem('play_list',JSON.stringify(this.list))
	            //console.log(this.$store.state.play_list)
	            this.$store.dispatch('CHANGE_PLAY_MODE', this.$route.query.type) // 改变播放模式 为本地播放模式
			},
			transformData:function(item,operate = 1){
				console.log(item)
	            const list = []
	            const sequence = item.sequence
	            const source = item.source
	            const song_name = item.song_name
	            const song_url = item.song_local_path === ''?item.song_url : item.song_local_path
	            const song_id = item.song_id
	            const album_name = item.album_name
	            const album_id = item.album_id
	            const song_icon = item.icon
	            const album_icon = item.album_icon
	            const category_id = item.category
	            const data = {sequence,source,song_id,song_name,song_url,album_name,album_id}
	            const playlist = [data]
	            const sendData = {
	              "action": "device_play",
	              "play_ctrl": "play",
	              "category": parseInt(category_id),
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
	            console.log(sendData)
	            return sendData
	        }
		}
	}
</script>