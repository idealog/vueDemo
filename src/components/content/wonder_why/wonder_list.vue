<template>
    <div>
        <div>
    		<div class="base_list" v-infinite-scroll="getList" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    		    <ul>
    		    	<li v-for="item in list" v-show="item.question">
    	            	<a  class="list_play lbtn" @click.stop="play(item)">
    	            	</a>
    	            	<div class="tt">
    	            		<h3>
    	            			{{item.question}}
    	            		</h3>
    	            	</div>
    	            </li>
    	            <Loading :show="loading"></Loading>
    		    </ul>
    		</div>
            <PropellingController v-show="$store.state.show_propelling"></PropellingController>
        </div>
	</div>
</template>

<script>
import Loading from '@/components/loading/Loading'
    import PropellingController from '@/components/common/propellingController'
	export default {
		name:'WonderList',
		components:{
			Loading,
            PropellingController
		},
		data(){
			return {
				list:[],
				page:1,
				page2:1,
				loading:false,
				haveMore:true,
			}
		},
		created(){
			this.getList()
		},
		methods:{
			getList:function(item){
				let host = this.PUBLIC_HOST
        		let This = this
        		let param = {
        			tag:this.$route.query.tag,
        			page:this.page2++
        		}
        		if(!This.haveMore){
        			return
        		}
                This.loading = true
        		this.axios({
                  method:'get',
                  url:host + 'api/why/directory',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                	if(response.data.data.length>0){
                		This.list = [...This.list,...response.data.data]
                	}else{
                		This.haveMore = false
                	}
                    This.loading = false
        		});
			},
			play:function(item){
                const customer = this.customer
				let host = this.PUBLIC_HOST
        		let This = this
        		let param = {
        			_id:item._id,
        		}
        		this.axios({
                  method:'get',
                  url:host + 'api/why/content',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                    let sendData = response.data.data
                    sendData["action"] = "knowledge"
                    if(!This.isBind()){
                        This.$toast(This.tips["unbind"])
                    }else if(!This.$store.state.device_online_state){
                        This.$toast("设备离线")
                    }else{
                        This.$toast(`正在通知${customer}播放`)
                    }
                    This.websocket.sendMessage(sendData)
        		});
			}
		}
	}
</script>

<style scoped>
    .base_list .tt h3 {
        padding: .8rem 0rem;
    }

    .base_list li:active {
        background: #f1f1f1;
    }
    .base_list li {
    height: 7rem;
    padding: 0 1rem;
    transition: height 200ms;
    -webkit-transition: height 200ms;
    overflow: hidden;
}

.base_list .list_play {
    float: right;
    width: 5rem;
    height: 5rem;
    margin-top: 1rem;
    border-radius: 3px;
    padding: 1rem;
}

.base_list .lbtn {
    float: left;
    margin-left: -0.5rem;
}

.base_list .lbtn:before {
    width: 3rem;
    height: 3rem;
}

.base_list .list_play:before {
    background: url(../../../../../images_new/list_play.png) center center no-repeat;
    background-size: 50%;
    display: block;
    content: '';
}


.base_list li:after {
    content: "";
    float: left;
    border-bottom: 1px solid #eee;
    width: 100%;
    margin-top: -1px;
}

.base_list .tt {
    height: 7rem;
    padding-top: 1.5rem;
}

</style>