import React, { useState } from 'react';
import { Form, Row, Col, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import API from '../API';
import Customer from '../models/Customer';
import Profile from '../models/Profile';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const LoginSignup = (props) => {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState(false)
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [birthDate, setBirthDate] = useState(dayjs().format('YYYY-MM-DD'));

  const handleSignup = (event) => {
    event.preventDefault();
    if (password != confirmedPassword) {
      toast("The two passwords do not match")
      return;
    }
    if (isEmailValid(email)) {
      const user = new Profile(email, password, email, name, surname, city, province, postalCode, address, streetNumber, phone, birthDate);
      props.signup(user);
    } else {

    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (isEmailValid(email)) {
      // TODO: gestire la signin
      // TODO: in base allo user loggato andare alla pagina corrispondente, per adesso andiamo nel customer
      const credentials = {username: email, password: password}
      props.login(credentials);
    } else {

    }
  };

  const isEmailValid = (email) => {
    let regex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    if (regex.test(email) === false && email !== '') {
      return false
    } else return true;
  }

  if (login == true) {
    return (
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required={true} placeholder="Enter email" onChange={e => setEmail(e.target.value)}/>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required={true} minLength={8} placeholder="Password" onChange={e => setPassword(e.target.value)}/>
        </Form.Group>

        <div className="d-flex justify-content-between">
          <span className="mt-4 me-1 align-self-center">
            Don't have an account yet?
          </span>
          <span className="text-primary mt-4 me-1 align-self-center" onClick={() => {setEmail(''); setPassword(''); setLogin(false)}} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            Sign up
          </span>
          <Button variant="primary" type="submit" className="ms-auto mt-4 align-self-center">
            Sign in
          </Button>
        </div>

        <div className="d-flex">
          <span className="me-1 align-self-center">
            Forgot password?
          </span>
          <span className="text-primary me-1 align-self-center" onClick={() => {
            props.handleOpenModal()
            }} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            Click here
          </span>
        </div>

      </Form>
    )
  } else {
    return (
      errorPassword ?
        <Alert variant="danger" onClose={() => setErrorPassword(false)} dismissible>
          Error! Confirm password not match.
        </Alert> :
        <Container fluid>
          <Row>
            <Col style={{ height: '500px', overflow: 'auto' }}>
              <Form onSubmit={handleSignup}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    required={true}
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    value={errorPassword ? '' : name}
                  />
                </Form.Group>


                <Form.Group className="mt-3">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control required={true} type="text" placeholder="Surname" onChange={e => setSurname(e.target.value)} value={errorPassword ? '' : surname} />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Birth Date</Form.Label>
                  <Form.Control required={true} type="date" placeholder="Birth Date" onChange={e => setBirthDate(e.target.value)} value={errorPassword ? '' : birthDate} />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required={true} placeholder="Enter email" onChange={e => setEmail(e.target.value)} value={errorPassword ? '' : email} />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control required={true} type="password" minLength={8} placeholder="Password" onChange={e => setPassword(e.target.value)} value={errorPassword ? '' : password} />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Repeat password</Form.Label>
                  <Form.Control required={true} type="password" minLength={8} placeholder="Password" onChange={e => setConfirmedPassword(e.target.value)} />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control required={true} type="text" placeholder="City" onChange={e => setCity(e.target.value)} value={errorPassword ? '' : city} />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Province</Form.Label>
                  <Form.Control required={true} type="text" placeholder="Province" onChange={e => setProvince(e.target.value)} value={errorPassword ? '' : province} />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control required={true} min={1} type="number" placeholder="Postal Code" onChange={e => setPostalCode(e.target.value)} value={errorPassword ? '' : postalCode} />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control required={true} type="text" placeholder="Address" onChange={e => setAddress(e.target.value)} value={errorPassword ? '' : address} />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Street Number</Form.Label>
                  <Form.Control required={true} min={1} type="number" placeholder="Street Number" onChange={e => setStreetNumber(e.target.value)} value={errorPassword ? '' : streetNumber} />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control required={true} type="text" placeholder="Phone" onChange={e => setPhone(e.target.value)} value={errorPassword ? '' : phone} />
                </Form.Group>


                <div className="d-flex justify-content-between">
                  <span className="text-primary mt-4 me-1 align-self-center" onClick={() => {
                    setLogin(true)
                    setName('');
                    setSurname('')
                    setBirthDate('')
                    setEmail('')
                    setPassword('')
                    setConfirmedPassword('')
                    setCity('')
                    setProvince('')
                    setPostalCode('')
                    setAddress('')
                    setStreetNumber('')
                    setPhone('')
                  }} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    Back
                  </span>
                  <Button variant="primary" type="submit" className="ms-auto mt-4 align-self-center">
                    Sign up
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>

        </Container>
    )
  }
}
export default LoginSignup;