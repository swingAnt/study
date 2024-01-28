<template>
  <div class="about">
    
  		<input type="number" name="" v-model='price'>
  		<input type="number" name="" v-model='num'>
  		总价:{{total}}

  </div>
</template>

<script>
export default{
	data () {
		return {
			price:10,
			num:2
		}
	},
	computed:{
		total(){
			return this.num * this.price;
		}
	},
	// watch:{
	// '$route'(){},
	// 	num( newVal ){
	// 		this.total = newVal * this.price;
	// 	},
	// 	price( newVal ){
	// 		this.total = newVal * this.num;
	// 	}
	// }
}
</script>
