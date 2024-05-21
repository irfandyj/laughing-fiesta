import { history, connect, Dispatch, } from 'umi';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect } from 'react';

import './AuthenticatedLayout.module.css'
import { Model } from '@/models';
import { Routes } from '@/routes/routes';
import { PROFILE_ACTIONS } from '@/models/profile/profile.constants';

interface AuthenticatedLayoutProps {
  dispatch: Dispatch;
}

const { Content, Sider } = Layout;

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = (props) => {
  const { children, dispatch } = props;

  useEffect(() => {
    // Checks if the user is authenticated
    const profile = localStorage.getItem(Model.PROFILE);
    
    // If user has no 'profile' in localStorage, redirect to login page
    if (!profile) {
      history.push(Routes.SIGN_IN)
      return
    }

    // If user has 'profile' in localStorage,
    const profileHashmap = JSON.parse(profile);
    // Request the user's profile from the server
      // If success, set the user's profile in localStorage
        // Page stays the same
      // If fail or expire token, redirect to login page
    try {
      dispatch({
        type: PROFILE_ACTIONS.SETUP_PROFILES,
        payload: profileHashmap
      })
    } catch (e) {
      console.error(e)
      history.push(Routes.SIGN_IN)
    }
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

const mapStateToProps = (state: any) => {
  return {}
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticatedLayout)