import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect } from 'react';

import './AuthenticatedLayout.module.css'

const { Content, Sider } = Layout;

const AuthenticatedLayout: React.FC = (props) => {
  const { children } = props;

  useEffect(() => {
    // Checks if the user is authenticated
    // If user has no 'profile' in localStorage, redirect to login page
    // If user has 'profile' in localStorage,
      // Request the user's profile from the server
        // If success, set the user's profile in localStorage
          // Page stays the same
        // If fail or expire token, redirect to login page
  }, [])

  return (
    <Layout className='AuthenticatedLayout'>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
            (icon, index) => ({
              key: String(index + 1),
              icon: React.createElement(icon),
              label: `nav ${index + 1}`,
            }),
          )}
        />
      </Sider>
      {/* <Header className="site-layout-sub-header-background" style={{ padding: 0 }} /> */}
      <Content>
        {children}
      </Content>
      {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
    </Layout>
  );
}

export default AuthenticatedLayout;