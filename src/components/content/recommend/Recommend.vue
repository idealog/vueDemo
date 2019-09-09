<template>
    <div class="module">
        <div class="module_hat">
            <a class="more" href="javascript:void(0)" @click="goMore()">更多</a>
            <h1 style="padding-left:1rem">
                精品推荐
            </h1>
        </div>
        <div class="module_content">
            <ul class="clearfix">
                <li  ztoucheclass="normalClick" v-for="item in list" @click="goSonglist(item)">
                    <p class="cover">
                        <img style="width:100%" v-lazy="item.icon || default_icon" />
                    </p>
                    <h4> {{item.album_title}}</h4>
                </li>
            </ul>
            <div style="clear:both"></div>
        </div>
    </div>
</template>
<script>
    export default{
        name : 'recommend',
        data() {
            return {
                list: [],
                default_icon:`${this.HOST}/images/default_cover.png`
            }
        },
        mounted(){
            this.getRecommend();
        },
        methods:{
            getRecommend:function(){
                let host = this.HOST;
                let This = this;
                let param = {
                    page:1,
                    limit:6
                }
                this.axios({
                  method:'get',
                  url:host + '/api/v1/qly/recommend',
                  params:param,
                  responseType:'json'
                }).then(function(response) {
                    This.list = [...response.data.data.data];
                });
            },
            goMore:function(){
                this.$router.push({path:'/recommendmore',query:{"tag":"recommend"}});
            },
            goSonglist:function(item){
                this.$router.push({path:'/songlist',query:{"resource_type":"1","album_id":item.album_id,"source":item.source,"category":item.category,page:1}})
            }
        }
    }
</script>