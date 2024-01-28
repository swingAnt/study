<template>
  <div class="home">

  		<ul>
  			<li 
  				v-for='item in courseList' 
  				:key='item.id'
  				@click='goDetail(item.id)'
  			>
  				{{ item.name }}
  			</li>
  		</ul>

  </div>
</template>

<script>
import request from '../api/request.js'
export default {
  name: "Home",
  data () {
  	return {
  		courseList:[]
  	}
  },
  created(){
  	request.$axios({
  	 	url:'/course'
  	 }).then(res=>{
  	 	this.courseList = res.data.courseList;
  	 })
  },
  methods:{
  	goDetail( id ){
  		this.$router.push({
  			path:'/detail',
  			query:{
  				id
  			}
  		})
  	}
  }
};
</script>
