/* eslint-disable react/jsx-no-undef */
"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import { Button, ButtonGroup, Form, InputGroup, ToastContainer } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword); // Đảo ngược giá trị hiện tại của showPassword
  };

  // Hàm xử lý lấy thông tin người dùng từ access token
  const getUserInfo = async (accessToken: any) => {
    try {
      const response = await fetch('http://localhost:3000/auth/user-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}` // Gửi access token trong tiêu đề "Authorization"
        }
      });

      if (response.status === 200) {
        const userData = await response.json();
        console.log('User Data:', userData);
        // Xử lý thông tin người dùng ở đây (ví dụ: lưu vào state, hiển thị trên giao diện, ...)
      } else {
        // Xử lý khi không thành công
        toast.error('Failed to get user information', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error getting user information:', error);
      // Xử lý lỗi khi có lỗi trong quá trình gọi API
      toast.error('An error occurred while getting user information', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };


  // Xử lý đăng nhập
    const handleLogin = async () => {
      // Chuẩn bị dữ liệu đăng nhập (username và password)
      const loginData = {
        username: formData.username,
        password: formData.password,
      };

      // Gửi yêu cầu POST đến máy chủ để đăng nhập
      try {
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });

        if (response.status === 201) {
          // Đăng nhập thành công
          const userData = await response.json();
          // Lưu mã thông báo vào localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('accessToken', userData.access_token);
          
          // // Console log tất cả thông tin người dùng
          // console.log('User Data:', userData);

          // Gọi hàm lấy thông tin người dùng sau khi đăng nhập thành công
          getUserInfo(userData.access_token);

          // console.log('User Data access_token:', userData.access_token);
  
          // Sử dụng toast để hiển thị thông báo đăng nhập thành công
          toast.success('Login successful', {
            position: 'top-right',
            autoClose: 3000, // Đóng sau 3 giây
          });
  
          // Điều hướng hoặc thực hiện các hành động sau khi đăng nhập thành công
          window.location.href = 'dashboard';  
        } else {
          // Xử lý lỗi đăng nhập không thành công
          toast.error('Login failed', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        // Hiển thị thông báo lỗi
        toast.error('An error occurred while logging in', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <div className="col-md-6" style={{ border: '2px solid #000', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Login</h3>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter email"
                required
                autoComplete="current-email"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                />
                <InputGroup.Text>
                  <Button variant="light" onClick={handleTogglePassword}>
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </Button>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <ButtonGroup style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0'}}>
              <Button variant="primary" onClick={handleLogin}>
                Login
              </Button>

              <Button variant="danger">
                <Link href="register" style={{ textDecoration: 'none', color: 'white' }}>
                  Back to Register
                </Link>
              </Button>
            </ButtonGroup>

          </Form>
          <ToastContainer />
        </div>
    </div>
  );
}

export default Login;


