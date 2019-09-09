<template>
	<div>
		<div class="tag_content">
			<ul>
				<li class = "category" v-for="item in tag_list" @click="goAlbum(item)">
					<div>
						<a class="inline-item">
							{{item.tag_name}}
						</a>
					</div>
				</li>
			</ul>
		</div>
		<div class="content">
			<ul  class="content-block">
				<li v-for="item in tag_list" class="special-header">
					<div class="special-header">
						<div class="inline-header">
							<a @click="goAlbum(item)">
								{{item.tag_name}}
							</a>
							<a class="content-more" @click="goAlbum(item)">
								更多
							</a>
						</div>
					</div>
					<div class="special-content">
						<div class="special-content-item" v-for="sub_item in item.albums" @click="goSongList(sub_item)">
							<div class="content-item-img">
								<img style="width:100%" :src="sub_item.cover_url_small" />
							</div>
							<div class="content-item-word">
								<h3>{{sub_item.album_title}}</h3>
								<p style="-webkit-box-orient: vertical;">{{sub_item.album_intro || sub_item.album_title}}</p>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<Loading :show="loading"></Loading>
	</div>
</template>
<script type="text/javascript">
	import Loading from '@/components/loading/Loading'
	export default {
		name:'XmlyContent',
		components:{
			Loading
		},
		data(){
			return {
				tag_list:[],
				loading:false,
				category_id:'',
				scroll:0
			}
		},
		mounted(){
			this.getCategory()
			this.getContent()
		},
		activated(){
			window.addEventListener('touchend',this.handleScroll)
			if(this.scroll){
				window.scrollTo(0,this.scroll) //记录滚动位置
			}
			if(this.category_id != this.$route.query.category_id){
				this.init()
			}
		},
		deactivated(){
			window.removeEventListener('touchend',this.handleScroll)
		},
		methods:{
			handleScroll(){
				let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
  				this.scroll = scrollTop
			},
			init(){
				this.tag_list = []
				this.loading = false
				this.getCategory()
				this.getContent()
			},
			getCategory(){
				this.category_id = this.$route.query.category_id
			},
			getContent:function(){
				let host = this.HOST;
        		let This = this;
        		let param = {
        			openid:111,
        			category_id:this.category_id
        		};
        		this.loading = true
        		this.axios({
                  method:'get',
                  url:host + '/api/v1/xmly/xmly_tags',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                	This.loading = false
                	if(Object.prototype.toString.call(response.data.data) === '[object Array]'){
                		This.tag_list = response.data.data
                	}
        		})
			},
			goAlbum:function(item){
				this.$router.push({path:'/album',query:{'tag':item.tag_name,'category_id':item.category_id,'resource_type':3}})
			},
			goSongList:function(item){
				this.$router.push({path:'/songlist',query:{'resource_type':'3','album_id':item.album_id}});
			}
		}
	}

</script>

<style scoped>
	.tag_container{
		margin-top: 1rem;
		border-bottom:1rem solid rgb(245,245,245);
	}
	.inline-item{
		display: inline-block;
	    text-align: center;
	    font-size: 1.3rem;
	    border: 1px solid rgb(152,152,152);
	    margin-bottom: 1rem;
	    border-radius: .5rem;
	    padding: .5rem 0 .5rem 0;
	    line-height: 1.8rem;
	    width: 6.3rem;
	    height: 3rem;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    white-space: nowrap;
	}
	.header{
		height: 4.5rem;
		line-height: 4.5rem;
		text-align: center;
		font-size:1.5rem;
		font-weight: bold;
		color:rgb(9,132,218);
		border-bottom: .2rem solid rgb(245,245,245);

	}
	.inline-header{
		margin-left: 2.3rem;
		margin-top: 1rem;
	}
	.inline-header a{
		color:rgb(219,140,11);
		font-size: 1.6rem;
		font-weight: bold;
	}
	.special-header{
		margin-bottom:2.5rem;
	}
	.content-item-img{
		height: 4rem;
		width: 4rem;
		float: left;

	}
	.content-item-img img{
		border-radius:.8rem; 
	}
	.special-content{
		margin-top:2rem;
		padding-left:2rem;
	}

	.special-content-item{
		margin-top:1rem;
	}

	.content-item-word{
		padding-left:5rem;
		margin-right:2rem;
	}

	.content-item-word h3{
		font-size:1.5rem;
		font-weight: bold;
	}
	.content-item-word p{
		color:rgb(141,141,141);
		font-size: 1.2rem;
		overflow: hidden;
		display: -webkit-box;
	    -webkit-line-clamp: 2;
	}
	.tips{
		margin-top: 30%;
		text-align: center;
		font-size: 1.6rem;
	}
	.content-more{
		margin-right: 2rem;
		float: right;
	}
	.category{
		display: inline-block;
		width: 25%;
		text-align: center;
	}
	.bk{
		
	}
	.tag_content{
		margin-top:1.5rem;
	}
</style>