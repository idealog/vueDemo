<template>
    <div>
        <div class="module" style="width:100%;overflow:hidden">
            <div class="module_content" >
                 <ul id="all_listening_list" class="clearfix" v-infinite-scroll="getAllListen" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                    <li   v-for = "item in list" @click="goSonglist(item)">  
                        <p class="cover">
                            <img style="width:100%" v-lazy="item.icon || `${HOST}/images/default_cover.png`"/>
                        </p> <h4>{{item.album_title}}</h4>
                    </li>
                </ul>
            </div>
        </div>
        <Loading :show="loading"></Loading>
        <PropellingController v-show="$store.state.show_propelling"></PropellingController>
    </div>
</template>
<script>
import Loading from '@/components/loading/Loading'
import PropellingController from '@/components/common/propellingController'
    export default {
        //name:'AllListenMore',
        components: {
            Loading,
            PropellingController
        },
        data(){
            return {
                list: [],
                page: 1,
                loading: false,
                haveMore:true
            }
        },
        mounted(){
            this.getAllListen();
        },
        activated(){
            
        },
        deactivated(){
            
        },
        methods:{
            getAllListen:function(){
                let host = this.HOST;
                let This = this;
                let param = {
                    page:this.page++,
                    limit:20
                }
                if(!This.haveMore){
                    return
                }
                This.loading = true
                this.axios({
                  method:'get',
                  url:host + '/api/v1/qly/hot',
                  params:param,
                  responseType:'json'
                }).then(function(response) {
                    if(response.data.data.data.length === 0){
                        This.haveMore = false
                    }
                    This.list = [...This.list,...response.data.data.data];
                    This.loading = false

                    console.log(This.loading)
                });
            },
            goSonglist:function(item){
                this.$router.push({path:'/songlist',query:{'resource_type':'1','album_id':item.album_id,'source':item.source,'category':item.category}});
            }
        }
    }

</script>
