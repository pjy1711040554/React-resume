import React, {Component} from 'react'
import Header from './index/header';
// const socket = require('socket.io-client')('http://localhost:1234');
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userinfo: {},
        }
    }

     componentDidMount() {
        let user = localStorage.getItem('user')
        if (user) {
            user = JSON.parse(user)
            this.props.history.push(`/infocenter/${user.username}`);
        }else{
            this.props.history.push(`/message/`);
        }
         // socket.on('userChange', function(msg) {
         //     console.log(msg)
         // });

    }

    render() {
        return (
            <div>111</div>
        )
    }
}
