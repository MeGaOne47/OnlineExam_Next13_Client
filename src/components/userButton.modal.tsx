"use client"
import React, { CSSProperties, useEffect, useState } from 'react';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Console } from 'console';

const defaultAvatarURL = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';

const userButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minWidth: '200px',
};

const avatarStyle: CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  marginRight: '10px',
  objectFit: 'cover',
};

const userNameStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 'bold',
  minWidth: '230px',
};

export default function UserButton() {
  const userJSON = localStorage.getItem('user');
  const user = userJSON ? JSON.parse(userJSON) : null;

  console.log('user data button:', user)
  const isLoggedIn = user && user.access_token; // Check if user is active

  const handleLogout = () => {
    localStorage.removeItem('user'); // Only remove user data, not isLoggedIn
    window.location.href = '/users/login';
    // window.location.reload();
  };

  const [userData, setUserData] = useState<{ username: string; fullName: string }>({
    username: '',
    fullName: '',
  });

  useEffect(() => {
    if (isLoggedIn && !userData.username) {
      // Fetch user info with the access token
      const fetchUserInfo = async (access_token: any) => {
        try {
          const response = await fetch('http://localhost:3000/auth/user-info', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (response.status === 200) {
            const userData = await response.json();
            setUserData(userData);
          } else {
            // Handle the case where user info couldn't be fetched
            toast.error('Failed to get user information', {
              position: 'top-right',
              autoClose: 3000,
            });
          }
        } catch (error) {
          // Handle network or other errors
          console.error('Error getting user information:', error);
          toast.error('An error occurred while getting user information', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      };

      fetchUserInfo(user.access_token);
    }
  }, [isLoggedIn, userData, user]);

  return (
    <>
      {isLoggedIn ? (
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic" style={userButtonStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt="user avatar"
                  roundedCircle
                  style={avatarStyle}
                />
              ) : (
                <Image
                  src={defaultAvatarURL}
                  alt="user avatar"
                  roundedCircle
                  style={avatarStyle}
                />
              )}
              <span style={userNameStyle}>{userData?.fullName || ''}</span>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt="user avatar"
                  roundedCircle
                  style={avatarStyle}
                />
              ) : (
                <Image
                  src={defaultAvatarURL}
                  alt="user avatar"
                  roundedCircle
                  style={avatarStyle}
                />
              )}
              <span style={userNameStyle}>{userData?.username || ''}</span>
            </div>

            <Dropdown.Item>
            <Link href="/users/profile" style={{ textDecoration: 'none' }}>
              <Button variant="light" size="sm">
                <FontAwesomeIcon icon={faCog} />
                <span>Profile Account</span>
              </Button>
            </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link href="/users/dashboard" style={{ textDecoration: 'none' }}>
                <Button variant="light" size="sm">
                  <FontAwesomeIcon icon={faArrowRight} />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link href="/exams" style={{ textDecoration: 'none' }}>
                <Button variant="light" size="sm">
                  <FontAwesomeIcon icon={faArrowRight} />
                  <span>Exams</span>
                </Button>
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link href="/statistical" style={{ textDecoration: 'none' }}>
                <Button variant="light" size="sm">
                  <FontAwesomeIcon icon={faArrowRight} />
                  <span>Statistical</span>
                </Button>
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Button onClick={handleLogout} variant="light" size="sm">
                <FontAwesomeIcon icon={faArrowRight} />
                <span>Sign Out</span>
              </Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button variant="light" href="/users/login">
          Sign In
        </Button>
      )}
    </>
  );
}
