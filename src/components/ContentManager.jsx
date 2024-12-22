import React, {useRef, useState} from 'react';
import {Button, Dropdown, Form, Layout, message, Tabs} from 'antd';
import AboutForm from './AboutForm.jsx';
import BannerForm from './BannerForm.jsx';
import HeaderForm from './HeaderForm.jsx';
import PersonalProjectsForm from "./PersonalProjectForm.jsx";
import {getData, updateData} from "../firebaseFunctions.js";
import {auth, database} from "../firebaseConfig.js";
import {getAuth, signOut} from "firebase/auth";
import RealProjects from './real_projects/RealProjects.jsx';
import { useSetRecoilState } from 'recoil';
import { currentLanguage } from '../recoil/atom.jsx';
import PageHeader from './header/PageHeader.jsx';

const {Content } = Layout;
const logout = async (auth) => {
  try {
    await signOut(auth);
  } catch (error) {}
};
const ContentManager = () => {
  const [form] = Form.useForm();
  const [iframeKey, setIframeKey] = useState(0);
  const [appKey, setAppKey] = useState(1);
  const setCurrentLanguage = useSetRecoilState(currentLanguage);
  const [language, setLanguage] = useState('en-US'); // Thêm trạng thái cho ngôn ngữ
  const [activeTab, setActiveTab] = useState('1'); // Thêm trạng thái cho tab hiện tại
  const currentUser = getAuth().currentUser;
  const onFinish = async (values) => {
    try {
      setIframeKey(iframeKey + 1); // This will force the iframe to reload

      // Cập nhật dữ liệu của tab hiện tại
      switch (activeTab) {
        case '1':
          // await updateData(database, 'about', values.about);
          message.success('About tab updated successfully.');
          break;
        case '2':
          // await updateData(database, 'banner', values.banner);
          message.success('Banner tab updated successfully.');
          break;
        case '3':
          // await updateData(database, 'header', values.header);
          message.success('Header tab updated successfully.');
          break;
        case '4':
          // await updateData(database, 'personalProjects', values.personalProjects);
          message.success('Personal Projects tab updated successfully.');
          break;
          case '5':
            if(!values.realProjects) {
              await updateData(database, 'realProjects',{});
            } else {
              const originalData = await getData(database, 'realProjects');
              if(!originalData) {
                await updateData(database, 'realProjects', values.realProjects);
                return;
              }

              for (const key of Object.keys(values.realProjects)) {

                await updateData(database, `realProjects/${key}/${language}`, values.realProjects[key][language]);
            
              }

              const keysToDelete = Object.keys(originalData).filter(key => !Object.keys(values.realProjects).includes(key));
              for (const key of keysToDelete) {
                await updateData(database, `realProjects/${key}`, null);
              }

            }
            message.success('Personal Projects tab updated successfully.');
            setTimeout(() => {
              setAppKey(appKey => appKey + 1);
            },1000)
            break;
        default:
          break;
      }
    } catch (error) {
      message.error('Error updating data: ' + error.message);
    }
  };

  const handleLogout = () => {
    logout(auth)
    console.log('Logout');
  };

  const handleLanguageChange = ({ key }) => {
    setLanguage(key); // Cập nhật ngôn ngữ
    setCurrentLanguage(key)
    setAppKey(appKey => appKey + 1);
  };


  const tabItems = [
    {
      key: '1',
      label: 'About',
      children: <AboutForm form={form} language={language} />, // Truyền ngôn ngữ hiện tại vào form
    },
    {
      key: '2',
      label: 'Banner',
      children: <BannerForm form={form} language={language} />,
    },  
    {
      key: '3',
      label: 'Header',
      children: <HeaderForm form={form} language={language} />,
    },
    {
      key: '4',
      label: 'Personal Projects',
      children: <PersonalProjectsForm form={form} language={language} />,
    },
    {
      key: '5',
      label: 'Real Projects',
      children: <RealProjects form={form}  />,
    },
  ];

  return (
    <Layout key={appKey}>
      <PageHeader 
      handleLanguageChange={handleLanguageChange}
      handleLogout={handleLogout}
      currentUser={currentUser}
      language={language}
      />
      <Content style={{ padding: '20px' }}>   
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Tabs
                defaultActiveKey="1"
                items={tabItems}
                onChange={(key) => setActiveTab(key)} // Cập nhật trạng thái khi tab thay đổi
              />
              <Form.Item className='mt-6'>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ContentManager;
