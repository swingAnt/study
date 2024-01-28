<template>
	<div>
		这是想请页===>{{content}}
	</div>
</template>

<script type="text/javascript">
import request from '../api/request.js'
export default{
	data () {
		return {
			content:'',
			id:0
		}
	},
	created(){

		this.id = this.$route.query.id;

		this.getData();
	},
	methods:{
		getData(){
			request.$axios({
				url:'/id',
				params:{
					id:this.id
				}
			}).then(res=>{
				this.content = res.data.content;
			})
		}
		
	},
	activated(){
		if( this.id != this.$route.query.id  ){
			this.id = this.$route.query.id
			this.getData();
		}
	}
}
</script>