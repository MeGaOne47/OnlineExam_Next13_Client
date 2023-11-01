/* eslint-disable react/jsx-no-undef */
"use client"
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button, ButtonGroup, Form, InputGroup, ToastContainer } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';


function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    gender: '',
    birthdate: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.fullname || !formData.gender || !formData.birthdate) {
      toast.error('Please fill in all the fields', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const requestData = {
      gender: formData.gender,
      birthdate: formData.birthdate,
      username: formData.username,
      password: formData.password,
      fullName: formData.fullname,
    };
    // Lưu thông tin người dùng vào localStorage sau khi đăng ký thành công
    localStorage.setItem('user', JSON.stringify(requestData));
    localStorage.setItem('isLoggedIn', 'true');


    fetch('http://localhost:3000/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.status === 201) {
          toast.success('Registration successful', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          console.log('Registration successful');
          window.location.href = 'otp';
        } else {
          response.json().then((errorData) => {
            toast.error('Registration failed', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            console.error('Registration failed');
          });
        }
      })
      .catch((error) => {
        toast.error('Error.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error('Error:', error);
      });
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="col-md-6" style={{ border: '2px solid #000', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Register</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email Address</Form.Label>
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
                <Button
                  variant="light"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </Button>
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter username"
              required
              autoComplete="current-username"
            />
          </Form.Group>

          <Form.Group controlId="formBasicGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Control>
          </Form.Group>


          <Form.Group controlId="formBasicbirthdate">
            <Form.Label>birthdate</Form.Label>
            <Form.Control
              type="date"  // Thay đổi kiểu của trường thành "date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </Form.Group>



          <ButtonGroup style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0'}}>
            <Button variant="primary" onClick={handleSubmit}>
              Register
            </Button>
            <Button variant="danger">
              <Link href="login" style={{ textDecoration: 'none', color: 'white' }}>
                Back to Login
              </Link>
            </Button>
          </ButtonGroup>
        </Form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Register;
