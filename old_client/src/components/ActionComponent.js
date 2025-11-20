import {Button, Col, Container, Form, Row} from "react-bootstrap";
import API from "../API";
import {useState} from "react";
import {ValidateEmail} from "./CustomerFormComponent"

function ActionsComponent(props) {
    const onSubmit = (e) => {
        e.preventDefault()
    }

    const [productID, setProductID] = useState('');
    const [email1, setEmail1] = useState('');
    const [email2, setEmail2] = useState('');
    const [allowOperation1, setAllowOperation1] = useState(false);
    const [allowOperation2, setAllowOperation2] = useState(false);
    const [allowOperation3, setAllowOperation3] = useState(false);

    const getProducts = async () => {
        console.log("Fetching all products...");
        try {
            const list = await API.getAllProducts();
            //props.setLoadingProducts(0,false);
            props.setLoadingProducts([false, false, false]);
            /* Set props.busy to false to enable all buttons */
            props.setBusy(false);
            if (list != undefined) {
                props.setLoadingProducts([false, true, false]);
                props.setProducts(list);
                if (list.length === 0) {
                    props.setLoadingProducts([false, true, false])
                } else {
                    props.setLoadingProducts([false, true, true]);
                }
            } else {
                props.setLoadingProducts([false, false, true]);
                props.setProducts([]);
            }
        } catch (err) {
            props.setLoadingProducts([false, false, false])
            /* Set props.busy to false to enable all buttons */
            props.setBusy(false);
            console.log(err);
        }
    };

    const getProductByID = async (id) => {
        console.log("Fetching product with ID : [" + id + "] ...");
        try {
            const product = await API.getProductByID(id);
            props.setLoadingProducts([false, false, false]);
            /* Set props.busy to false to enable all buttons */
            props.setBusy(false);
            if (product != undefined) {
                props.setLoadingProducts([false, true, false]);
                let resultArray = [...product];
                props.setProducts(resultArray);
                if (resultArray.length === 0) {
                    props.setLoadingProducts([false, true, false])
                } else {
                    props.setLoadingProducts([false, true, true]);
                }
            } else {
                props.setLoadingProducts([false, false, true]);
                props.setProducts([]);
            }
        } catch (err) {
            props.setLoadingProducts([false, false, false]);
            /* Set props.busy to false to enable all buttons */
            props.setBusy(false);
            console.log(err);
        }
    }

    const getCustomerByEmail = async (email) => {
        console.log("Fetching customer with email : [" + email + "] ...");
        try {
            const customer = await API.getCustomerByEmail(email);
            props.setLoadingCustomer([false, false, false]);
            /* Set props.busy to false to enable all buttons */
            props.setBusy(false);
            if (customer != undefined) {
                props.setLoadingCustomer([false, true, false]);
                let resultArray = [...customer];
                props.setCustomers(resultArray);
                if (resultArray.length === 0) {
                    props.setLoadingCustomer([false, true, false])
                } else {
                    props.setLoadingCustomer([false, true, true]);
                }
            } else {
                props.setLoadingCustomer([false, false, true]);
                props.setCustomers([]);
            }
        } catch (err) {
            props.setLoadingCustomer([false, false, false]);
            /* Set props.busy to false to enable all buttons */
            props.setBusy(false);
            console.log(err);
        }
    }

    const isEmailValid = (email) => {
        let regex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
        if (regex.test(email) === false && email !== '') {
            return false
        } else return true;
    }

    return (
        <Col className='col-md-4 border'>
            <Row>
                <div className="h4">AVAILABLE ACTIONS :</div>
            </Row>
            <Row className='mt-2 border-bottom border-top'>
                <Container style={{backgroundColor: '#B1E3FE'}}>
                    <div style={{fontFamily: 'Lucida Console'}}>Retrieve all products</div>
                    <Button className="mb-2 mt-2" variant="primary" type="submit" disabled={props.busy}
                            onClick={async () => {
                                props.setShowProduct(false);
                                props.setShowListProducts(true);
                                props.setShowProfile(false);
                                props.setShowNewProfileForm(false);
                                props.setShowEditProfileForm(false);
                                /* Reset loadingProducts values */
                                props.setLoadingProducts([false, false, false])
                                /* Set loading field to true */
                                props.setLoadingProducts([true, false, false])
                                /* Set props.busy to disable all buttons */
                                props.setBusy(true);
                                await getProducts();
                            }}>
                        View </Button>
                </Container>
            </Row>

            <Row className='mt-5 border'>
                <Form onSubmit={onSubmit} style={{backgroundColor: '#B1E3FE'}}>
                    <Form.Group className="mb-3 mt-2">
                        <Form.Label style={{fontFamily: 'Lucida Console'}}>Get product details</Form.Label>
                        <Form.Control placeholder="Enter product ID"
                                      required={true}
                                      minLength={13}
                                      maxLength={13}
                                      defaultValue={''}
                                      onChange={e => {
                                          setProductID(e.target.value);
                                          if (e.target.value.length === 13) {
                                              setAllowOperation1(true)
                                          } else setAllowOperation1(false);
                                      }}/>
                    </Form.Group>
                    <Button className="mb-2" variant="primary" type="submit" disabled={props.busy}
                            onClick={async () => {
                                if (allowOperation1 === true) {
                                    props.setShowProduct(true);
                                    props.setShowListProducts(false);
                                    props.setShowProfile(false);
                                    props.setShowNewProfileForm(false);
                                    props.setShowEditProfileForm(false);
                                    /* Reset loadingProducts values */
                                    props.setLoadingProducts([false, false, false])
                                    /* Set loading field to true */
                                    props.setLoadingProducts([true, false, false])
                                    /* Set props.busy to disable all buttons */
                                    props.setBusy(true);
                                    await getProductByID(productID);
                                }
                            }}>
                        View
                    </Button>
                </Form>
            </Row>
            <Row className='mt-5 border'>
                <Form onSubmit={onSubmit} style={{backgroundColor: '#B1E3FE'}}>
                    <Form.Group className="mb-3 mt-2" controlId="formBasicEmail">
                        <Form.Label style={{fontFamily: 'Lucida Console'}}>Get customer details</Form.Label>
                        <Form.Control type="email" placeholder="Enter email"
                                      required={true}
                                      onChange={e => {
                                          setEmail1(e.target.value);
                                          if (e.target.value.length >= 1 && isEmailValid(e.target.value)) {
                                              setAllowOperation2(true)
                                          } else {
                                              setAllowOperation2(false);
                                          }
                                      }}/>
                        <ValidateEmail email={email1}></ValidateEmail>
                    </Form.Group>

                    <Button className="mb-2" variant="primary" type="submit" disabled={props.busy}
                            onClick={async () => {
                                if (allowOperation2 === true) {
                                    props.setShowProduct(false);
                                    props.setShowListProducts(false);
                                    props.setShowProfile(true);
                                    props.setShowNewProfileForm(false);
                                    props.setShowEditProfileForm(false);
                                    /* Reset loadingProducts values */
                                    props.setLoadingCustomer([false, false, false])
                                    /* Set loading field to true */
                                    props.setLoadingCustomer([true, false, false])
                                    /* Set props.busy to disable all buttons */
                                    props.setBusy(true);
                                    await getCustomerByEmail(email1);
                                }
                            }}>
                        View
                    </Button>
                </Form>
            </Row>
            <Row className='mt-5 border-bottom border-top'>
                <Container style={{backgroundColor: '#B1E3FE'}}>
                    <div style={{fontFamily: 'Lucida Console'}}>Create a new customer profile</div>
                    <Button className="mb-2 mt-2" variant="primary" type="submit" disabled={props.busy} onClick={() => {
                        props.setShowProduct(false);
                        props.setShowListProducts(false);
                        props.setShowProfile(false);
                        props.setShowNewProfileForm(true);
                        props.setShowEditProfileForm(false);
                        if (props.refreshingInsertion === 0) {
                            props.setRefreshingInsertion(1);
                        } else props.setRefreshingInsertion(0);
                    }}>
                        Create </Button>{' '}
                </Container>
            </Row>
            <Row className='mt-5 mb-5 border'>
                <Form onSubmit={onSubmit} style={{backgroundColor: '#B1E3FE'}}>
                    <Form.Group className="mb-3 mt-2" controlId="formBasicEmail">
                        <Form.Label style={{fontFamily: 'Lucida Console'}}>Modify customer profile</Form.Label>
                        <Form.Control type="email" placeholder="Enter email"
                                      defaultValue={''}
                                      required={true}
                                      onChange={e => {
                                          setEmail2(e.target.value);
                                          if (e.target.value.length >= 1 && isEmailValid(e.target.value)) {
                                              setAllowOperation3(true)
                                          } else {
                                              setAllowOperation3(false);
                                          }
                                      }}/>
                        <ValidateEmail email={email2}></ValidateEmail>
                    </Form.Group>
                    <Button className="mb-2" variant="primary" type="submit" disabled={props.busy}
                            onClick={async () => {

                                if (props.refreshingInsertion2 === 0) {
                                    props.setRefreshingInsertion2(1);
                                } else props.setRefreshingInsertion2(0);
                                if (allowOperation3 === true) {
                                    props.setShowProduct(false);
                                    props.setShowListProducts(false);
                                    props.setShowProfile(false);
                                    props.setShowNewProfileForm(false);
                                    props.setShowEditProfileForm(true);
                                    /* Reset loadingProducts values */
                                    props.setLoadingCustomer([false, false, false])
                                    /* Set loading field to true */
                                    props.setLoadingCustomer([true, false, false])
                                    /* Set props.busy to disable all buttons */
                                    props.setBusy(true);
                                    await getCustomerByEmail(email2)
                                }
                            }}>
                        Modify
                    </Button>
                </Form>
            </Row>
        </Col>
    );
}

export {ActionsComponent}