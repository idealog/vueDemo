<template>
  <li @click="goSonglist(item)">
      <div class="cover">
         <img :src="item.icon"/>
      </div>
      <div class="tt">
          <h3>{{item.album_title || item.album_name}}</h3> 
          <p> {{item.album_count}}首</p>
      </div>
  </li>
</template>

<script type="text/javascript">
    export default{
         //name :'AlbumItem',
         props:['album-item'],
         data(){
              return {
                item:{}
              }
         },
         created(){
            this.getItem()
         },
         methods:{
            getItem:function(){
              this.item = this.albumItem ;
            },
            goSonglist:function(item){
              //console.log(this.$route.query.resource_type == '4');
              if(this.$route.query.resource_type == '2'){
                console.log(2);
                this.$router.push({path:'/songlist',query:{'resource_type':2,'album_id':item.id}})
              }else if(this.$route.query.resource_type == '4' || this.$route.query.resource_type == '1' || this.$route.query.resource_type =='3'){
                this.$router.push({path:'/songlist',query:{'resource_type':this.$route.query.resource_type,'album_id':item.album_id,'category':item.category,'source':item.source}});
              }
            }
         }
    }
</script>

