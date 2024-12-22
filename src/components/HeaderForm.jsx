import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import { useRecoilState } from 'recoil';

import { getData } from "../firebaseFunctions.js";
import { database } from "../firebaseConfig.js"
import { headerState } from '../recoil/atom.jsx';

const HeaderForm = ({ form, language }) => {
  const [header, setHeader] = useRecoilState(headerState);

  useEffect(() => {
    const fetchHeaderData = async () => {
      const data = await getData(database, 'header');
      if (data) {
        setHeader(data);
        form.setFieldsValue({
          ...form.getFieldsValue(),
          header: data
        });
      }
    };

    fetchHeaderData();
  }, [setHeader, form]);

  return (
    <>
      <Form.Item label="First Name" name={['header', 'leftContent', 'firstname']}>
        <Input />
      </Form.Item>
      <Form.Item label="Surname" name={['header', 'leftContent', 'surname']}>
        <Input />
      </Form.Item>
    </>
  );
};

export default HeaderForm;
