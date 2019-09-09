<template>
	<section class="course_bk">
		<div v-for="item in list" class="course">
			<h2>{{item.grade}}</h2>
			<div v-for="item2 in item.subjects" class="special-content" @click = "goAlbum(item.grade,item2.course)">
					<div class="content-item-img">
						<img :src="item2.img">
					</div>
					<div class="content-item-word">
						<h3 class="grade_tag">{{item.grade}} {{item2.course}}</h3>
						<p>{{item2.description}}</p>
					</div>
			</div>	
		</div>
	</section>
</template>

<script>
	export default {
		name:'SynCourse',
		data() {
            return {
                list:[
	                {
	                	grade:'一年级',
	                	subjects:[
	                		{
	                			course:'语文',
	                			description:'',
	                			img:''
	                		},
	                		{
	                			course:'英语',
	                			description:'',
	                			img:''
	                		}
	                	]
	                },{
	                	grade:'二年级',
	                	subjects:[
	                		{
	                			course:'语文',
	                			description:'',
	                			img:''
	                		},
	                		{
	                			course:'英语',
	                			description:'',
	                			img:''
	                		}
	                	]
	                },
	                {
	                	grade:'三年级',
	                	subjects:[
	                		{
	                			course:'语文',
	                			description:'',
	                			img:''
	                		},
	                		{
	                			course:'英语',
	                			description:'',
	                			img:''
	                		}
	                	]
	                },
	                {
	                	grade:'四年级',
	                	subjects:[
	                		{
	                			course:'语文',
	                			description:'',
	                			img:''
	                		},
	                		{
	                			course:'英语',
	                			description:'',
	                			img:''
	                		}
	                	]
	                },
	                {
	                	grade:'五年级',
	                	subjects:[
	                		{
	                			course:'语文',
	                			description:'',
	                			img:''
	                		},
	                		{
	                			course:'英语',
	                			description:'',
	                			img:''
	                		}
	                	]
	                },
	                {
	                	grade:'六年级',
	                	subjects:[
	                		{
	                			course:'语文',
	                			description:'',
	                			img:''
	                		},
	                		{
	                			course:'英语',
	                			description:'',
	                			img:''
	                		}
	                	]
	                }
               ]
            }
        },
        created(){
        	this.init()
        },
        methods:{
        	init:function(){
        		const THIS = this
        		this.list.map((item) =>{
        			item.subjects.map((item2) => {
        				item2.img = `${THIS.HOST}/images_new/${item.grade}${item2.course}.png`
        				item2.description = `${item.grade}${item2.course}（上、下）人教版 ${item.grade}${item2.course}（上、下）沪教版 ${item.grade}${item2.course}（上、下）苏教版 ${item.grade}${item2.course}（上、下）部编本`
        				return item2
        			})
        		})
        	},
        	goAlbum:function(grade,course){
        		// 0 青莲云  1 喜马拉雅  2 公共
        		this.$router.push({path:'/album',query:{'resource_type':2,'grade':grade,'course':course,'page':1}})
        	}
        }

	}
</script>

<style scoped>
	.course_bk{
		margin-top: .5rem;
	}
	.course{
		padding-bottom: .5rem;
		border-bottom: .2rem solid rgb(235,235,235);
	}
	.course h2{
		padding-left: 2rem;
		margin-top: .5rem;
		margin-bottom: .5rem;
		font-size: 1.6rem;
		font-weight: bold;
		color:rgb(220,138,10);
	}
	.special-content{
		margin-top:1rem;
		padding-left:2rem;
	}

	.special-content-item{
		margin-top:1rem;
	}

	.content-item-word{
		padding-left:5rem;
		margin-right:2rem;
	}

	.content-item-word h3{
		font-size:1.5rem;
		font-weight: bold;
	}
	.content-item-word p{
		color:rgb(141,141,141);
		font-size: 1.2rem;
		overflow: hidden;
		display: -webkit-box;
	    -webkit-box-orient: vertical;
	    -webkit-line-clamp: 2;
	}

	.content-item-img{
		height: 4rem;
		width: 4rem;
		float: left;

	}
	.content-item-img img{
		border-radius:.8rem; 
		width:4rem;
	}


</style>