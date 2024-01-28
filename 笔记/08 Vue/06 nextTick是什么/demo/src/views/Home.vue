<template>
  <div class="home">

  	<button @click='btn' ref='box'>{{str}}</button>

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
  methods:{
  	btn(){

  		this.str = 'bbbbbb';

  		console.log( this.$refs.box.innerHTML  )

  		this.$nextTick(()=>{
  			console.log( this.$refs.box.innerHTML,'xxxx'  )
  		})

  	}
  }

};
</script>
