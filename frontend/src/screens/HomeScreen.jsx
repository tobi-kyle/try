import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { FaAngleLeft } from 'react-icons/fa';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

import '../assets/styles/all_items.css';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <div className='flexbox'>
      {!keyword ? (
        <>
          <h1 className='text-cyan addPadding'>Top Rated Products</h1>
          <ProductCarousel />

          <h1 className='display-8 text-cyan addPadding'>Latest Products</h1>
        </>
      ) : (
        <>
          <Link className='btn btn-dark my-3' to='/'>
            <FaAngleLeft />
              Go Back
          </Link>
          <h1 className='display-8 text-cyan addPadding'>Results for: "{keyword}"</h1>
        </>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta/>
          <Row>
            {[...data.products]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((product, index, arr) => (
                <Col
                  key={product._id}
                  sm={12}
                  md={arr.length === 1 ? 12 : 6}
                  lg={arr.length === 1 ? 12 : 4}
                  xl={arr.length === 1 ? 12 : 3}
                  className='p-2'
                >
                  <Product product={product} />
                </Col>
              ))}
          </Row>
          <div className='d-flex mt-4 justify-content-center'>
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword ? keyword : ''}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HomeScreen;
