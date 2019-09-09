<template>
	<div>
		<div ref="album" class="base_list" v-infinite-scroll="getAlbumList" infinite-scroll-disabled="loading" infinite-scroll-distance="10" >
			<ul>
				<AlbumItem v-for = "item,index in list" :key="index" :album-item="item"></AlbumItem>
			</ul>
			<Loading :show="loading"></Loading>
		</div>
		<PropellingController v-show="$store.state.show_propelling"></PropellingController>
	</div>
</template>

<script type="text/javascript">
	import '@/assets/css/base_list'
	import "@/assets/css/network"
	import AlbumItem from '@/components/common/AlbumItem'
	import Loading from '@/components/loading/Loading'
	import PropellingController from '@/components/common/propellingController'
	export default{
		components: {
	        AlbumItem,
	        Loading,
	        PropellingController
	    },
		data(){
			return {
				list:[],
				category:'',
				reourse_url:'',
				page:1,
				haveMore:true,
				loading:false,
				isFirstVisit:true,
				resource_type:'',
				category_id:'',
				tag:'',
				scroll:0
			}
		},
		created(){
			this.isFirstVisit = false
			this.getCategory()
			//this.getAlbumList()
		},
		mounted(){

		},
		activated(){
			this.loading = false
			window.addEventListener('touchend',this.handleScroll)
			if(this.scroll){
				window.scrollTo(0,this.scroll) //记录滚动位置
			}
			if(this.$route.query.resource_type != 2){
				console.log(this.category_id == this.$route.query.category_id)
				if(this.$route.query.category != this.category || this.$route.query.resource_type != this.resource_type || this.$route.query.category_id !=this.category_id || this.$route.query.tag != this.tag){
					this.init()
				}
			}else{
				this.init()
			}
		},
		deactivated(){
			this.loading = true
			this.isFirstVisit = true
			window.removeEventListener('touchend',this.handleScroll)
		},
		methods:{
			handleScroll(){
				let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
  				this.scroll = scrollTop;
			},
			init(){
				this.tag = ''
				this.category_id = ''
				this.resource_type = ''
				this.resource_url = ''
				this.page = 1
				this.loading = false
				this.haveMore = true
				this.list = []
				this.getCategory()
				//this.getAlbumList()
			},
			//从参数获取资源类别信息 1、青莲云资源  2、同步教材 (通用接口，数据结构和其他不一致)  3、喜马拉雅资源 4、公共后台内容 (现在用于公众号内容是喜马拉雅资源)
			getCategory:function(){
				this.tag = this.$route.query.tag
				this.category_id = this.$route.query.category_id
				this.category = this.$route.query.category
				this.resource_type = this.$route.query.resource_type
				if(this.$route.query.resource_type == 2){
					console.log(this.$route.query);
				}
			},
			getAlbumList:function(){
				let host = this.HOST
				let result_callback
                let This = this
                let param = {
                    page:This.page++,
                    limit:10,
                    category:This.category
                }
                switch(parseInt(this.$route.query.resource_type)){
                	case 1:
                		this.reourse_url = this.HOST + '/api/v1/qly/album'
                		Object.assign(param,{
                			source:1
                		})
                		break;
                	case 2:
                		//this.reourse_url = this.PUBLIC_HOST + 'api/textbook/album/list'
                		//this.reourse_url = 'http://120.79.11.95:3000/cocheer/textbookBooks'
                		this.reourse_url = `${this.HOST}/api/v1/textbook/album`
                		Object.assign(param,{
                			level:this.$route.query.level,
                			grade:this.$route.query.grade,
                			course:this.$route.query.course
                		})
                		break
                	case 3:
                		let openid = this.$store.state.openid
                		if(!openid){
                			openid = sessionStorage.getItem('openid')
                		}
                		Object.assign(param,{
                			tag: this.tag,
                			category_id:this.category_id,
                			openid:openid
                		})
                		this.reourse_url = this.HOST + '/api/v1/xmly/xmly_album'
                		//请求喜马拉雅部分需要openid作为参数进行传递
                		break;
                	case 4:
                		this.reourse_url = this.HOST+ '/api/v1/xmly/public_album'
                		Object.assign(param,{
                			tag: this.tag
                		})
                		break;
                }
                if(!This.haveMore){
                	return;
                }
                This.loading = true;
                This.axios({
                  method:'get',
                  url:This.reourse_url,
                  params:param,
                  responseType:'json'
                }).then(function(response) {
                	let result = response
                	let list = []
                	switch(parseInt(This.$route.query.resource_type)){
	    				case 1:
	    					list = result.data.data.data
	    					break
	    				case 2:
	    					list = result.data.data
	    					break
	    				case 3:
	    					list = result.data.data
	    					break
	    				case 4:
	    					list = result.data.data
	    					break
	    			}
	    			if(!list.length){
	    				This.haveMore = false
	    			}else{
	    				This.list = [...This.list,...list]
	    				//This.page
	    			}
	    			This.loading = false;
                });
			}
		}
	}
</script>