import {Form, Input, Button, Upload, Modal} from 'antd';
import {MinusCircleOutlined, PlusOutlined,UploadOutlined} from '@ant-design/icons';
import React, {useState} from 'react';
import config from '../../config/config.js'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const PublicFormList = ({visible, onCreate, onCancel, title, list, initialValues}) => {
    const [form] = Form.useForm();
    form.setFieldsValue({ list: initialValues });
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }


    return (
        <Modal
            destroyOnClose={true}
            visible={visible}
            title={title || '弹出框'}
            okText="确定"
            cancelText="取消"
            width="800px"
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
            <Form name="dynamic_form_nest_item" autoComplete="off" form={form}>
                <Form.List name="list">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map((field, index) => {
                                return <div key={field.key + index} className={'form-list-row'}>
                                    <div className={'title'}>第{index + 1}条</div>
                                    {list.map((item, index2) => {
                                        if(item.type === 'input') {
                                            return <Form.Item
                                                label={item.label}
                                                key={index + '' + index2}
                                                {...field}
                                                name={[field.name, item.name]}
                                                initialValue={initialValues[index] ? initialValues[index][item.name] :''}
                                                fieldKey={[field.fieldKey, item.name]}
                                            >
                                                <Input placeholder={'请输入' + item.label}/>
                                            </Form.Item>
                                        }else if(item.type === 'textarea') {
                                            return <Form.Item
                                                label={item.label}
                                                key={index2 + '' + index}
                                                {...field}
                                                initialValue={initialValues[index] ? initialValues[index][item.name] :''}
                                                name={[field.name, item.name]}
                                                fieldKey={[field.fieldKey, item.name]}
                                            >
                                                <Input.TextArea placeholder={'请输入' + item.label}  rows={5} />
                                            </Form.Item>
                                        // }else if(item.type === 'img') {
                                        }else if(item.type === 'ssssss') {
                                            return   <Form.Item
                                                name={[field.name, item.name]}
                                                label={item.label}
                                                key={index2 + '' + index}
                                                valuePropName="fileList"
                                                getValueFromEvent={normFile}
                                            >
                                                <Upload name="file" action={baseUrl +'/file/upload'} listType="picture-card"  headers={{'Accept': '*/*','Origin': '*'}} fileList={item.fileList}>
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8 }}>上传</div>
                                                    </div>
                                                </Upload>

                                            </Form.Item>
                                        }
                                    })}
                                    <MinusCircleOutlined onClick={() => remove(field.name)}/>
                                </div>
                            })}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                    增加
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default PublicFormList;
