import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import Meta from '../components/Meta';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod, { meta: { userId: userInfo?._id } }));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <Meta title={'TechShop'} />
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              className='my-2'
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button
          className='my-3'
          type='submit'
          style={{
            backgroundColor: '#D3592A',
            border: 'none',
          }}
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
