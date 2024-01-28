<template>
  <div class="home">
  		{{str}}
  		{{ arr }}
  		<button @click='btn("aaaa")'>按钮</button>

  		<hr />
  		{{ num }}
  		<button @click='changeAdd'>添加</button>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
export default {
  name: "Home",
  computed:{
  	...mapState(['str','arr','num'])
  },
  methods:{
  	...mapMutations(['btn']),
  	...mapActions(['changeAdd'])
  }
};
</script>
