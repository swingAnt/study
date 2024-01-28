import axios from 'axios'
export default{
	
	common:{
		method:'GET',
		data:{},
		params:{},
        headers:{}
	},
	$axios( options={} ){
		
		options.method = options.method || this.common.method;
		options.data = options.data || this.common.data;
		options.params = options.params || this.common.params;
		options.headers = options.headers || this.common.headers;
        
		return axios(options)
		
	}
	
}