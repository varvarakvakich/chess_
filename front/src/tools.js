import Axios from 'axios'

let axiosParams = {
    timeout: 30000,
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    baseURL: 'http://127.0.0.1:3000',
};

const api = Axios.create(axiosParams);

api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


const tools = {
    api: api,
};

export default tools;