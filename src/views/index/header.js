import React, {Component, useState, useEffect} from 'react'
import {Avatar} from 'antd';
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import { ReactComponent as QzoneSvg } from './Qzone.svg';


import '../../assets/css/header.css';
import postAction from "../../config/api";

function Sss() {
    const [age, setAge] = useState(19)

    useEffect(() => {
    }, []);
    useEffect(() => {
    }, [age]);

    const add = () => {
        setAge(age + 1)
        document.title = `You clicked ${age} times`;
    }
    return (
        <button onClick={() => add()}>{age}</button>
    )

}

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            router: props.router,
            userinfo:{},
            lookUserName: ''
        };
    }
    componentDidMount() {
        this.init()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.init()
        }
    }
    init(){
        let user = localStorage.getItem('user')
        if (user) {
            user = JSON.parse(user)
            this.setState({
                userinfo: user
            })
            setTimeout(()=>{
                if(this.state.lookUserName){
                    postAction('/user/getUser',{username:this.state.lookUserName}).then(res=>{
                        if(!res.data) this.props.history.push(`/message/`);
                    })
                }
            })
        }
        this.setState({
            lookUserName:this.props.match.params.id || ''
        })

    }
    goIndex(){
        this.props.history.push(`/infocenter/${this.state.lookUserName}`);
    }
    goMessage(){
        this.props.history.push(`/message/${this.state.lookUserName}`);
    }

    render() {
        return (
            <div>
                <div className={'header'}>
                    <QzoneSvg style={{ fill: '#fbcb01',width:120 }} />
                    {/*<Avatar size={120} fill={'red'}*/}
                    {/*        src={'https://qzonestyle.gtimg.cn/qzone/v8/img/Qzone.svg'}/>*/}
                    <div className={'name'}>
                        <span>{this.state.lookUserName ? this.state.lookUserName + '的空间' : '个人简历'}</span>
                    </div>
                    <div className={'tabs-box'}>
                        <div className={'tabs'}>
                            <div onClick={()=>this.goIndex()} style={{textDecoration: this.props.router === 'index' ? 'underline' : ''}}>
                                信息
                            </div>
                            <div onClick={()=>this.goMessage()} style={{textDecoration: this.props.router === 'message' ? 'underline' : ''}}>
                                留言
                            </div>
                            {/*{ this.state.userinfo.username &&*/}
                            {/*    <div onClick={()=>this.goMy()} style={{textDecoration: this.props.match.url === '/my' ? 'underline' : ''}}>*/}
                            {/*        我的简历*/}
                            {/*    </div>*/}
                            {/*}*/}

                            {/*<Link to={{pathname: '/years'}}*/}
                            {/*style={{textDecoration: this.state.router === 'years' ? 'underline' : ''}}>其他</Link>*/}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default  withRouter(Header)
