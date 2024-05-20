import { Link } from 'umi';
import { Layout } from 'antd';
import type { FormProps } from 'antd';
import { Card, Button, Form, Input } from 'antd';
import 'antd-css-utilities/utility.min.css';
import './SignUpPage.module.css'
import { signUpFormFlow } from './SignUpPage.api';

type FieldType = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('onFinish')
    console.log('values', values)
    await signUpFormFlow({
      name: values.name,
      email: values.email,
      password: values.password
    })
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Layout className='h-screen SignUpPage'>

      <Card className='SignUpPage__card ma-auto'>
        <h1>Sign Up</h1>
        <Form
          name="basic"
          layout='vertical'
          // style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
        >

          <Form.Item<FieldType>
            label="Name"
            name="name"
            className='w-full'
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

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

        <div className='SignUpPage__links'>
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/signin">To sign in page</Link>
        </div>
      </Card>

    </Layout>
  )
}

