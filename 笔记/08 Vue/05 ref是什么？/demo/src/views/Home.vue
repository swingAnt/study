<template>
  <div class="home">
    <img ref='imgs' src="../assets/logo.png" id='img'/>
  </div>
</template>

<script>
export default {
  name: "Home",
  mounted(){
  	console.log( document.getElementById('img') );

  	console.log( this.$refs )
  }
};
</script>
