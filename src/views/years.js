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
             this.setState({
                userinfo: user,
                isAdd: true,
                loading: false
            })
        }
         // socket.on('userChange', function(msg) {
         //     console.log(msg)
         // });

    }

    render() {
        return (
            <div className={'main'}>
                <Header router={'years'}/>
            </div>
        )
    }
}
