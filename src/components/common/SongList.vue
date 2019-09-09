<template>
	<div>
		<div class="base_list" v-infinite-scroll="getList" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
			<div><SongItem v-for="item,index in list" :key="index" :song-item="item" ></SongItem></div>
			<Loading :show="loading"></Loading>
		</div>
		<div v-if = "no_data" v-cloak style="margin-bottom:2rem">
       		<h4 style="text-align:center;margin-top:2rem">没有数据了</h4>
       </div>
		<PropellingController v-show="$store.state.show_propelling"></PropellingController>
	</div>
</template>
<script>
	import '@/assets/css/base_list'
	import "@/assets/css/network"
	import SongItem from  '@/components/common/SongItem'
	import Loading from '@/components/loading/Loading'
	import PropellingController from '@/components/common/propellingController'
	export default {
	    //name: 'SongList',
	    components: {
	        SongItem,
	        Loading,
	        PropellingController
	    },
	   	data() {
	        return {
	            list: [],
	           	album_id:'',
	           	page:1,
	           	haveMore:true,
	           	resource_url:'',
	           	loading:false,
	           	no_data:'',
	           	resource_type:'',
	           	album_id:'',
	           	source:'',
	           	category:'',
	           	_id:''
	        }
	    },
	    created(){
	    	this.getCategory()
	    	this.getResourceList()
	    },
	    activated(){
	    	this.loading = false
	    	if(this.album_id != this.$route.query.album_id || this.resource_type != this.$route.query.resource_type || this.source != this.$route.query.source || this.category != this.$route.query.category || this._id != this.$route.query._id){
	    		this.init()
	    	}
	    },
	    deactivated(){
	    	this.loading = true
	    	console.log('songlist deactivated')
	    },
	    /*beforeRouteLeave(to,from,next){
	    	if(to.name === "Album"){
	    		to.meta.keepAlive = true
	    		from.meta.keepAlive = false
	    	}
	    	next()
	    },*/
	    methods:{
	    	init(){
	    		this.list = []
	    		this.album_id = ''
	    		this.page = 1
	    		this.haveMore = true
	    		this.resource_url = ''
	    		this.resource_type = ''
	    		this.loading = false
	    		this.source = ''
	    		this.category = ''
	    		this.no_data = ''
	    		this.getCategory()
	    		this.getResourceList()
	    	},
	    	getCategory(){
	    		this.resource_type = this.$route.query.resource_type
	    		this.album_id = this.$route.query.album_id
	    		this.source = this.$route.query.source
	    		this.category = this.$route.query.category
	    		this._id = this.$route.query._id
	    	},
	    	getResourceList(){
	    		if(!this.$store.state.show_propelling){
		    		let device_info = JSON.parse(sessionStorage.getItem('device_info'))
			    	if(!device_info.status){
			    		this.websocket.init(sessionStorage.getItem('openid'))
			    	}
		    	}
		    	switch(parseInt(this.resource_type)){
		    		case 1:
		    			this.resource_url = this.HOST + '/api/v1/qly/song/list'
		    			//this.album_id = this.album_id;
		    			break
		    		case 2:
		    			//this.resource_url = this.PUBLIC_HOST + 'api/textbook/audio/list'
		    			//this.resource_url = 'http://120.79.11.95:3000/cocheer/textbookCurriculums'
		    			this.resource_url = this.HOST + '/api/v1/textbook/song'
		    			break
		    		case 3:
		    			this.resource_url = this.HOST + '/api/v1/xmly/songlist_xmly'
		    			//this.album_id = this.album_id;
		    			break
		    		case 4:
		    			this.resource_url = this.HOST + '/api/v1/xmly/songlist_xmly'
		    			//this.album_id = this.album_id;
		    			break
		    	}
		    	this.getList();
	    	},
	    	getList:function(){
	    		const temp_page  = this.page
	    		const THIS = this
	    		const HOST = this.HOST
	    		let param = this.$route.query
	    		if(this.$store.state.openid){
	    			param['openid'] = this.$store.state.openid
	    		}else{
	    			param['openid'] = sessionStorage.getItem('openid')
	    		}
	    		param['page'] = this.page ++ ;
	    		if(!THIS.haveMore){
	    			return;
	    		}
	    		THIS.loading = true;
	    		THIS.axios({
	    			method:'get',
                 	url:THIS.resource_url,
                  	params:param,
                  	responseType:'json'
	    		}).then(res =>{
	    			let result = res.data
	    			let list = []
	    			// 4 公共后台现在加入的是喜马拉雅资源 和 3运营平台的启蒙内容 一样 后面可能不一样  同步教材category 默认为6
	    			switch(parseInt(THIS.$route.query.resource_type)){
	    				case 1:
	    					list = result.data.data
	    					break
	    				case 2:
	    					list = result.data
	    					list.map(item => {
	    						item.id = item.audio_id
	    						item.icon = item.audio_pic_url.replace('http://','https://')
	    						item.play_url = item.audio_url
	    						item.duration = item.audio_duration
	    						item.album_detail = item.album
	    						item.song_id = item.audio_id
	    						item.title = item.audio_name
	    						item.album_detail = {
	    							"album_title":item.course,
	    							"icon":item.audio_pic_url.replace('http://','https://'),
	    							"album_id":item.album_id,
	    							category:6
	    						}
	    					})
	    					break
	    				case 3:
	    					list = result.tracks
	    					list.map(item => {
	    						item.icon = item.cover_url_small.replace('http://','https://')
	    						item.title = item.track_title
	    						item.play_url = item.play_url_64
	    						item.album_detail = {
	    							"album_title":result.album_title,
	    							"album_id":result.album_id,
	    							"album_intro":result.album_intro,
	    							"icon":result.cover_url_small,
	    							"category":result.category_id
	    						}
	    					})
	    					break
	    				case 4:
	    					if(result && result.tracks){
	    						list = result.tracks
	    						list.map(item => {
		    						item.icon = item.cover_url_small.replace('http://','https://')
		    						item.title = item.track_title
		    						item.play_url = item.play_url_64
		    						item.album_detail = {
		    							"album_title":result.album_title,
		    							"album_id":result.album_id,
		    							"album_intro":result.album_intro,
		    							"icon":result.cover_url_small,
		    							"category":result.category_id
		    						}
		    					})
	    					}
	    					break
	    			}
	    			if(list && !list.length){
	    				THIS.no_data = true
	    				THIS.haveMore = false
	    			}else{
	    				THIS.no_data = false
	    				for(let i=0;i<list.length;i++){
	    					list[i].sequence = i + (temp_page-1) * list.length
			              	list[i] = THIS.transformData(list[i],1)
			            }
			            THIS.list = [...THIS.list,...list]
	    				THIS.page
	    			}
	    			if(THIS.list.length === 0){
	    				THIS.no_data = true
	    			}
	    			THIS.loading = false
	    		})
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
	        }
	    }
	}

</script>
