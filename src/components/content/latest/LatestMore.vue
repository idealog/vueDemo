<template>
	 <div class="module">
        <div class="module_content" >
            <ul  class="clearfix">
                <li ztoucheclass="normalClick"  v-for = "item in list"  @click="goSonglist(item)">  
                    <p class="cover">
                        <img style="width:100%" v-lazy="item.icon || `${HOST}/images/default_cover.png`"/>
                    </p> <h4>{{item.album_title}}</h4>
                </li>
            </ul>
        </div>
        <Loading :show="loading"></Loading>
    </div>
</template>
<script>
import Loading from '@/components/loading/Loading'
    export default {
        name:'LatestMore',
        components:{
            Loading
        },
        data(){
            return {
                page:1,
                list:[],
                loading:false
            }
        },
        mounted(){
            this.getLatestMore();
        },
         methods:{
            getLatestMore:function(){
                let host = this.HOST;
                let This = this;
                let param = {
                    page:this.page++,
                    limit:20
                }
                this.loading = true
                this.axios({
                  method:'get',
                  url:host + '/api/v1/qly/recent',
                  params:param,
                  responseType:'json'
                }).then(function(response) {
                    This.list = [...This.list,...response.data.data.data];
                    console.log(This.loading)
                    This.loading = false
                });
            },
            goMore:function(){
                this.$router.push({path:'/latestmore',query:{"tag":"latest"}});
            },
            goSonglist:function(item){
                this.$router.push({path:'/songlist',query:{'resource_type':'1','album_id':item.album_id,'source':item.source,'category':item.category}});
            }
        }
    }
</script>