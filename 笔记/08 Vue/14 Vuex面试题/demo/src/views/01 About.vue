<template>
  <div class="about">
    <h1>{{ str }}</h1>
    <h2>{{changeArr}}</h2>
	<h2>{{changeArr}}</h2>
	<h2>{{changeArr}}</h2>
	<h2>{{changeArr}}</h2>
	<button @click='btns'>按钮</button>
  </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'
export default {
  name: "About",
  computed:{
  	...mapState(['str']),
  	...mapGetters(['changeArr'])
  },
  methods:{
  	...mapActions(['btns'])
  }
};
</script>
