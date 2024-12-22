import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { database } from "../firebaseConfig.js";
import { getData } from "../firebaseFunctions.js";
import { useRecoilState } from "recoil";
import axios from 'axios';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from "../cloudDinaryConfig.js";
import { bannerState } from '../recoil/atom.jsx';

const { TextArea } = Input;

const BannerForm = ({ form, language }) => {
  const [banner, setBanner] = useRecoilState(bannerState);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchBannerData = async () => {
      const data = await getData(database, 'banner');
      if (data) {
        setBanner(data);
        form.setFieldsValue({
          ...form.getFieldsValue(),
          banner: data
        });
        if (data.content && data.content.image) {
          setImageUrl(data.content.image);
        }
      }
    };

    fetchBannerData();
  }, [setBanner, form]);

  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };

  const handleUpload = async () => {
    if (!file) {
      message.error('Please select an image to upload!');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const imageUrl = response.data.secure_url;
      setImageUrl(imageUrl);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        banner: {
          ...form.getFieldValue('banner'),
          content: {
            ...form.getFieldValue(['banner', 'content']),
            image: imageUrl
          }
        }
      });
      setFile(null);
      message.success('Upload successful!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Upload failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form.Item label="First Name" name={['banner', 'content', 'firstname']}>
        <Input />
      </Form.Item>
      <Form.Item label="Surname" name={['banner', 'content', 'surname']}>
        <Input />
      </Form.Item>
      <Form.Item label="Introduce" name={['banner', 'content', 'introduce', language]}>
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Role 1" name={['banner', 'content', 'role', 'role_1']}>
        <Input />
      </Form.Item>
      <Form.Item label="Role 2" name={['banner', 'content', 'role', 'role_2']}>
        <Input />
      </Form.Item>
      <Form.Item label="CV URL" name={['banner', 'content', 'cvUrl']}>
        <Input />
      </Form.Item>
      <Form.Item label="Facebook Link" name={['banner', 'content', 'facebookLink']}>
        <Input />
      </Form.Item>
      <Form.Item label="GitHub Link" name={['banner', 'content', 'githubLink']}>
        <Input />
      </Form.Item>
      <Form.Item label="LinkedIn Link" name={['banner', 'content', 'linkedinLink']}>
        <Input />
      </Form.Item>
      <Form.Item label="Image URL" name={['banner', 'content', 'image']}>
        <Input disabled value={imageUrl} />
      </Form.Item>
      <Form.Item label="Upload Image">
        <Upload
          beforeUpload={beforeUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Select Image</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          loading={loading}
          style={{ marginTop: 16 }}
        >
          Upload
        </Button>
      </Form.Item>
      {imageUrl && (
        <Form.Item label="Image Preview">
          <img src={imageUrl} alt="Image Preview" style={{ width: '200px', marginTop: '16px' }} />
        </Form.Item>
      )}
    </>
  );
};

export default BannerForm;
