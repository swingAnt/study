<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script type="text/javascript">
export default{
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
  activated(){
  	console.log( 'keep:','activated')
  },	
  deactivated(){
  	console.log( 'keep:','deactivated')
  }
}
</script>