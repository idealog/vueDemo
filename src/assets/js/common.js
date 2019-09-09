import Vue from 'vue'
import $store from '@/vuex/store'
import constant from './global_val'
export default {
    install(Vue, options) {
    	if(process.env.NODE_ENV === 'development'){
    		Vue.prototype.HOST = '/data_api' ;
            Vue.prototype.WEBSOCKET_HOST = 'ws://119.23.26.154:8003'
    	}else{
    		Vue.prototype.HOST = '/qmh_test';
            Vue.prototype.WEBSOCKET_HOST = 'wss://www.cocheer.net/ws'
    	};
       // Vue.prototype.search_url = 'http://www.cocheer.net/mongodb/api/third/search/all'
        Vue.prototype.constant = constant // 业务全局常量 设备状态
        Vue.prototype.customer = "智能台灯";
    	Vue.prototype.PUBLIC_HOST = 'https://www.cocheer.net/mongodb/';
    	Vue.prototype.KQ_ID = 19;
    	Vue.prototype.P_IMG = 'https://www.cocheer.net/resource/public/img/0.jpg';
        Vue.prototype.LStorage = window.localStorage;
        if(!Vue.prototype.LStorage.getItem('push_record_list')){
            Vue.prototype.LStorage.setItem('push_record_list',JSON.stringify([])); //记录推送记录
        }
        Vue.prototype.ws = null;
        //定义提示语
        Vue.prototype.tips = {
            "send":`正在通知${Vue.prototype.customer}播放歌曲`,
            "offline":"设备离线",
            "unbind":"未绑定设备",
            "stop":"还没有播放歌曲",
            "list":"推送专辑歌曲换到列表模式",
            "remind":"你可以播放设备上的歌曲或者从公众号推送歌曲到设备"
        }
        Vue.prototype.CategoryMode = {
            HAPPY_SONG: 1, //1 欢乐儿歌
            CLASSICS_CHINESE: 2, //2 国学经典
            FAIRY_TALES: 3, //3 童话故事
            ENLIGHTEN_ENGLISH: 4, //4 启蒙英语
            BABY_FAVOR: 5, //5 宝宝最爱
            ALBUM: 6, //6 ablum
            SINGLE_MUSIC: 7 //7 单曲
        };
        // 检测是否选择了产品
        Vue.prototype.checkIsChoosedProduct = (vm, page, openid) => {
        	if(!vm.LStorage.getItem('product_name')){
            	vm.$router.push(`/product?&page=${page}&openid=${openid}`);
        	}
        }
        // 检测设备在线状态
        Vue.prototype.checkDeviceOnline = (openid) => {
        	Vue.prototype.axios.get(`${Vue.prototype.HOST}/api/v1/base/checkDeviceOnline?openid=${openid}`)
                .then(res => {
                    if(res.data.status === 0 && res.data.data.data === 'true'){
                        $store.dispatch("CHANGE_ONLINE", true);
                    }else{
                        $store.dispatch("CHANGE_ONLINE", false);
                    }
                });
        }
        // 获取设备基本信息
        Vue.prototype.getBasicInfo = (openid) => {
        	return Vue.prototype.axios.get(`${Vue.prototype.HOST}/api/v1/relation/device_basic_info?openid=${openid}`)
                .then(res => {
                	if(res.data.status !== 0){
                		Vue.prototype.$toast(res.data.message);
                	}else{
                		$store.dispatch("CHANGE_BASIC_INFO", res.data.data);
                	}
                	return Promise.resolve(res.data.data);
                });
        }

       Vue.prototype.formatTime = function (second) {
	        var time='';
	        if (second > -1) {
	            var hour = Math.floor(second / 3600);
	            var min = Math.floor(second / 60) % 60;
	            var sec = second % 60;
	            if (hour !== 0) {
	                time = hour + ":";
	            }
	            if (min < 10) {
	                time += "0";
	            }
	            time += min + ":";
	            if (sec < 10) {
	                time += "0";
	            }
	            time += sec;
	        }
	        return time;
    	}

        Vue.prototype.compare = function(baseObj,compObj,key){
            if(Object.prototype.toString.call(baseObj) === "[object Object]" && Object.prototype.toString.call(compObj) === "[object Object]"){
                if(key){
                    if(baseObj[key] !== compObj[key]){
                        return false
                    }else{
                        return true
                    }
                }
                if(Object.keys(compObj).length !== Object.keys(baseObj).length){
                    return false
                }
                var flag = true
                var keys = Object.keys(baseObj)
                for(var i = 0 ; i < keys.length ; i++){
                    if(baseObj[keys[i]] !== compObj[keys[i]]){
                        flag = false
                        break;
                    }
                }
                if(flag){
                    return true
                }else{
                    return false
                }
            }
        }

        // 判断是否绑定
        Vue.prototype.isBind = function(){
            let device_info = JSON.parse(sessionStorage.getItem('device_info'))
            if(device_info.status){
              return false
            }else{
              return true
            }
        }
        // 推送记录保存
        Vue.prototype.addPushRecord = function(sendData){
            if(Object.prototype.toString.call(sendData) === "[object Object]"){
              delete sendData["operate"]
              delete sendData["action"]
              delete sendData["play_ctrl"]
              delete sendData["playlist"]
              let push_record_list = Vue.prototype.LStorage.getItem('push_record_list')
              let push_record = JSON.parse(push_record_list)
              for(let i=0; i < push_record.length;i++){
                  if(Vue.prototype.compare(push_record[i],sendData,"song_url")){
                    return
                  }
              }
              push_record.push(sendData)
              Vue.prototype.LStorage.setItem("push_record_list",JSON.stringify(push_record))
            }
        }

        Vue.prototype.behaviorSave = function(params){
            if(Object.prototype.toString.call(params) === "[object Object]"){
                Object.assign({
                    kq_id:Vue.prototype.KQ_ID
                })
            }
            /*var action_info = {
                url:window.location.href,
                category:category_id,
                audio_id:songId,
                audio_source:source,
                audio_name: songName,
                audio_url:songUrl,
                audio_pic_url:audio_pic_url,
                audio_duration:duration,
                audio_album:albumTitle,
                audio_album_id:albumId
            };
            var params = {
                openid:DeviceStatus.openId,
                kq_id:DeviceStatus.sex === "女" ? 5 : 4,
                action_type:action_type.shiting,
                action_info:action_info
            }*/
            Vue.prototype.axios({
                contentType: 'application/json; charset=utf-8',
                url: `${Vue.prototype.PUBLIC_HOST}api/web/behavior/song/save`,
                data: JSON.stringify(params),
                method: 'post'
            }).then(resp => {
                if(resp && resp.data){
                    if(result.status === 0){
                        console.log("保存用户行为成功");
                    }else{
                        console.log("保存用户行为失败");
                    }
                }else{
                    console.log("保存用户行为失败");
                }
            })
            Vue.prototype.axios({
                contentType: 'application/json; charset=utf-8',
                url: `${Vue.prototype.PUBLIC_HOST}log/api/web/behavior/song/save`,
                data: JSON.stringify(params),
                method: 'post'
            }).then(resp => {
                if(resp && resp.data){
                    if(result.status === 0){
                        console.log("保存用户行为log成功");
                    }else{
                        console.log("保存用户行为log失败");
                    }
                }else{
                    console.log("保存用户行为log失败");
                }
            })
        }
    }
}
