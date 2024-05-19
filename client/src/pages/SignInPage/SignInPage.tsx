import { Link } from 'umi';
import { Layout } from 'antd';
import type { FormProps } from 'antd';
import { Card, Button, Form, Input } from 'antd';
import 'antd-css-utilities/utility.min.css';
import './SignInPage.module.css'

type FieldType = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Layout className='h-screen SignInPage'>

      <Card className='SignInPage__card ma-auto '>
        <h1>Sign In</h1>
        <Form
          name="basic"
          layout='vertical'
          // style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
        >

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" className='w-full' htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

        <div className='SignInPage__links'>
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/signup">To sign up page</Link>
        </div>

      </Card>

    </Layout>
  )
}

