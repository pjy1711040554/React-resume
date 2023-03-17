import React, {Component, useState} from 'react'
import '../assets/css/message.css';

import Header from './index/header';
import {
    Button,
    Modal,
    Input,
    Form,
    AutoComplete,
    message,
    Divider,
    Comment,
    Tooltip,
    Avatar,
    Popconfirm,
    Spin
} from 'antd';

import {HeartTwoTone} from '@ant-design/icons';
import moment from 'moment';
import postAction from "../config/api";

// 里面的字符可以根据自己的需要进行调整
moment.locale('zh-cn', {
    relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '几秒',
        ss: '%d秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年'
    }
})

const {Option} = AutoComplete;
const {TextArea} = Input;

const RomdonColor = () => {
    let r, g, b
    r = 160 + Math.floor(Math.random() * 96)
    g = 160 + Math.floor(Math.random() * 96)
    b = 160 + Math.floor(Math.random() * 96)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
}
const CollectionCreateForm = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();
    const [result, setResult] = useState([]);
    const handleSearch = (value) => {
        let res = [];

        if (!value || value.indexOf('@') >= 0) {
            res = [];
        } else {
            res = ['qq.com', 'gmail.com', '163.com', 'sina.com', 'sohu.com'].map((domain) => `${value}@${domain}`);
        }

        setResult(res);
    };
    return (
        <Modal
            visible={visible}
            title="登录"
            okText="登录"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        onCreate(values);
                    })
                    .catch((info) => {
                    });
            }}
        >
            <Form form={form} layout="Horizontal" name="form_in_modal" initialValues={{modifier: 'public',}}>
                <Form.Item name="username" label="昵称" rules={[{required: true, message: '请输入昵称!'}]}>
                    <Input placeholder="请输入昵称"/>
                </Form.Item>
                <Form.Item name="email" label="邮箱"
                           rules={[{type: 'email', message: '邮箱格式不正确'}, {required: true, message: '请输入邮箱!'}]}
                           extra={'昵称若已存在，请验证邮箱号登陆'}>
                    <AutoComplete onSearch={handleSearch} placeholder="请输入邮箱">
                        {result.map((email) => (
                            <Option key={email} value={email}>
                                {email}
                            </Option>
                        ))}
                    </AutoComplete>
                </Form.Item>
            </Form>
        </Modal>
    );
};
const ExampleComment = ({item, index, children, huifuClick, deleteFun, deleteFlag}) => {
    return (
        <Comment
            key={index}
            actions={[<span key="comment-nested-reply-to" onClick={() => (huifuClick())}>回复</span>,
                deleteFlag &&
                <Popconfirm placement="top" title='是否删除评论' onConfirm={() => deleteFun()} okText="删除" cancelText="取消">
                    <span style={{color: '#1890ff'}}>删除</span>
                </Popconfirm>]}
            author={<span>{item.username}<span style={{color: '#ccc', marginLeft: '10px'}}>{item.area}</span></span>}
            avatar={item.img.indexOf('rgb(') === -1 ? item.img :
                <Avatar style={{color: '#FFF', backgroundColor: item.img}}>{item.username.substring(0, 1)}</Avatar>}
            content={<p>{item.content} </p>}
            datetime={<Tooltip title={moment(item.createtime).format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment(item.createtime).fromNow()}</span>
            </Tooltip>}
        >
            {children}
        </Comment>
    )
};

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blurClass: '',
            value: '',
            isLogin: false,
            isModalVisible: false,
            userinfo: {},
            list: [],
            hfitem: {},
            loading: true
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.init()
        }
    }

    componentDidMount() {
        this.init()
    }
    init(){
        let user = localStorage.getItem('user')
        if (user) {
            user = JSON.parse(user)
            this.setState({
                isLogin: true,
                userinfo: user
            })
        }
        this.getList()
        document.body.scrollTop = 0;
    }

    loginfun() {
        if (this.state.isLogin) {
            this.setState({isLogin: false, userinfo: {username: ''}})
            message.success('退出成功');
            localStorage.setItem('user', '')

        } else {
            this.setState({isModalVisible: true})
        }
    }

    onCreate(values) {
        postAction('/user/login', Object.assign({
            ip: localStorage.getItem('ip'),
            img: RomdonColor()
        }, values)).then(res => {
            message.success('登录成功');
            this.setState({isModalVisible: false, isLogin: true, userinfo: res.data})
            localStorage.setItem('user', JSON.stringify(res.data))
        })
    }

    submitfun() {
        if (!this.state.value) return message.error('请输入评论哦')
        let parentId
        if (this.state.hfitem.id && this.state.value.indexOf('@') !== -1) {
            parentId = this.state.hfitem.id
        }
        postAction('/message/send', Object.assign({
            content: this.state.value,
            userId: this.state.userinfo.id,
            userSpaceId: this.props.match.params.id || '情话',
            parentId: parentId || '',
        })).then(res => {
            this.setState({value: ''})
            message.success('评论成功');
            this.getList()
        })
    }

    huifuClick(item) {
        let focusEl = this.input; // this.input能找到input标签，因为ref属性里的回调函数将input标签复制给了组件的input属性，所以可以直接使用。
        focusEl.focus(); // 点击按钮时，光标焦点定位到focusEL所获得的标签元素上
        this.setState({
            value: `@${item.username}：`,
            hfitem: item
        })
    }

    deleteFun(id) {
        postAction('/message/delete', {id: id}).then(res => {
            this.getList()
        })
    }

    getList() {
        this.setState({loading: true})
        postAction('/message/list', {
            userSpaceId:this.props.match.params.id || '情话'
        }).then(res => {
            this.setState({list: res.data, loading: false})
        })
    }
    goMy(){
        this.props.history.push(`/infocenter/${this.state.userinfo.username}`);
    }


    render() {
        return (
            <div className={'main'}>
                <Header router={'message'}/>
                <div className={'p-textare ' + this.state.blurClass}
                     style={{marginBottom: this.state.isLogin ? '45px' : ''}}>
                    <div className={'title'}>
                        <div className={'left'}>
                            <HeartTwoTone
                                twoToneColor="#eb2f96"/> {this.state.isLogin ? ' 欢迎您，' + this.state.userinfo.username : ' 请先登录'}
                            {
                                this.state.userinfo.username !== this.props.match.params.id &&
                                this.state.userinfo.username &&
                                <a onClick={()=>this.goMy()} style={{'marginLeft':'10px'}}>去我的空间</a>

                            }
                        </div>
                        <div className={'right'}
                             onClick={(e) => this.loginfun()}>{this.state.isLogin ? '退出' : '登录'}</div>
                    </div>
                    <div className={'cont'}>
                        <TextArea value={this.state.value} onBlur={() => this.setState({blurClass: ''})}
                                  ref={(input) => {
                                      this.input = input;
                                  }}
                                  onChange={(e) => {
                                      this.setState({value: e.target.value})
                                  }}
                                  onFocus={() => this.setState({blurClass: 'active'})}/>
                    </div>
                    <CollectionCreateForm
                        visible={this.state.isModalVisible}
                        onCreate={this.onCreate.bind(this)}
                        onCancel={() => {
                            this.setState({isModalVisible: false})
                        }}
                    />
                    {this.state.isLogin && <Button onClick={this.submitfun.bind(this)}>确定</Button>}
                </div>
                <Spin spinning={this.state.loading} wrapperClassName={'message-spin'}>
                    {
                        this.state.list.map((item, index) => {
                            return <div key={index}>
                                <ExampleComment item={item} index={index}
                                                deleteFlag={this.state.userinfo.id === item.userid}
                                                huifuClick={e => this.huifuClick(item)}
                                                deleteFun={e => this.deleteFun(item.id)}>
                                    {
                                        item.children.map((item2, index2) => {
                                            return <ExampleComment item={item2} index={index2} key={item2.id}
                                                                   deleteFlag={this.state.userinfo.id === item2.userid}
                                                                   huifuClick={e => this.huifuClick(item)}
                                                                   deleteFun={e => this.deleteFun(item2.id)}/>
                                        })
                                    }

                                </ExampleComment>
                                <Divider/>
                            </div>
                        })
                    }
                </Spin>
            </div>
        )
    }
}
