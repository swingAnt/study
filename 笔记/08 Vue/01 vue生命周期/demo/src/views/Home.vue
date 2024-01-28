<template>
  <div class="home">
   	<router-link to='/about'>关于</router-link>
  </div>
</template>

<script>

export default {
  name: "Home",
  data () {
  	return {
  		str:'123'
  	}
  },
  beforeCreate(){
  	console.log('beforeCreate',this.$el,this.$data)
  },
  created(){
  	console.log('created',this.$el,this.$data)
  },
  beforeMount(){
  	console.log('beforeMount',this.$el,this.$data)
  },
  mounted(){
  	console.log('mounted',this.$el,this.$data)
  },
  beforeUpdate(){
  	console.log('beforeUpdate')
  },
  updated(){
  	console.log('updated')
  },
  beforeDestroy(){
  	console.log('beforeDestroy')
  },
  destroyed(){
  	console.log('destroyed')
  },
};
</script>
