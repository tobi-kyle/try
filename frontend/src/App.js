import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserCart } from './slices/cartSlice';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Load user's cart when app initializes if user is already logged in
    if (userInfo && userInfo._id) {
      dispatch(loadUserCart(userInfo._id));
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
