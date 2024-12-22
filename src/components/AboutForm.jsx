import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { database } from "../firebaseConfig.js";
import { getData } from "../firebaseFunctions.js";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from 'axios';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from "../cloudDinaryConfig.js";
import { aboutState, allowedUsersLogin, userLoginState } from '../recoil/atom.jsx';
import { getAuth } from 'firebase/auth';

const { TextArea } = Input;

const AboutForm = ({ form, language }) => {
  const [about, setAbout] = useRecoilState(aboutState);
  const userLogin = useRecoilValue(userLoginState); 
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  useEffect(() => {
    const fetchAboutData = async () => {
      const data = await getData(database, 'about');
      if (data) {
        setAbout(data);
        form.setFieldsValue({
          ...form.getFieldsValue(),
          about: data
        });
        if (data.video && data.video[language]) {
          setVideoUrl(data.video[language]);
        }
      }
    };

    fetchAboutData();
  }, [setAbout, form, language]);

  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };

  const handleUpload = async () => {
    if (!file) {
      message.error('Please select a video to upload!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    setLoading(true);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const videoUrl = response.data.secure_url;
      setVideoUrl(videoUrl);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        about: {
          ...form.getFieldValue('about'),
          video: {
            ...form.getFieldValue(['about', 'video']),
            [language]: videoUrl
          }
        }
      });
      setFile(null);
      message.success('Upload successful!');
    } catch (error) {
      console.error('Error uploading video:', error);
      message.error('Upload failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form.Item label="Description" name={['about', 'content', language, 'description']}>
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Introduce" name={['about', 'content', language, 'introduce']}>
        <Input />
      </Form.Item>
      <Form.Item label="Video URL" name={['about', 'video', language]}>
        <Input value={videoUrl}  />
      </Form.Item>
      <Form.Item label="Upload Video">
        <Upload
          beforeUpload={beforeUpload}
          showUploadList={false}
          accept="video/*"
        >
          <Button icon={<UploadOutlined />}>Select Video</Button>
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
      {videoUrl && (
        <Form.Item label="Video Preview">
          <video controls src={videoUrl} style={{ width: '40%', marginTop: '16px' }} />
        </Form.Item>
      )}
    </>
  );
};

export default AboutForm;
