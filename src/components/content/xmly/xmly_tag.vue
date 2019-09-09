<template>
	<div>
		<ul class="flex-container">
			<li v-for="item in tag_list">
				<div class="category_item" @click="getTagAndAlbum(item)">
					<img :src="item.cover_url_large">
					<h3>{{item.category_name}}</h3>
				</div>
			</li>
		</ul>
		<Loading :show="loading"></Loading>
	</div>
</template>

<script>
	import Loading from '@/components/loading/Loading'
	export default {
		name:'XmlyTag',
		components:{
			Loading
		},
		data(){
			return {
				filter_list:['英语','诗歌','音乐','儿童','有声书','健康养生','相声评书','戏曲','电台','名校公开课','历史','其他'],
				list:[],
				tag_list:[],
				loading:false
			}
		},
		created(){
			this.getTag();
		},
		methods:{
			getTag:function(){
				let host = this.HOST;
        		let This = this;
        		let param = {
        			openid:111
        		};
        		this.loading = true
        		this.axios({
                  method:'get',
                  url:host + '/api/v1/xmly/xmly_category',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                	This.list = response.data
                	This.loading = false
                	This.list.map(function(item,index){
                		if(This.filter_list.indexOf(item.category_name) > -1){
                			This.tag_list.push(item)
                		}
                	})
        		});
			},
			getTagAndAlbum(item){
				/*console.log(item)
				let host = this.HOST;
        		let This = this;
        		let param = {
        			openid:111,
        			category_id:item.id
        		};
        		this.axios({
                  method:'get',
                  url:host + '/api/v1/xmly/xmly_tags',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                	console.log(response.data.data)
        		});*/
        		let openid = this.$store.state.openid
        		if(!openid){
        			openid = sessionStorage.getItem("openid")
        		}
        		this.$router.push({path:'/xmly_content',query:{"category_id":item.id,"openid":openid}})
			}
		}
	}
</script>
<style scoped>
	.flex-container{
	}
	.flex-container li{
		float: left;
	    width: 33.33%;
	    text-align: center;
	    margin-bottom: 1rem;
	    margin-top: 1.5rem;
	}
	.category_item h3{
		text-align: center;
		margin-top:1rem;
	}
	.category_item img{
		width: 4.6rem;
	}
</style>