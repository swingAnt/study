<template>
  <div class="home">
  		{{change}}
  		{{change}}
  		{{change}}
  		{{change}}

  		{{str()}}
  		{{str()}}
  		{{str()}}
  		{{str()}}
  </div>
</template>

<script>
export default {
  name: "Home",
  data (){
  	return{
  		arr:[1,2,3]
  	}
  },
  computed:{
  	change(){
  		console.log('computed');
  		return this.arr.join('-');
  	}
  },
  methods:{
  	str(){
  		console.log( 'methods'  )
  		return this.arr.join('+');
  	}
  }
};
</script>
