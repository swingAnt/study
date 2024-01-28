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
export default{
  created(){
    // var date = new Date();
    // var time = 3600*60*60*24;
    // time = date.getTime() + time;
    // date.setTime(time);

    // document.cookie = 'name=789;expires='+date.toUTCString()+'';
    
    var date = new Date(1998,1,1);
    document.cookie = 'name=789;expires='+date.toUTCString()+'';

  }
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
