<template>
  <div class="home">
  	111111111
   	<button @click='btn'>跳转</button>


   	

  </div>
</template>

<script>
export default {
  name: "Home",
  methods:{
  	btn(){
  		// this.$router.push({
  		// 	path:'/about',
  		// 	query:{
  		// 		a:1
  		// 	}
  		// })
  		this.$router.push({
  			name:'About',
  			params:{
  				a:1
  			}
  		})
  	}
  }
};
</script>
