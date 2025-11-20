import React from 'react';
import { Container, Row, Col, Form, Modal, FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import { WrenchAdjustable } from 'react-bootstrap-icons';
import LoginSignup from './LoginSignup';
import NavigationBar from './NavigationBar';
import API from '../API';
import { useState } from 'react';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Home = (props) => {
  const [fieldName, setFieldName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleFieldNameChange = (event) => {
    setFieldName(event.target.value);
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setFieldName('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


    
    try {
      await API.getResetPasswordEmail(fieldName);
      
    } catch {
      
    }
    handleCloseModal()
    handleOpenModal2()
      
  };

  const [fieldName2, setFieldName2] = useState('');
  const [showModal2, setShowModal2] = useState(false);

  const handleFieldNameChange2 = (event) => {
    setFieldName2(event.target.value);
  };

  const handleOpenModal2 = () => {
    setShowModal2(true);
  };

  const handleCloseModal2 = () => {
    setShowModal2(false);
    setFieldName2('');
  };

  const handleSubmit2 = async (event) => {
    event.preventDefault();
    try {
      await API.putResetPasswordEmail(fieldName,fieldName2);
    } catch {
      toast('Invalid token');
      // handleCloseModal2();
      return;
    }
    handleCloseModal2();
    handleOpenModal3();
  };

  const [fieldName3, setFieldName3] = useState('');
  const [fieldName4, setFieldName4] = useState('');
  const [showModal3, setShowModal3] = useState(false);

  const handleFieldNameChange3 = (event) => {
    setFieldName3(event.target.value);
  };

  const handleFieldNameChange4 = (event) => {
    setFieldName4(event.target.value);
  };

  const handleOpenModal3 = () => {
    setShowModal3(true);
  };

  const handleCloseModal3 = () => {
    setShowModal3(false);
    setFieldName3('');
    setFieldName4('');
    setFieldName('');
  };

  const handleSubmit3 = async (event) => {
    event.preventDefault();

    if(fieldName3 === fieldName4){
      try {
        await API.putChangePassword(fieldName, fieldName3);
      } catch {
        handleCloseModal3();
        return;
      }
      handleCloseModal3();
    }else{
      toast("The two passwords do not match")
    }
    
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <NavigationBar loggedIn={props.loggedIn} />
      <Row style={{ height: '100%' }} className="align-items-center justify-content-center">
        <Col style={{ paddingBottom: '62px' }} xs={6}>
          <div>
            <Row>
              <h1 className="text-center">Device assistance</h1>
            </Row>
            <Row>
              <h2 className="text-center mt-4">Submit and manage your tickets</h2>
            </Row>
            <Row>
              <WrenchAdjustable size={50} className="mt-2" />
            </Row>
          </div>
        </Col>

        <Col style={{ paddingBottom: '62px' }} xs={6}>
          <Row className="justify-content-center">
            <Col xs={8}>
              <LoginSignup signup={props.signup} login={props.login} handleOpenModal={handleOpenModal}/>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Insert your email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormControl
                type="email"
                placeholder="Email"
                value={fieldName}
                required={true}
                onChange={handleFieldNameChange}
              />
            </FormGroup>
            <Button type="submit" className='mt-3'>Confirm</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showModal2} onHide={handleCloseModal2}>
        <Modal.Header closeButton>
          <Modal.Title>A verification code has been sent to {fieldName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit2}>
            <FormGroup>
              <FormControl
                type="text"
                placeholder="Insert the code"
                value={fieldName2}
                required={true}
                onChange={handleFieldNameChange2}
              />
            </FormGroup>
            <Button type="submit" className='mt-3'>Confirm</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showModal3} onHide={handleCloseModal3}>
        <Modal.Header closeButton>
          <Modal.Title>Choose a new Password:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit3}>
            <FormGroup>
              <FormControl
                type="password"
                placeholder="Password"
                value={fieldName3}
                required={true}
                onChange={handleFieldNameChange3}
                minLength={8}
              />
            </FormGroup>
            <br/>
            <FormGroup>
              <FormControl
                type="password"
                placeholder="Confirm Password"
                value={fieldName4}
                required={true}
                onChange={handleFieldNameChange4}
                minLength={8}
              />
            </FormGroup>
            <Button type="submit" className='mt-3'>Confirm</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;