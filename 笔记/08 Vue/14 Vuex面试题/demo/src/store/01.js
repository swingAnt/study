import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	str:'你好',
  	arr:['a','b','c'],
  	num:1
  },
  getters:{
  	changeArr( state ){
  		console.log( 1 );
  		return state.arr.join('=');
  	}
  },
  mutations: {
  	btn( state , c ){
  		console.log(state.str ,  c);
  	},
  	add(state){
  		state.num++;
  	}
  },
  actions: {
  	btns({commit,state}){
  		console.log(commit, state.str );
  	},
  	changeAdd({commit}){
  		setTimeout(()=>{
  			commit('add')
  		})
  	}
  },
  //modules: {},
});
