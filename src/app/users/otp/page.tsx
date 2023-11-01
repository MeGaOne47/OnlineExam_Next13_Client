/* eslint-disable react/jsx-no-undef */
'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ActivateAccount() {
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      if (user && user.username) {
        setUserData(user);
        setUsername(user.username);
      } else {
        toast.error('User data is invalid.');
        // Xử lý trường hợp người dùng không hợp lệ ở đây
      }
    } else {
      toast.error('User data not found.');
      // Xử lý trường hợp dữ liệu người dùng không được tìm thấy ở đây
    }
  }, []);


  const handleOtpChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setOtp(e.target.value);
  };

  const handleActivateAccount = async () => {
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }
    
    const requestBody = JSON.stringify({ username: username });

    // Gửi yêu cầu kích hoạt tài khoản đến máy chủ với username và OTP
    fetch(`http://localhost:3000/user/active?otp=${otp}`, {
      method: 'PATCH', // Sử dụng phương thức PATCH để kích hoạt tài khoản
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success('Account activated successfully');
          // Có thể thực hiện điều gì đó sau khi kích hoạt tài khoản thành công
          window.location.href = 'login'; 
        } else if (response.status === 400) {
          toast.error('Invalid OTP or Account already activated');  
        } else if (response.status === 500) {
          toast.error('Internal Server Error - OTP not found');
          console.log('OTP' ,otp)
          console.log('user name', username)


        } else {
          return response.text().then((errorData) => {
            throw new Error(errorData);
          });
        }
      })
      .catch((error) => {
        toast.error(`Account activation failed: ${error.message}`);
      });
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="col-md-6" style={{ border: '2px solid #000', padding: '30px', borderRadius: '10px', width: '400px' }}>
        <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Activate Account</h3>
        <Form>
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    readOnly
                />
            </Form.Group>
            <Form.Group controlId="formBasicOTP">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
                />
            </Form.Group>

            <ButtonGroup style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0'}}>
                <Button variant="primary" onClick={handleActivateAccount}>
                    Activate
                </Button>
                <Button variant="danger">
                    <Link href="register" style={{ textDecoration: 'none', color: 'white' }}>
                    Back to Register
                    </Link>
                </Button>
            </ButtonGroup>
        </Form>
      </div>
    </div>
  );
  
}  

export default ActivateAccount;