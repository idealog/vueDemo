import Vue from 'vue';
import Vuex from 'vuex';
import actions from './action'
import state from './state'
import mutations from './mutation'

Vue.use(Vuex);
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
//状态管理
const store = new Vuex.Store({
  state,
  mutations,
  actions,
});

/* eslint-disable no-new */
export default store;
