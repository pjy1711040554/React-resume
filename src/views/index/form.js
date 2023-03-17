import React, {useState} from 'react';
import {Modal, Form, Input} from 'antd';

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};
const PublicForm = ({visible, onCreate, onCancel, title, list,initialValues}) => {
    const [form] = Form.useForm();
    return (
        <Modal
            destroyOnClose={true}
            visible={visible}
            title={title || '弹出框'}
            okText="确定"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >

            <Form
                {...layout}
                form={form}
                preserve={false}>
                {
                    list.map((item,index) => {
                        if(item.type === 'input'){
                            return <Form.Item initialValue={initialValues[item.name]} key={index} name={item.name} label={item.label} rules={[{
                                required: item.required ? true : false,
                                message: '请输入' + item.label,
                            },]}>
                                <Input placeholder={'请输入' + item.label}/>
                            </Form.Item>
                        }else if(item.type === 'textarea'){
                            return <Form.Item initialValue={initialValues[item.name]} key={index} name={item.name} label={item.label} rules={[{
                                required: item.required ? true : false,
                                message: '请输入' + item.label,
                            },]}>
                                <Input.TextArea placeholder={'请输入' + item.label}  rows={15} />
                            </Form.Item>
                        }else{
                            return <Form.Item initialValue={initialValues[item.name]} key={index} name={item.name} label={item.label} rules={[{
                                required: item.required ? true : false,
                                message: '请输入' + item.label,
                            },]}>
                                <Input placeholder={'请输入' + item.label}/>
                            </Form.Item>
                        }
                    })
                }
            </Form>
        </Modal>
    );
};

export default PublicForm;
