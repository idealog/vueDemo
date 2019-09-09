<template>
	<div style = "overflow:hidden">
	<!-- <Banner :url="url"></Banner> -->
		<Banner></Banner>
		<Search></Search>
		<Category></Category>
		<Latest></Latest>
		<Recommend></Recommend>
		<AllListen></AllListen>
		<PropellingController v-show="$store.state.show_propelling"></PropellingController>
		<Loading :show="loading"></Loading>
	</div>
</template>
<script>
import '@/assets/css/base_list.css'
import '@/assets/css/basic.css'
import Banner from './banner/Banner_img'
import Search from './search/Search'
import Category from './content/category/Category'
import Latest from './content/latest/Latest'
import Recommend from './content/recommend/Recommend'
import AllListen from './content/all/AllListen'
import PropellingController from '@/components/common/propellingController'
import Loading from '@/components/loading/Loading'
	export default {
		components: {
			Banner,
			Search,
			Category,
			Latest,
			Recommend,
			AllListen,
			PropellingController,
			Loading
		},
		data() {
			return {
				url:'',
				loading:false
			}
		},
		created(){
			this.url = this.HOST + '/images/banner.png'
			if(!this.ws){
				this.websocket.init(this.$route.query.openid)
			}
		},
		mounted(){
			const This = this
			this.loading = true
			this.$nextTick(function(){
				setTimeout(function(){
					This.loading = false
				},600)
			})
		},
		activated(){

		},
		deactivated(){
			//this.$destroy()
		}
	}
</script>