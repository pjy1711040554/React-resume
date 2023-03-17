import React, {} from 'react';
import {Modal, Form, Upload, Button} from 'antd';
import {UploadOutlined,} from '@ant-design/icons';
import config from '../../config/config.js'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro


const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};
const PublicFormWj = ({visible, onCreate, onCancel, title, initialValues}) => {
    const [form] = Form.useForm();
    form.setFieldsValue({ fileList: initialValues.jlFileList });

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <Modal destroyOnClose={true} visible={visible} title={title || '弹出框'} okText="确定" cancelText="取消"
               onCancel={onCancel}
               onOk={() => {
                   form.validateFields().then((values) => {
                       onCreate(values);
                   })
               }}>
            <Form
                {...layout} form={form} preserve={false}>
                <Form.Item name="fileList" label="简历" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload name="file" action={baseUrl + '/file/upload'} fileList={initialValues.jlFileList}
                            rules={[{required: true, message: '请选择!'}]}>
                        <Button icon={<UploadOutlined/>}>点击上传</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PublicFormWj;
