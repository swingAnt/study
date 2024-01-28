<template>
  <div class="home">
   		<h1 v-show='isShow'>小鹿线</h1>
  </div>
</template>

<script>

export default {
  name: "Home",
  data () {
  	return {
  		isShow:false
  	}
  }
};
</script>
