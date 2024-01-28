<template>
  <div class="home">
    {{cartList}}
    {{pathList}}
    <button @click='btn'>按钮</button>

    <hr />
    {{num}}
    <button @click='add'>增加</button>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
  name: "Home",
  computed:{
    ...mapState({
      cartList:state=>state.cart.cartList,
      pathList:state=>state.path.pathList,
      num:state=>state.path.num
    })
  },
  methods:{
    ...mapMutations(['add']),
    btn(){
      this.pathList = "1111";
    }
  }
};
</script>
