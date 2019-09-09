<template>
	 <div class="module">
            <div class="module_hat">
                <!-- <a class="more"  href="javascript:void(0)" @click="goMore()">更多</a> -->
                <h1 style="padding-left:1rem">
                    最新上架
                </h1>
            </div>
            <div class="module_content">
                <ul class="clearfix">
                	<li ztoucheclass="normalClick" v-for="item in list" @click.stop="goSonglist(item)"> 
                		<p class="cover">
                			<img style="width:100%" v-lazy="convert(item.icon) || `${HOST}/images/default_cover.png`" />
                		</p>
                	  	<h4>{{item.album_title}}</h4>
                	 </li>
                </ul>
            </div>
    </div>
</template>

<script>
	export default{
		name:'latest',
		data() {
			return {
                list: []
            }
		},
		 mounted(){
            this.getLatest();
        },
        methods:{
            convert:function(icon){
                return icon.replace('http://','https://')
            },
        	getLatest:function(){
        		let host = this.HOST;
        		let This = this;
        		let param = {
        			page:1,
        			/*limit:3*/
        		};
        		this.axios({
                  method:'get',
                  url:host + '/api/v1/qly/recent',
                  params:param,
                  responseType:'json'
                }).then(function(response){
                	This.list = [...response.data.data.data];
        		});
        	},
            goMore:function(){
                this.$router.push({path:'/latestmore',query:{"tag":"latest"}});
            },
            goSonglist:function(item){
                this.$router.push({path:'/songlist',query:{"resource_type":"1","album_id":item.album_id,"source":item.source,"category":item.category}})
            }
        }
	}
</script>