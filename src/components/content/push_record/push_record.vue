<template>
	<div>
		<div>
			<ul class="base_list">
				<li v-for ="item in list">
					<a class="list_play lbtn" @click.stop = "send(item)"></a>
					<div class="tt">
						 <h3>
						 	{{item.song_name}}
						 </h3>
						 <p>
						 	{{formatTime(item.duration)}}
						 </p>
					</div>
				</li>
			</ul>
		</div>
		<div v-if = "no_data" v-cloak style="margin-bottom:2rem">
       		<h4 style="text-align:center;margin-top:2rem">没有数据了</h4>
        </div>
		<PropellingController v-show="$store.state.show_propelling"></PropellingController>
	</div>
</template>

<script >
	import PropellingController from '@/components/common/propellingController'
	export default{
		name:'PushRecord',
		components:{
			PropellingController
		},
		data(){
			return {
				list:[],
				no_data:''
			}
		},
		created(){
			this.getList()
		},
		methods:{
			getList(){
				this.list = JSON.parse(this.LStorage.getItem("push_record_list"))
				if(this.list.length === 0){
					this.no_data = true
				}
			},
			send(item){
				if(!this.isBind()){
                	this.$toast(this.tips["unbind"])
                }else if(!this.$store.state.device_online_state){
	                this.$toast(this.tips["offline"])
	            }else{
	                this.$toast(this.tips["send"])
	            }
	            const song_name = item["song_name"]
	            const song_id = item["song_id"]
	            const song_url = item["song_url"]
	            const source = item["source"]
	            const category = this.constant.CategoryMode.SINGLE_MUSIC
	            const duration = item["duration"]
	            const action = "device_play"
                const play_ctrl = "play"
	            const data = {
	            	song_id,
	            	song_name,
	            	song_url,
	            	category,
	            	source,
	            	action,
	            	play_ctrl,
	            	duration
	            }
				this.websocket.sendMessage(data)
			}
		}

	}
</script>