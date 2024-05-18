import Axios from 'axios'

const axios = Axios.create({
    // baseURL: 'https://app-api.tiny-cms.com/api',
    baseURL:'http://127.0.0.1:8000/api',
    withCredentials: true,
    withXSRFToken: true
})

export default axios