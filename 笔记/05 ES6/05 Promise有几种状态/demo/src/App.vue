<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>
<script type="text/javascript">
import http from './api/http'
export default{
  async created(){
    let t = await http.$axios({url:'/home'});
    let p = await http.$axios({url:'/list'});
  
    console.log( t.data , p.data )
  }
  // created(){

  //   let t = this.getData();

  //   t.next().value.then(res=>{
  //     console.log( res )
  //   })
   
  //   t.next().value.then(res=>{
  //     console.log( res )
  //   })


  // },
  // methods:{
  //   * getData(){
  //     yield http.$axios({url:'/home'});
  //     yield http.$axios({url:'/list'});
  //   }
  // }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
