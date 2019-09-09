<template>
       <div>
            <li class="resourceLi" @click = "toggle()" ref="song_item"> 
                <a  class="list_play lbtn" @click.stop="send(item)"></a> 
                <div class="tt"><h3> {{item.song_name || item.title || item.audio_name || item.track_title || item.radio_name}}</h3>
                    <!-- <cocheer-player :show="playing && item.song_url === $store.state.play_url"  :duration="item.duration" :play_url="item.song_url" :id="item.song_id" :ceil="ceil"  @changeProgress="changeProgress" ref="player"></cocheer-player> -->

                    <!-- 保证切换只播放一首歌 $store.state.play_url 记录歌 rul-->

                    <PlayerProgress  :duration="item.duration" :show="playing && item.song_url === $store.state.play_url" :play_url="item.song_url" ref="player"  :ceil="ceil"  @changeProgress="changeProgress" @audioReday="changeAudioState" v-if="playing && item.song_url == $store.state.play_url"></PlayerProgress>

                    <!--不满足的时候也显示-->
                    <p v-show="!playing || item.song_url != $store.state.play_url"> {{formatTime(item.duration)}}</p>
                </div>
                <!--显示进度条  如果试听点击 则显示-->
           </li>
           <li class="ibs"  v-bind:class="{'show': item === this.$store.state.listen_item}" >
                 <div id="shiting" @click="listen()">

                      <!--保证切换只保留一个一致性-->
                      <!-- <p class="play audition" v-bind:class = "{'loading': playing && item.song_url == $store.state.play_url}"></p> -->
                      <p class="play audition" v-show="!playing || item.song_url != $store.state.play_url"></p>
                      <p class="loading" v-show="playing && item.song_url == $store.state.play_url && !ready">
                      <p class="play audition pause" v-show="playing && item.song_url == $store.state.play_url && ready">
                      <p>试听</p>
                 </div>
                <!--  <div id="shiting" @click="listen()">
                
                     保证切换只保留一个一致性
                     <p  class="loading"></p>
                     <p>试听</p>
                </div> -->
                 <div id="shoucang" @click="collect(item)">
                      <p class="like" v-bind:class="{'yes':collect_status}"></p>
                      <p>收藏</p>
                 </div>
                 <div id="xiangqing"  @click = "goDetail(item)"> 
                      <p class="detail"></p>
                      <p>详情</p>
                 </div>
           </li> 
       </div>
