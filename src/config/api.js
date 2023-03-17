import config from './config.js'
import axios from 'axios';
import {message} from 'antd';

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
// const baseUrl = config.baseUrl.pro
//
export default function postAction(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + url, data).then(res => {
            if (res.data.code == 200) {
                resolve(res.data)
            } else {
                message.error(res.data.message);
            }
        })
    })
}
