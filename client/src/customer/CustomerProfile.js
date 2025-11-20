import React from 'react';
import { ButtonGroup, Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NavigationBar from '../components/NavigationBar';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Customer from '../models/Customer'

import { Card } from 'react-bootstrap';
import API from '../API';

function CustomerProfile(props) {
    const [edit, setEdit] = useState(false);

    const handleEdit = () => {
        if (edit) {
            setEdit(false)
        } else {
            setEdit(true)
        }
    }

    const [name, setName] = useState(props.user.name);
    const [surname, setSurname] = useState(props.user.surname);
    const [city, setCity] = useState(props.user.city);
    const [province, setProvince] = useState(props.user.province);
    const [postalCode, setPostalCode] = useState(props.user.postalCode);
    const [address, setAddress] = useState(props.user.address);
    const [streetNumber, setStreetNumber] = useState(props.user.streetNumber);
    const [phone, setPhone] = useState(props.user.phone);
    const [birthDate, setBirthDate] = useState(props.user.birthDate);
    const navigate = useNavigate();

    const handleNameChange = (event) => {
        setName(event.target.value)
    }
    const handleSurnameChange = (event) => {
        setSurname(event.target.value)
    }
    const handleCityChange = (event) => {
        setCity(event.target.value)
    }
    const handleProvinceChange = (event) => {
        setProvince(event.target.value)
    }
    const handlePostalCodeChange = (event) => {
        setPostalCode(event.target.value)
    }
    const handleAddressChange = (event) => {
        setAddress(event.target.value)
    }
    const handleStreetNumberChange = (event) => {
        setStreetNumber(event.target.value)
    }
    const handlePhoneChange = (event) => {
        setPhone(event.target.value)
    }
    const handleBirthDateChange = (event) => {
        setBirthDate(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let newProfile = new Customer(props.user.email, name, surname, birthDate, province, city, address, streetNumber, postalCode, phone, props.user.role, props.user.token);
        try {
            await API.editProfile(props.user.token, newProfile);
        } catch (err) {
            console.log(err);
        }
        props.setUser(newProfile);
        setEdit(false)
    }
    return (
        <>
            <NavigationBar setLoggedIn={props.setLoggedIn} isCustomer={props.isCustomer} loggedIn={props.loggedIn} email={props.email} />
            <Container fluid className="px-4 py-4">
                <h1>{props.user.email}'s profile</h1>
                <Card className='mt-5 ms-5 me-5 mb-3'>
                    <Card.Header>Profile Details</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Mail: {props.user.email}&emsp;
                            Name: {props.user.name}&emsp;
                            Surname: {props.user.surname}&emsp;
                            <br/>
                            Address: {props.user.city} ({props.user.province}) {props.user.postalCode}, {props.user.address} {props.user.streetNumber}&emsp;
                            Phone: {props.user.phone}&emsp;
                            Birth Date: {props.user.birthDate}
                        </Card.Text>
                    </Card.Body>
                </Card>
                {edit ?
                    <Row className="mt-4 ms-5 me-5 mb-3 text-start">
                        <Form onSubmit={handleSubmit}>
                            <Row><Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control required type="text" placeholder="name" value={name} onChange={handleNameChange} />
                                </Form.Group>
                            </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Surname</Form.Label>
                                        <Form.Control required type="text" placeholder="surname" value={surname} onChange={handleSurnameChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control required type="text" placeholder="city" value={city} onChange={handleCityChange} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Province</Form.Label>
                                        <Form.Control required type="text" placeholder="province" value={province} onChange={handleProvinceChange} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Postal Code</Form.Label>
                                        <Form.Control required type="number" placeholder="postal code" value={postalCode} onChange={handlePostalCodeChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={9}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control required type="text" placeholder="address" value={address} onChange={handleAddressChange} />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Street Number</Form.Label>
                                        <Form.Control required type="number" placeholder="street number" value={streetNumber} onChange={handleStreetNumberChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control required type="text" placeholder="phone number" value={phone} onChange={handlePhoneChange} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Birth Date</Form.Label>
                                        <Form.Control required type="date" placeholder="birth date" value={birthDate} onChange={handleBirthDateChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Container className="d-flex justify-content-center align-items-center">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Container>
                        </Form>
                    </Row>
                    : <></>}
                <span className="text-primary me-3 align-self-center" onClick={() => { navigate(-1) }} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    Back
                </span>
                <Button onClick={() => handleEdit()} variant={edit ? "danger" : "outline-primary"} >{edit ? 'Close' : 'Edit'}</Button>
            </Container>
        </>
    )
}

export default CustomerProfile;