import VietNameFlag from './/VietNamFlag.jsx';
import EnglishFlag from './EnglishFlag.jsx'
import {DownOutlined, UserOutlined} from '@ant-design/icons';
import React from 'react';
import {Button, Dropdown, Layout} from 'antd';

const { Header } = Layout;

const userItems = (handleLogout)=>(
  [
    {
      label: (
        <div>Profile</div>
      ),
      key: '0',
    },
    {
      label: (
        <div onClick={handleLogout}>Logout</div>
      ),
      key: '1',
    },
    {
      type: 'divider',
    }
  ]
);

const languageItems = (handleLanguageChange)=>([
  {
    label: (
      <div onClick={() => handleLanguageChange({ key: 'en-US' })}>English</div>
    ),
    key: 'en-US',
  },
  {
    label: (
      <div onClick={() => handleLanguageChange({ key: 'vi-VN' })}>Tiếng Việt</div>
    ),
    key: 'vi-VN',
  },
  {
    type: 'divider',
  }
]);


function PageHeader({handleLanguageChange,handleLogout,currentUser, language}){

    return (
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
        <Dropdown menu={{ items: languageItems(handleLanguageChange) }} trigger={['click']}>
          <Button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {language === 'en-US' ? <EnglishFlag/>: <VietNameFlag/>}  
            </div>
           
            <DownOutlined />
          </Button>
        </Dropdown> 
        <Dropdown menu={{ items: userItems(handleLogout) }} trigger={['click']}>
          <Button icon={<UserOutlined />}>
            {currentUser && currentUser.displayName} <DownOutlined />
          </Button>
        </Dropdown>
      </Header>
    )

}


export default PageHeader;