</template>
<script type="text/javascript">
//import  '@/assets/plugin/player/player_progress'
import PlayerProgress from '@/components/listen_progress/player'
   export default {
    name: 'SongItem',
    components:{
      PlayerProgress
    },
    props:['song-item','is-show'],
    data() {
        return {
            item: '',
            show:false,
            collect_status:'',
            ceil:'px',
            playing:false,
            ready:''
        }
    },
    created() {
        this.getItem() 
    },
    mounted() {
        let This = this
        if(this.playing && this.item === this.$store.state.listen_item){
            this.$on('changeProgress',This.changeProgress)
            this.$on('audioReday',This.changeAudioState)
        }
    },
    beforeDestroy () {
      clearInterval(this.interval)
    },
    methods:{
        changeAudioState(value){
          console.log('state--'+value)
           if(value){
              this.ready = value
           }
        },
         getItem:function(){
            this.item = this.songItem   
         },
         //检查是否到达页面底部  如果到达底部向上面滚动一条高度 查询收藏状态
         toggle:function(){
            let This = this
            this.playing = false
            if(this.item.song_url === this.$store.state.play_url){
                this.playing = true
            }
            if(this.item === this.$store.state.listen_item){
              this.$store.dispatch('CHANGE_LISTEN_ITEM','')
            }else{
              this.$store.dispatch('CHANGE_LISTEN_ITEM',this.item)
            }
            This.show =  !This.show //查询收藏状态
            let openid = This.$store.state.openid
            if(!openid){
                openid = sessionStorage.getItem("openid")
            }
            if(This.show){
                let param = {
                    openid: openid,
                    song_id: this.item.song_id,
                    source: this.item.source,
                  //  category: this.item.category_id,
                    table: 0 //代表收藏那张表
                }
                this.axios({
                    method:'get',
                    params: param,
                    url: This.HOST + '/api/v1/music/song/is_added'
                }).then(res => {
                    if(res.data.data && res.data.data.collect_status){
                        This.collect_status = res.data.data.collect_status
                    }
                })
            }
         },
         //试听
         listen:function(){
            let This = this
            this.playing = !this.playing
            this.$store.dispatch('CHANGE_PLAY_URL',this.item.song_url)
            if(This.playing && this.item.song_url === this.$store.state.play_url){
              //异步加载完成时候调用
              this.$nextTick(function(){
                This.$refs.player.play("play") 
              })
            }else{
               This.$store.state.play_url = ''
               This.$refs.player.play("pause")
            }
         },
         changeProgress(value){
            this.progress = value
            if( value === 0 || value >= this.item.duration){
                this.$refs.player.play("pause")
                this.playing = false
                this.$store.state.play_url = ''
            }
         },
         //收藏
         collect:function(item){
            console.log('collect song')
            let This = this
            let db_url = This.HOST + '/api/v1/music/song/handle'
            let ws_url
            let param = {
                table:0,
                source:item.source,
                song_id:item.song_id,
                openid:This.$route.query.openid,
                song_local_path:'',
                song_url:item.song_url,
                song_name:item.song_name,
                song_duration:item.duration,
                album_name:item.album_name,
                song_icon:item.song_icon,
                album_icon:item.album_icon,
                album_id:item.album_id,
            }
            if(!This.collect_status){
                param.operate = 'add'
                ws_url = This.HOST + '/api/v1/music/download_single_music'
            }else{
                param.operate = 'delete'
                ws_url = This.HOST + '/api/v1/music/delete_single_music'
            }
            This.axios({
                    method:'post',
                    url:db_url,
                    data:param,
                    responseType:'json'
                }).then(res =>{
                     This.axios({
                        method:'get',
                        url:ws_url,
                        params:param,
                        responseType:'json'
                     }).then(response => {
                         console.log(response)
                        if(response && response.data && response.data.data){
                          console.log(response.data)
                          if(response.data.status === 0){
                            This.collect_status = !This.collect_status
                            if(This.collect_status){
                              This.$toast("收藏成功")
                            }else{
                              This.$toast("取消收藏成功")
                            }
                          }else{
                            if(param["operate"] === "add"){
                              This.$toast("收藏失败")
                            }else{
                              This.$toast("取消收藏失败")
                            }
                          }
                        }
                     })
                })
         },
         send:function(item){
            let operate = 0
            const _ = this
            let sendData = item
            sendData["operate"] = operate
            //判断是否绑定了
            if(!this.isBind()){
                this.$toast(this.tips["unbind"])
                return
            }
            this.websocket.sendMessage(sendData) //推送数据
            if(!this.$store.state.device_online_state){
                this.$toast(this.tips["offline"])
            }else{
                this.$toast(this.tips["send"])
            }
            this.addPushRecord(sendData) // 添加推送记录
            this.$store.dispatch('CHNAGE_PLAY_LIST',this.$parent.list) // 保存推送的列表数据 ， 如果用户刷新了页面 保存至sessionStorage中去 后面进行处理
            this.LStorage.setItem('play_list',JSON.stringify(this.$parent.list))
            this.$store.dispatch('CHANGE_PLAY_MODE', this.CategoryMode.ALBUM) // 改变播放模式
         },
         goDetail:function(item){
            this.$router.push({path:'/song',query:{'song_id':item.song_id,'source':item.source}});
         },
         transformData:function(item,operate = 1){
            const list = []
            const sequence = this.$store.state.play_list.indexOf(item)
            const source = item.source
            const song_name = item.title
            const song_url = item.play_url
            const song_id = item.id + ''
            const album_name = item.album_detail.album_title
            const album_id = item.album_detail.album_id + ''
            const category_id = item.album_detail.category
            const data = {sequence,source,song_id,song_name,song_url,album_name,album_id}
            const playlist = [data]
            const sendData = {
              "action": "device_play",
              "play_ctrl": "play",
              "category": this.CategoryMode.ALBUM,
              sequence,
              source,
              song_id,
              song_name,
              song_url,
              "operate": operate,
              "duration": item.duration,
              playlist
            }
            return sendData
         }
    }
}
</script>


<style type="text/css" scoped>

@keyframes loadSong{
  0%   { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}


.loading {
    width:2rem;
    height: 2rem;
    border:.25rem solid transparent;
    box-sizing:border-box;
    background-clip:padding-box,border-box;
    background-origin:padding-box,border-box;
    background-image:linear-gradient(#fff,#fff),linear-gradient(#eee,rgba(0,0,0,.5));
    border-radius:50%;
    animation: loadSong 1s linear 0s infinite;
    margin-bottom:.5rem;
    margin-left:1.5rem;
}


</style>