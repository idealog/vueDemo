<template>
	<div>
		<div class="choose">
			<input type="text" v-model="province" placeholder="选择省(直辖市)" readonly="true" style="font-size:1.5rem" @click.stop="getProvince()" />
			<input type="text" v-model="city" placeholder="选择市(县)" readonly="true" @click.stop="getCity()" style="border-left:1px solid rgb(233,233,233);font-size:1.5rem" />
		</div>	
		<div >
			<div>
				<ul class="base_list" v-infinite-scroll="getList" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
					<li class="resourceLi" v-for="item in list" > 
		                <a  class="list_play lbtn" @click.stop="send(item)"></a> 
		                <div>
		                	<h3> {{item.radio_name}}</h3>
		                </div>
		           </li>
	           </ul>
           </div>
			<!--加载动画-->
			<Loading :show="loading"></Loading>
		</div>
		<component :is="pop_component" v-on:finish="finish"  v-on:cancel="cancel" v-on:change_selected="get_selected" :title="pop_title" :selected_item="selected" :content="pop_content" :is_list="is_list" :is_capacity="is_capacity" :list="pop_list" :type="type"  :item_key="key" :tips="tips" :capacity="capacity" :ceil="ceil"></component>

		<PropellingController v-show="$store.state.show_propelling"></PropellingController>
	</div>
</template>
<script type="text/javascript">
	import '@/assets/css/base_list'
	import "@/assets/css/network"
	import SongItem from '@/components/common/SongItem'
	import PopBottom from '@/components/pop/Pop_Bottom'
	import Loading from '@/components/loading/Loading'
	import PropellingController from '@/components/common/propellingController'
	export default {
		//name:'Radio',
		components:{
			SongItem,
			PopBottom,
			Loading,
			PropellingController
		},
		data(){
			return {
				province_list:[],
				city_list:[],
				list:[],
				province_code:'',
				city_code:'',
				pop_component:null,
	            pop_title:'',
	            pop_content:'',
	            is_list:false,
	            type:'bottom', //如果是defaut 表示从底部弹框   center 从中间   bottom 从底部弹框,
	            key:'',
	            is_capacity:false,
	            tips:'',
	            capacity:'',
	            ceil:'',
	            pop_list:[],
	            selected:'',
	            province:'',
	            city:'',
	            loading: false,
	            page:1,
	            haveMore:true,
	            is_update:false
			}
		},
		mounted(){
			this.initWs()
			this.getProvince()
			/*if(this.province_list === []){
				this.getProvince()
			}*/
		},
		methods:{
			getList(){
				let This = this
				if(This.is_update){
					let url = This.HOST + '/api/v1/xmly/live/radio'
					let openid = This.$store.state.openid
					if(!openid){
						openid = sessionStorage.getItem('openid')
					}
					if(!This.haveMore){
						return
					}
					This.loading = true
					This.axios({
		    			method:'get',
	                 	url:url,
	                  	params:{
	                  		openid:openid,
	                  		city_code:This.city_code,
	                  		page:This.page++
	                  	},
	                  	responseType:'json'
		    		}).then(res =>{
		    			console.log(res.data.radios)
		    			if(res.data.radios.length === 0){
		    				This.haveMore = false
		    			}
		    			This.list = [...This.list,...res.data.radios]
		    			This.loading = false
		    		})
				}
			},
			getProvince(){
				let This = this
				if(This.province_list.length > 0){
					This.pop_list = This.province_list
					This.pop_component = 'PopBottom'
					This.key = 'province_name'
					This.is_list = true
					This.type = "bottom"
					This.pop_title = "省市列表"
					return
				}
				let url = This.HOST + '/api/v1/xmly/live/province'
				let openid = This.$store.state.openid
				if(!openid){
					openid = sessionStorage.getItem('openid')
				}
				This.axios({
	    			method:'get',
                 	url:url,
                  	params:{
                  		openid:openid
                  	},
                  	responseType:'json'
	    		}).then(res =>{
	    			console.log(res.data.data)
	    			This.province_list = res.data.data
	    			This.pop_list = res.data.data
	    			This.key = 'province_name'
	    			This.pop_component = 'PopBottom'
					This.is_list = true
					This.type = "bottom"
					This.pop_title = "省市列表"
	    		})
			},
			getCity(){
				let This = this
				if(This.province_code){
					if(This.city_list.length > 0){
						This.pop_list = This.city_list
		    			This.key = 'city_name'
		    			This.pop_component = 'PopBottom'
						This.is_list = true
						This.type = "bottom"
						This.pop_title = "城市列表"
						return
					}
					let url = This.HOST + '/api/v1/xmly/live/city'
					let openid = This.$store.state.openid
					if(!openid){
						openid = sessionStorage.getItem('openid')
					}
					This.axios({
		    			method:'get',
	                 	url:url,
	                  	params:{
	                  		openid:openid,
	                  		province_code:This.province_code
	                  	},
	                  	responseType:'json'
		    		}).then(res =>{
		    			console.log(res)
		    			This.pop_list = res.data.data
		    			This.city_list = res.data.data
		    			This.key = 'city_name'
		    			This.pop_component = 'PopBottom'
						This.is_list = true
						This.type = "bottom"
						This.pop_title = "城市列表"
		    		})
				}
			},
			finish(){
				this.pop_component = null
				let This = this
				if(This.province_code && This.city_code && This.is_update){
					This.haveMore = true
					This.list = []
					This.page = 1
					This.getList()
				}
				if(This.province_code && !This.city_code){
					This.getCity()
				}
			},
			cancel:function(){
				this.pop_component = null
			},
			get_selected(value){
				console.log(value)
				this.selected = value 
				if(value.province_code){
					if(this.province_code != value.province_code){
						this.is_update = true
						this.city = ''
						this.city_code = ''
						this.city_list = []
						this.province = value.province_name
						this.province_code = value.province_code
						//this.getCity()
					}
				}
				else if(value.city_code){
					this.city = value.city_name
					this.city_code = value.city_code
				}
			},
			send(item){
                const song_id = item.id.toString()
                const song_name = item.radio_name
                const song_url = item.rate64_aac_url
                const category = this.CategoryMode.SINGLE_MUSIC
                const source = 1
                const action = "device_play"
                const play_ctrl = "play"
                const duration = 0
                const data = {song_id,song_name,song_url,category,source,action,play_ctrl,duration}
                if(!this.isBind()){
                	this.$toast(this.tips["unbind"])
                }else if(!this.$store.state.device_online_state){
	                this.$toast("设备离线")
	            }else{
	                this.$toast(`正在通知${this.customer}播放电台`)
	            }
                this.websocket.sendMessage(data)
                this.addPushRecord(data)
			}
		}

	}
</script>
<style type="text/css" scoped>
	input{
		border:none;
		outline: medium;
		height: 4rem;
		text-align: center;
		width: 50%;
		float: left;
	}
	.choose{
		border-bottom: 1px solid rgb(233,233,233);
		overflow: hidden;
		height: 4rem;
		position: fixed;
		top:0;
		width: 100%;
	}
	.base_list{
		margin-top:4rem;
	}
	.base_list .tt h3 {
	    /* line-height: 1.4; */
	    float: initial;
	    font-size: 1.5rem;
	    font-weight: normal;
	}


	.base_list .tt {
	    height: 7rem;
	   /*  padding-top: 1.5rem; */
	}
</style>