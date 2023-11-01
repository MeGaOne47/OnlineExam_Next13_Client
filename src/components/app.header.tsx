/* eslint-disable react/jsx-no-undef */
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import UserButton from './userButton.modal';
import { useState } from 'react';
import { Button } from 'react-bootstrap';



function AppHeader() {

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
    <Container>
      <Link href="/users/dashboard" className='navbar-brand'>
        Online Exam
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {/* <Link href={"/blogs"} className='nav-link'>
            Blogs
          </Link> */}
        </Nav>
        <UserButton/>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
}

export default AppHeader;