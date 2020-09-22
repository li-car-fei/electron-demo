import axios from 'axios'

const http = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    //withCredentials: true,          // 携带cookies
    crossDomain: true                // 跨域
})

export default http