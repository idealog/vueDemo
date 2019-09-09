<template>
    <div class="module">
        <div class="module_content" v-for="category in categories">
            <h1 style="margin-bottom:2rem">
                {{category.name}}
            </h1>
            <ul  class="clearfix" >
                <li ztoucheclass="normalClick"  v-for = "item in list"  v-show="category.id === item.category" @click="goSonglist(item)">  
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
        name:'RecommendMore',
        components:{
            Loading
        },
        data(){
            return {
                loading:false,
                categories:[
                    {
                        id:1,
                        name:'欢乐儿歌'
                    },
                    {
                        id:2,
                        name:'国学经典'
                    },
                    {
                        id:3,
                        name:'童话故事'
                    },
                    {
                        id:4,
                        name:'英语启蒙'
                    },
                ],
                list:[]
            }
        },
        mounted(){
            this.getRecommendMore(1) //1 儿歌
            this.getRecommendMore(2) //2 国学
            this.getRecommendMore(3) //3 故事
            this.getRecommendMore(4) //4 英语
        },
        methods:{
            getRecommendMore:function(category){
                let host = this.HOST;
                let This = this;
                this.loading = true
                this.axios({
                  method:'get',
                  url:host + '/api/v1/qly/recommend',
                  params:{category:category},
                  responseType:'json'
                }).then(function(response) {
                    This.list = [...This.list,...response.data.data.data];
                    console.log(This.loading)
                    This.loading = false
                });
            },
            goSonglist:function(item){
                this.$router.push({path:'/songlist',query:{'resource_type':'1','album_id':item.album_id,'source':item.source,'category':item.category}});
            }
        }
    }

</script>