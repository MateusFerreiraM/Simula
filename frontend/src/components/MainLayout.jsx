import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './Header';

function MainLayout() {
  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Outlet />
      </Container>
    </>
  );
}

export default MainLayout;