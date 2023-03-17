import React, {Component} from 'react'
import {Divider, Row, Col, message, Spin, Image,Modal} from 'antd'
import '../assets/css/index.css';
import { withRouter } from 'react-router-dom';
import {
    EditOutlined, CheckCircleOutlined, DeliveredProcedureOutlined, DownloadOutlined
} from '@ant-design/icons';
import Header from './index/header';
import PublicForm from './index/form';
import PublicFormWj from './index/formWj';
import PublicFormList from './index/formList';
import postAction from "../config/api";
const IsPC = () => {
    var userAgentInfo = navigator.userAgent;
    var Agents = ['Android', 'iPhone',
        'SymbianOS', 'Windows Phone',
        'iPad', 'iPod'
    ];
    var flag = true;
    for (var i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) != -1) {
            flag = false;
            break;
        }
    }
    return flag;
}
const fallback = 'data:image/png;base64,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'
 class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            userinfo: {},
            resume: {
                www:'www.666.com',
                xm: '姓名',
                gzjy: '工作经验',
                zzmm: '政治面貌',
                nl: '年龄',
                xb: '性别',
                dh: '电话',
                yx: '邮箱',
                qzgw: '求职岗位',
                yxcs: '意向城市',
                dgsj: '到岗时间',
                jnzw: '技能掌握',
                zwpj: '自我评价',
            },
            jyjlList: [
                {js: '简述', sj: '时间'}
            ],
            gzjlList: [
                {gsmc: '公司名称', gwmc: '岗位名称', sj: '时间', ms: '描述'}
            ],
            xmjyList: [
                {xmmc: '项目名称', gwmc: '岗位名称', sj: '时间', ms: '描述', fileList: []}
            ],
            PublicFormModalShow: false,
            PublicFormModalList: [],
            PublicFormModalShow2: false,
            PublicFormModalList2: [],
            resumeList: [],
            PublicFormModalList2name: '',
            PublicFormModalShow3: false,
            count: 0,
            daochu: false
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
                 userinfo: user,
                 isAdd: true,
                 loading: false
             })
         }

         this.getJlxx()

         // this.getFwCount()
     }

    getFwCount() {
        postAction('/visitor/count', {}).then(res => {
            this.setState({count: res.data})
        })
    }

    getJlxx() {
        this.setState({loading: true})
        postAction('/resume/getByUserId', {userId: this.props.match.params.id || '情话'}).then(res => {
            if(res.data){
                res.data.jlFileList = [
                    {
                        uid: '-1',
                        name: res.data.jlurl,
                        status: 'done',
                        url: res.data.jlurl,
                        response: {
                            data: res.data.jlurl
                        }
                    },
                ]
            }


            this.setState({
                resume: res.data || {},
                isAdd: res.data ? false : true
            })
            if (res.data) {
                if (res.data.jyjl) res.data.jyjl = res.data.jyjl.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
                if (res.data.gzjl) res.data.gzjl = res.data.gzjl.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
                if (res.data.xmjy) res.data.xmjy = res.data.xmjy.replace(/\n/g, "\\n").replace(/\r/g, "\\r")

                let jyjl = res.data.jyjl ? JSON.parse(res.data.jyjl) : []
                let gzjl = res.data.gzjl ? JSON.parse(res.data.gzjl) : []
                let xmjy = res.data.xmjy ? JSON.parse(res.data.xmjy) : []
                xmjy.map(item => {
                    item.imgs = item.imgs ? item.imgs.split(',') : []
                    item.fileList = []
                    item.imgs.map((item2, index2) => {
                        item.fileList.push({
                            uid: index2,
                            name: item2,
                            status: 'done',
                            url: item2,
                            response: {
                                data: item2
                            }
                        },)
                    })
                })

                this.setState({
                    jyjlList: jyjl,
                    gzjlList: gzjl,
                    xmjyList: xmjy,
                })
            }
            this.setState({loading: false})
        })
    }

    openModal(type) {
        if (!this.state.isEdit) return
        let list = []
        if (type === 'grxx') {
            list = [
                {label: '姓名', name: 'xm', type: 'input'},
                {label: '工作经验', name: 'gzjy', type: 'input'},
                {label: '政治面貌', name: 'zzmm', type: 'input'},
                {label: '年龄', name: 'nl', type: 'input'},
                {label: '性别', name: 'xb', type: 'input'},
                {label: '电话', name: 'dh', type: 'input'},
                {label: '邮箱', name: 'yx', type: 'input'},
            ]
        } else if (type === 'qzyx') {
            list = [
                {label: '求职岗位', name: 'qzgw', type: 'input'},
                {label: '意向城市', name: 'yxcs', type: 'input'},
                {label: '到岗时间', name: 'dgsj', type: 'input'},
            ]
        } else if (type === 'jnzw') {
            list = [
                {label: '技能掌握', name: 'jnzw', type: 'textarea'},
            ]
        } else if (type === 'zwpj') {
            list = [
                {label: '自我评价', name: 'zwpj', type: 'textarea'},
            ]
        }
        this.setState({PublicFormModalList: list, PublicFormModalShow: true})
    }

    async PublicFormOk(values) {
        if (this.state.isAdd) {
            await postAction('/resume/save', Object.assign({userId: this.state.userinfo.username}, values)).then(res => {
            })
        } else {
            await postAction('/resume/updateByuserid', Object.assign({userId: this.state.userinfo.username}, values)).then(res => {
            })
        }
        this.setState({PublicFormModalShow: false})
        message.success('修改成功')
        this.getJlxx()
    }

    openModal2(type) {
        if (!this.state.isEdit) return
        let list = []
        let list2 = []
        if (type === 'jyjl') {
            list = [
                {label: '简述', name: 'js', type: 'input'},
                {label: '时间', name: 'sj', type: 'input'},
            ]
            list2 = this.state.jyjlList
        } else if (type === 'gzjl') {
            list = [
                {label: '公司名称', name: 'gsmc', type: 'input'},
                {label: '岗位名称', name: 'gwmc', type: 'input'},
                {label: '时间', name: 'sj', type: 'input'},
                {label: '描述', name: 'ms', type: 'textarea'},
            ]
            list2 = this.state.gzjlList
        } else if (type === 'xmjy') {
            list = [
                {label: '项目名称', name: 'xmmc', type: 'input'},
                {label: '岗位名称', name: 'gwmc', type: 'input'},
                {label: '时间', name: 'sj', type: 'input'},
                {label: '描述', name: 'ms', type: 'textarea'},
                {label: '照片', name: 'fileList', type: 'img'},
            ]
            list2 = this.state.xmjyList
        }
        this.setState({
            PublicFormModalList2: list,
            PublicFormModalShow2: true,
            PublicFormModalList2name: type,
            resumeList: list2
        })
    }

    async PublicFormOk2(values) {
        values.list.map(item => {
            let imgs = []
            item.fileList && item.fileList.map(item2 => {
                imgs.push(item2.response.data)
            })
            item.imgs = imgs.join(',')
            delete item.fileList
        })
        var data = JSON.stringify(values.list)
        let name = [this.state.PublicFormModalList2name]
        if (this.state.isAdd) {
            await postAction('/resume/save', Object.assign({
                userId: this.state.userinfo.username,
                [name]: data
            })).then(res => {
            })
        } else {
            await postAction('/resume/updateByuserid', Object.assign({
                userId: this.state.userinfo.username,
                [name]: data
            })).then(res => {
            })
        }
        this.setState({PublicFormModalShow2: false})
        message.success('修改成功')
        this.getJlxx()
    }

    openModal3() {
        if (!this.state.isEdit) return
        this.setState({
            PublicFormModalShow3: true,
        })
    }

    async PublicFormOkWj(values) {
        let jlurl = (values.fileList && values.fileList[0] && values.fileList[0].response && values.fileList[0].response.data) || ''
        await postAction('/resume/updateByuserid', {userId: this.state.userinfo.username, jlurl: jlurl}).then(res => {
        })
        this.setState({PublicFormModalShow3: false})
        message.success('修改成功')
        this.getJlxx()
    }

    daochu() {
        this.setState({daochu: true})
        setTimeout(() => {
            window.print()
            this.setState({daochu: false})
        }, 500)
    }

    render() {
        return (
            <div className={this.state.daochu ? 'main daochu' : 'main'}>
                <Header router={'index'}></Header>
                {!this.state.daochu && IsPC() &&
                <div className={'daochuFlex'}><span onClick={() => this.daochu()}><DownloadOutlined
                    style={{fontSize: '25px'}}/></span></div>}
                <Spin spinning={false}>
                    <div className={this.state.isEdit ? 'jianli jl-edit' : 'jianli'}>
                        {
                            this.state.userinfo.username === this.props.match.params.id && this.state.userinfo.username && <div className={'jianli-top'}>
                                <div className={'jianli-top-name'}>我的简历</div>
                                <div className={'jianli-top-right'}>
                                    {!this.state.isEdit && <span onClick={() => {
                                        this.setState({isEdit: true})
                                    }}><EditOutlined/>编辑</span>}
                                    {this.state.isEdit && <span onClick={() => {
                                        this.setState({isEdit: false})
                                    }}><CheckCircleOutlined/>完成</span>}
                                </div>
                            </div>
                        }
                        <div className={'jianli-main'} id={'jspdf'}>

                            <div className={'page'}>
                                <div className={'jl-grxx jl-border-dashed'} onClick={this.openModal.bind(this, 'grxx')}>
                                    <strong>{this.state.resume.xm}</strong>
                                    <Row>
                                        <Col span={24}>
                                            {this.state.resume.gzjy}
                                            <Divider type="vertical"/>{this.state.resume.zzmm}
                                            <Divider type="vertical"/>{this.state.resume.nl}
                                            <Divider type="vertical"/>{this.state.resume.xb}
                                        </Col>
                                        <Col span={24}>电话：{this.state.resume.dh}</Col>
                                        <Col span={24}>邮箱：{this.state.resume.yx}</Col>
                                    </Row>
                                </div>

                                <div className={'jl-qzyx'}>
                                    <h4 className={'jl-title'}>求职意向</h4>
                                    <div>
                                        <Row className={'qzyx-row  jl-border-dashed'}
                                             onClick={this.openModal.bind(this, 'qzyx')}>
                                            <Col xs={24} sm={12} md={8}>求职岗位：{this.state.resume.qzgw}</Col>
                                            <Col xs={24} sm={12} md={8}>意向城市：{this.state.resume.yxcs}</Col>
                                            <Col xs={24} sm={12} md={8}>到岗时间：{this.state.resume.dgsj}</Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'jl-qzyx'}
                                     style={{display: this.state.jyjlList.length > 0 || this.state.isEdit ? 'block' : 'none'}}>
                                    <h4 className={'jl-title'}>教育经历</h4>
                                    <div>
                                        <Row className={'qzyx-row  jl-border-dashed'}
                                             onClick={this.openModal2.bind(this, 'jyjl')}>
                                            {this.state.jyjlList.map((item, index) => (
                                                <Col span={24} key={index} className={'paddingright100'}>{item.js}<span
                                                    className={'jl-rq'}>{item.sj}</span></Col>
                                            ))}
                                        </Row>
                                    </div>
                                </div>
                                <div className={'jl-qzyx'}>
                                    <h4 className={'jl-title'}>工作经历</h4>
                                    <div>
                                        <Row className={'qzyx-row jl-border-dashed'}
                                             onClick={this.openModal2.bind(this, 'gzjl')}>
                                            {this.state.gzjlList.map((item, index) => (
                                                <div key={index} style={{width: '100%'}}>
                                                    <Col span={24}
                                                         className={'paddingright100'}><strong>{item.gsmc}</strong><span
                                                        className={'jl-rq'}>{item.sj}</span></Col>
                                                    <Col span={24}>{item.gwmc}</Col>
                                                    <Col style={{
                                                        whiteSpace: 'pre-wrap',
                                                        fontSize: '12px'
                                                    }}>{item.ms}</Col>
                                                </div>
                                            ))}
                                        </Row>
                                    </div>
                                </div>
                                <div className={'jl-qzyx'}>
                                    <h4 className={'jl-title'}>技能掌握</h4>
                                    <div>
                                        <Row className={'qzyx-row jl-border-dashed'}
                                             onClick={this.openModal.bind(this, 'jnzw')}>
                                            <Col span={24}
                                                 style={{whiteSpace: 'pre-wrap'}}>{this.state.resume.jnzw}</Col>
                                        </Row>
                                    </div>
                                </div>
                                {
                                    this.state.resume.yx === '1711040554@qq.com'
                                    &&
                                    <div className={'jl-qzyx jz-wsjl'}>
                                        <h4 className={'jl-title'}>开源项目</h4>
                                        <div>
                                            <Row className={'qzyx-row jl-border-dashed'}>
                                                <Col span={24} style={{whiteSpace: 'pre-wrap'}}>
                                                    可视化工具：<a href="https://github.com/pjy1711040554/Config-tool" target={'_blank'}>https://github.com/pjy1711040554/Config-tool</a>
                                                    <br/>
                                                    简历空间：<a href="https://github.com/pjy1711040554/React-resume" target={'_blank'}>https://github.com/pjy1711040554/React-resume</a>

                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                }
                                <div className={'jl-qzyx jl-zwpj1'}>
                                    <h4 className={'jl-title'}>自我评价</h4>
                                    <div>
                                        <Row className={'qzyx-row jl-border-dashed'}
                                             onClick={this.openModal.bind(this, 'zwpj')}>
                                            <Col span={24} style={{whiteSpace: 'pre-wrap'}}>
                                                {this.state.resume.zwpj}
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                            <div className={'jl-qzyx'}>
                                <h4 className={'jl-title'}>项目经验</h4>
                                <div className={'jl-border-dashed'} onClick={this.openModal2.bind(this, 'xmjy')}>
                                    {this.state.xmjyList.map((item, index) => (
                                        <Row className={'xmjy-row'} key={index}>
                                            <Col span={24}
                                                 className={'paddingright100'}><strong>{item.xmmc}</strong><span
                                                className={'jl-rq'}>{item.sj}</span></Col>
                                            <Col span={24}>{item.gwmc}</Col>
                                            <Col span={24}
                                                 style={{whiteSpace: 'pre-wrap', fontSize: '12px'}}>{item.ms}</Col>
                                            {!this.state.daochu && <Col soan={24}>
                                                <Image.PreviewGroup>
                                                    {typeof item.imgs === 'object' && item.imgs.map((item, index2) => (
                                                        <Image
                                                            key={index2}
                                                            width={80}
                                                            height={80}
                                                            src={item}
                                                            preview={this.state.isEdit ? false : true}
                                                            fallback={fallback}
                                                            className={'ant-img'}
                                                        />
                                                    ))}
                                                </Image.PreviewGroup>
                                            </Col>}
                                        </Row>
                                    ))}
                                </div>
                            </div>
                            <div className={'jl-qzyx jz-zwpj2'}>
                                <h4 className={'jl-title'}>自我评价</h4>
                                <div>
                                    <Row className={'qzyx-row jl-border-dashed'}
                                         onClick={this.openModal.bind(this, 'zwpj')}>
                                        <Col span={24} style={{whiteSpace: 'pre-wrap'}}>
                                            {this.state.resume.zwpj}
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <div className={'llcs'}>浏览量：{this.state.count + 1}次</div>
                        </div>
                    </div>
                </Spin>
                <div className="footer">
                    <a href="https://beian.miit.gov.cn/">陇ICP备2021000285号-1</a>
                </div>
                <PublicForm
                    title={'修改'}
                    list={this.state.PublicFormModalList}
                    initialValues={this.state.resume}
                    visible={this.state.PublicFormModalShow}
                    onCreate={this.PublicFormOk.bind(this)}
                    onCancel={() => {
                        this.setState({PublicFormModalShow: false})
                    }}
                />
                <PublicFormList
                    title={'修改'}
                    list={this.state.PublicFormModalList2}
                    initialValues={this.state.resumeList}
                    visible={this.state.PublicFormModalShow2}
                    onCreate={this.PublicFormOk2.bind(this)}
                    onCancel={() => {
                        this.setState({PublicFormModalShow2: false})
                    }}
                />
                <PublicFormWj
                    title={'上传简历'}
                    initialValues={this.state.resume}
                    visible={this.state.PublicFormModalShow3}
                    onCreate={this.PublicFormOkWj.bind(this)}
                    onCancel={() => {
                        this.setState({PublicFormModalShow3: false})
                    }}
                />

            </div>
        )
    }
}
export default withRouter(Index)