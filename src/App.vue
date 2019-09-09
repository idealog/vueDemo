<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
		<keep-alive>
		    <router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
	</transition>
	<transition name="router-fade" mode="out-in">
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</transition>

	<!-- <propelling-controller></propelling-controller> -->
  </div>
</template>

<script>
	//import '@/assets/plugin/propellingController'
	export default {
	  name: 'app'
	}
</script>

