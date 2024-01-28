import axios from 'axios'
export default{
	$axios( options ){
		return axios({
			url:options.url
		})
	}
}