<template>
	<div class="main">
	    <div id="content">
	        <div class="module" style="position:relative;">
	            <div id="rl_result" class="module_content">
	                <ul class="clearfix">
						<li  v-for="item in list" @click="goList(item)">
		                   <p class="cover">
		                   		<img :src="item.img" style="width:100%" />
		                   	</p>
		                   <div class="cover-title">
		                   		<h4>
		                   			{{item.tag}}
		                   		</h4> 
		                   </div>
                    	</li>
	                </ul>
	            </div>
	        </div>
	    </div>
        <Loading :show="loading"></Loading>
	</div>
</template>

<script>
    import Loading from '@/components/loading/Loading'
	export default {
        components:{
            Loading
        },
		data(){
			return {
				list:[],
                loading:false
			}
		},
		created(){
			this.getTagList()
		},
		methods:{
			getTagList:function(){
				let host = this.PUBLIC_HOST
        		let This = this
                This.loading = true
        		let param = {
        		}
        		this.axios({
                  method:'get',
                  url:host + 'api/why/tag',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                	console.log(response.data.data)
                	This.list = response.data.data
                	This.list.map(item => {
                		item.img = `${This.HOST}/images/${item.tag}.png`
                	})
                	This.list.splice(This.list.length-1,1)
                    This.loading = false
        		});
			},
			goList:function(item){
				/*let host = this.PUBLIC_HOST
        		let This = this
        		let param = {
        		}
        		this.axios({
                  method:'get',
                  url:host + 'api/why/tag',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                	console.log(response.data.data)
                	This.list = response.data.data
                	This.list.map(item => {
                		item.img = `${This.HOST}/images/${item.tag}.png`
                	})
                	This.list.splice(This.list.length-1,1)
        		});*/
        		this.$router.push({path:'/wonder_list',query:{'tag':item.tag}})
			}
		}
	}
</script>

<style scoped>
/* ipad以及横屏优化 */

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    /* style */
    .module ul li {
        width: 13.5%;
        margin-right: 1.98%;
        margin-bottom: 2%;
    }

    .module.style2 ul li {
        width: 21.1%;
    }

    .fam_head li {
        width: 16.66%
    }
}

@media only screen and (orientation: landscape) {
    .module ul li {
        width: 13.5%;
        margin-right: 1.98%;
        margin-bottom: 2%;
    }

    .module.style2 ul li {
        width: 21.1%;
    }

    .fam_head li {
        width: 16.66%
    }
}

.module{

}

.module ul li {
    float: left;
    width: 21%;
    margin-right: 10%;
    margin-left: 2%;
    color: #999;
}

.module ul {
    width: 110%;
}

.module.style2 ul li {
    width: 44%;
}

.module .cover {
    border-radius: 1rem;
    overflow: hidden;
    background-size: 100%;
}

.module .module_content {
    margin: 3rem 2.5rem 0rem;
}

.module ul h4 {
    color: #333;
    line-height: 1.6rem;
    height: 3.2rem;
    margin-top: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.5rem;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.module ul .cover-title {
    height: 4.6rem;
}

.module ul .cover-title h4 {
    text-align: center;
    height: auto;
}

.module ul .cover-title p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 1.1rem;
    margin-top: 0.2rem;
}

.module_hat {
    height: 5rem;
    /*    border-bottom: 1px solid #f3f3f3;*/
    line-height: 5rem;
    font-size: 1.6rem;
}

.module_hat h1 {
    font-size: 1.6rem;
    float: left;
    padding-left: 1.5rem;
}

.module_hat h1 span {
    border-radius: 50%;
    vertical-align: middle;
    display: block;
    float: left;
    width: 2rem;
    margin: 1.5rem 0.5rem 0 0;
    height: 2rem;
    background-color: #00c1d2;
}

.module_hat .more {
    float: right;
    color: #999;
    font-size: 1.4rem;
    width: 7rem;
    text-align: right;
    border-radius: 1.3rem;
    padding-right: 1.6rem;
}

.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
    left: 0;
    top: 0;
    /*从这里*/
    display: none;
    transition: all 200ms;
    animation: pop_kf_top1 200ms;
}
</style>