"use client"
import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

export default function UserProfile() {
    const userJSON = localStorage.getItem('user');
    const user = userJSON ? JSON.parse(userJSON) : null;

    useEffect(() => {
        if (user) {
            fetchUserData(user.access_token);
        }
    }, [user]);

    const [userData, setUserData] = useState<{
        username: string | undefined;
        fullname: string | undefined;
        birthdate: Date | undefined;
        gender: string | undefined;
    } | null>(null);

    // Function to format date as "mm-dd-yyyy"
    const formatBirthdate = (date: Date | undefined) => {
        if (date instanceof Date) {
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        return 'N/A';
    };

    const fetchUserData = (accessToken: any) => {
        // Make an API call to fetch user data using the access token
        fetch('http://localhost:3000/auth/user-info', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch user data');
                }
            })
            .then((userData) => {
                const birthdate = userData.birthdate ? new Date(userData.birthdate) : undefined;
                setUserData({
                    username: userData.username,
                    fullname: userData.fullName,
                    birthdate: birthdate,
                    gender: userData.gender,
                });
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    };

    const cardStyle = {
        borderRadius: '20px',
        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        backgroundColor: '#7179ee',
    };
    
    const headingStyle = {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    };
    
    const labelStyle = {
        fontWeight: 'bold',
        color: '#555',
    };
    
    const centerContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
    };
    
    const userProfileContainerStyle = {
        backgroundColor: '#a5caf5',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    
    const userProfileCardStyle = {
        padding: '20px',
        borderRadius: '20px',
        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
        backgroundColor: 'white',
        maxWidth: '500px',
        width: '100%',
    };
    
    const userProfileHeadingStyle = {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    
    const userProfileLabelStyle = {
        fontWeight: 'bold',
        color: '#555',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    
    const userProfileValueStyle = {
        color: '#333',
    };

    return (
        <div style={userProfileContainerStyle}>
            <Card style={userProfileCardStyle}>
                <h2 style={userProfileHeadingStyle}>User Profile</h2>
                <p style={userProfileLabelStyle}>
                    <strong>Username:</strong> <span style={userProfileValueStyle}>{userData?.username || 'N/A'}</span>
                </p>
                <p style={userProfileLabelStyle}>
                    <strong>Full Name:</strong> <span style={userProfileValueStyle}>{userData?.fullname || 'N/A'}</span>
                </p>
                <p style={userProfileLabelStyle}>
                    <strong>Birthdate:</strong> <span style={userProfileValueStyle}>{formatBirthdate(userData?.birthdate)}</span>
                </p>
                <p style={userProfileLabelStyle}>
                    <strong>Gender:</strong> <span style={userProfileValueStyle}>{userData?.gender || 'N/A'}</span>
                </p>
            </Card>
        </div>
    );
}