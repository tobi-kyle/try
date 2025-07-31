import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { clearUserCart } from '../slices/cartSlice';
import SearchBox from './SearchBox';
import logo from '../assets/zeusLogo.png';
import '../assets/styles/header.css';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      // Clear user-specific cart before logging out
      if (userInfo?._id) {
        dispatch(clearUserCart(userInfo._id));
      }
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className='border-bottom border-3'>
      <Navbar expand='md' collapseOnSelect>
        <Container>
            <Navbar.Brand as={Link} to='/'>
              <img
                src={logo}
                alt='ZeusLogo'
                width='auto'
                height={75}
              />
            </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <SearchBox />
              <LinkContainer to='/cart'>
                <Nav.Link className='text-cyan'>
                  <FaShoppingCart className='me-1' /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg='primary' className='ms-2'>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown
                  title={userInfo.name}
                  id='username'
                  className='text-cyan'
                >
                  <LinkContainer
                    to='/profile'
                    activeStyle={{
                      backgroundColor: '#D3592A',
                    }}
                  >
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link className='text-cyan'>
                    <FaUser className='me-1' /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title='Admin'
                  id='adminmenu'
                  className='text-cyan'
                >
                  <LinkContainer
                    to='/admin/orderlist'
                    activeStyle={{
                      backgroundColor: '#D3592A',
                    }}
                    /*Not sure what the purpose for activeStyle is*/
                  >
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer
                    to='/admin/productlist'
                    activeStyle={{
                      backgroundColor: '#D3592A',
                    }}
                  >
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer
                    to='/admin/userlist'
                    activeStyle={{
                      backgroundColor: '#D3592A',
                    }}
                  >
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
