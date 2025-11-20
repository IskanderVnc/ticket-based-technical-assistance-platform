import {Button, Col, Form, Spinner} from "react-bootstrap";
import API from "../API";
import {useEffect, useState} from "react";
import {Customer} from "../objects/Customer";
import {MdOutlineError, MdOutlineVerified} from "react-icons/md"
import {IoMdInformationCircleOutline} from "react-icons/io";
import dayjs from "dayjs";
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

function NewProfile(props) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [city,setCity] = useState('');
    const [province,setProvince] = useState('');
    const [postalCode,setPostalCode] = useState('');
    const [address, setAddress] = useState('');
    const [streetNumber,setStreetNumber] = useState('');
    const [birthDate, setBirthDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [loading, setLoading] = useState(false);
    const [editingForm, setEditingForm] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const [alreadyExisting, setAlreadyExisting] = useState(false);
    let newCustomer = undefined;

    useEffect(() => {
        setLoading(false);
        setEditingForm(true);
        setSucceeded(false);
        setAlreadyExisting(false);
    }, [props.refreshingInsertion])
    const addNewCustomer = async (customer) => {
        console.log("Adding new customer with email : [" + customer.email + "] ...");
        try {
            let result = await API.addNewCustomer(customer)
            setLoading(false);
            /* Set props.busy to false to enable all buttons */
            props.setBusy(false);
            if (result != undefined) {
                if(result === 1) {
                    setSucceeded(true);
                    console.log("Operation succeeded");
                } else {
                    setAlreadyExisting(true);
                    console.log("Customer with same email already exists!");
                }
            } else {
                setSucceeded(false);
                console.log("API returned undefined... something went wrong");
            }
        } catch (err) {
            setLoading(false);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(isEmailValid(email)) {
            setLoading(true);
            /* Set props.busy to disable all buttons */
            props.setBusy(true);
            setEditingForm(false);
            await addNewCustomer(newCustomer);
        } else {
            // DO NOTHING
        }
    };

    return (
        loading ?
            <>
                <Col align="center">
                    <Spinner className="h4" variant="warning" animation="border" role="status"></Spinner>
                    <div className="h3 mt-4" style={{fontFamily: 'Lucida Console'}}> Loading...</div>
                </Col>
            </>
            :
            editingForm ?
                <>
                    <div className="h3 border" style={{fontFamily: 'Lucida Console'}}> NEW PROFILE DETAILS</div>
                    <Form onSubmit={handleSubmit} style={{textAlign: 'left'}}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={{fontFamily: 'Lucida Console'}}>Email address</Form.Label>
                            <Form.Control type="email" required={true} placeholder="email@example.com"
                                          onChange={e => setEmail(e.target.value)}/>
                            <ValidateEmail email={email}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{fontFamily: 'Lucida Console'}}>Name</Form.Label>
                            <Form.Control placeholder="Name" required={true} onChange={e => setName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{fontFamily: 'Lucida Console'}}>Surname</Form.Label>
                            <Form.Control placeholder="Surname" required={true}
                                          onChange={e => setSurname(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{fontFamily: 'Lucida Console'}}>City</Form.Label>
                            <Form.Control placeholder="City" required={true}
                                          onChange={e => setCity(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{fontFamily: 'Lucida Console'}}>Province</Form.Label>
                            <Form.Control placeholder="Province" required={true}
                                          onChange={e => setProvince(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{fontFamily: 'Lucida Console'}}>Postal Code</Form.Label>
                            <Form.Control type="number" min={1} placeholder="Postal Code" required={true}
                                          onChange={e => setPostalCode(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{fontFamily: 'Lucida Console'}}>Address</Form.Label>
                            <Form.Control placeholder="Address" required={true}
                                          onChange={e => setAddress(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{fontFamily: 'Lucida Console'}}>Street Number</Form.Label>
                            <Form.Control type="number" min={1} placeholder="Street Number" required={true}
                                          onChange={e => setStreetNumber(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{fontFamily: 'Lucida Console'}}>Phone</Form.Label>
                            <Form.Control placeholder="Phone" required={true} onChange={e => setPhone(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{fontFamily: 'Lucida Console'}}>Birth date</Form.Label>
                            <Form.Control type="date" value={birthDate} required={true}
                                          onChange={e => setBirthDate(e.target.value)}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={() => {
                            newCustomer = new Customer(email, name, surname, city, province, postalCode, address, streetNumber,phone, birthDate);
                        }}>
                            Submit
                        </Button>
                    </Form>
                </>
                :
                succeeded ?
                    <>
                        <Col className="border" align="center">
                            <MdOutlineVerified className="h1" color="green" size={66}></MdOutlineVerified>
                            <span className="h4" style={{fontFamily: 'Lucida Console'}}> Operation succeeded ! </span>
                        </Col>
                    </>
                    :
                    alreadyExisting ?
                        <>
                            <Col className="border" align="center">
                                <IoMdInformationCircleOutline className="h1" color="#1589FF"
                                                              size={56}></IoMdInformationCircleOutline>
                                <span className="h4" style={{fontFamily: 'Lucida Console'}}> Customer with same email already exists! </span>
                            </Col>
                        </>
                        :
                        <>
                            <Col className="border" align="center">
                                <MdOutlineError className="h1" color="red" size={66}></MdOutlineError>
                                <span className="h4" style={{fontFamily: 'Lucida Console'}}> Operation failed ! </span>
                            </Col>
                        </>
    );
}

function EditProfile(props) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [city,setCity] = useState('');
    const [province,setProvince] = useState('');
    const [postalCode,setPostalCode] = useState('');
    const [address, setAddress] = useState('');
    const [streetNumber,setStreetNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingForm, setEditingForm] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    let modifiedCustomer = undefined;
    let date = undefined;

    useEffect(() => {
        if (props.customers.length > 0) {
            date = (dayjs(props.customers[0].birthDate, 'DD-MM-YYYY'))
            setBirthDate(date.format('YYYY-MM-DD'))
            setEmail(props.customers[0].email);
            setName(props.customers[0].name);
            setSurname(props.customers[0].surname);
            setPhone(props.customers[0].phone);
            setCity(props.customers[0].city);
            setProvince(props.customers[0].province);
            setPostalCode(props.customers[0].postalCode);
            setAddress(props.customers[0].address);
            setStreetNumber(props.customers[0].streetNumber)
        }
        setLoading(false);
        setEditingForm(true);
        setSucceeded(false);
    }, [props.refreshingInsertion2,props.customers])

    const modifyCustomerProfile = async (email, modifiedCustomer) => {
        console.log("Modifying customer with email : [" + email + "] ...");
        try {
            const modifiedCustomerResult = await API.updateCustomerProfile(email, modifiedCustomer)
            setLoading(false);
            /* Set props.busy to false to enable all buttons */
            props.setBusy(false);
            if (modifiedCustomerResult != undefined) {
                setSucceeded(true);
                console.log("Operation succeeded");
            } else {
                setSucceeded(false);
                console.log("API returned undefined... something went wrong");
            }
        } catch (err) {
            setLoading(false);
            /* Set props.busy to false to enable all buttons */
            props.setBusy(false);
            console.log(err);
        }
    }

    const handleSubmit = (async (event) => {
        event.preventDefault();
        setLoading(true);
        /* Set props.busy to disable all buttons */
        props.setBusy(true);
        setEditingForm(false);
        await modifyCustomerProfile(email, modifiedCustomer);
    });

    return (
        props.loadingCustomer[0] ?
            <>
                <Col align="center">
                    <Spinner className="h4" variant="warning" animation="border" role="status"></Spinner>
                    <div className="h3 mt-4" style={{fontFamily: 'Lucida Console'}}> Searching for customer...</div>
                </Col>
            </>
            :
            props.loadingCustomer[1] ?
                (
                    props.loadingCustomer[2] ?
                        (
                            loading ?
                                <>
                                    <Col align="center">
                                        <Spinner className="h4" variant="warning" animation="border"
                                                 role="status"></Spinner>
                                        <div className="h3 mt-4" style={{fontFamily: 'Lucida Console'}}> Loading...
                                        </div>
                                    </Col>
                                </>
                                :
                                editingForm ?
                                    <>
                                        <div className="h3 border" style={{fontFamily: 'Lucida Console'}}> PROFILE DETAILS</div>
                                        <Form onSubmit={handleSubmit} style={{textAlign: 'left'}}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{fontFamily: 'Lucida Console'}}>Name</Form.Label>
                                                <Form.Control value={name} required={true} placeholder="Name"
                                                              onChange={e => setName(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{fontFamily: 'Lucida Console'}}>Surname</Form.Label>
                                                <Form.Control value={surname} required={true} placeholder="Surname"
                                                              onChange={e => setSurname(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{fontFamily: 'Lucida Console'}}>City</Form.Label>
                                                <Form.Control value={city} required={true} placeholder="City"
                                                              onChange={e => setCity(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{fontFamily: 'Lucida Console'}}>Province</Form.Label>
                                                <Form.Control value={province} required={true} placeholder="Province"
                                                              onChange={e => setProvince(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{fontFamily: 'Lucida Console'}}>Postal Code</Form.Label>
                                                <Form.Control type="number" min={1} value={postalCode} required={true} placeholder="Postal Code"
                                                              onChange={e => setPostalCode(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{fontFamily: 'Lucida Console'}}>Address</Form.Label>
                                                <Form.Control value={address} required={true} placeholder="Address"
                                                              onChange={e => setAddress(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{fontFamily: 'Lucida Console'}}>Street Number</Form.Label>
                                                <Form.Control type="number" min={1} value={streetNumber} required={true} placeholder="Street Number"
                                                              onChange={e => setStreetNumber(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{fontFamily: 'Lucida Console'}}>Phone</Form.Label>
                                                <Form.Control value={phone} required={true} placeholder="Phone"
                                                              onChange={e => setPhone(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{fontFamily: 'Lucida Console'}}>Birth
                                                    date</Form.Label>
                                                <Form.Control type="date" value={birthDate} required={true}
                                                              onChange={e => setBirthDate(e.target.value)}/>
                                            </Form.Group>
                                            <Button variant="primary" type="submit" onClick={() => {
                                                modifiedCustomer = new Customer(email, name, surname, city, province, postalCode, address, streetNumber, phone, birthDate);
                                            }}>
                                                Submit changes
                                            </Button>
                                        </Form>
                                    </>
                                    :
                                    succeeded ?
                                        <>
                                            <Col className="border" align="center">
                                                <MdOutlineVerified className="h1" color="green"
                                                                   size={66}></MdOutlineVerified>
                                                <span className="h4" style={{fontFamily: 'Lucida Console'}}> Operation succeeded ! </span>
                                            </Col>
                                        </>
                                        :
                                        <>
                                            <Col className="border" align="center">
                                                <MdOutlineError className="h1" color="red" size={66}></MdOutlineError>
                                                <span className="h4" style={{fontFamily: 'Lucida Console'}}> Operation failed ! </span>
                                            </Col>
                                        </>
                        )
                        :
                        <>
                            <Col className="border" align="center">
                                <IoMdInformationCircleOutline className="h1" color="#1589FF"
                                                              size={56}></IoMdInformationCircleOutline>
                                <span className="h4" style={{fontFamily: 'Lucida Console'}}> No customer with such email has been found! </span>
                            </Col>
                        </>
                )
                :
                <>
                    <Col className="border" align="center">
                        <MdOutlineError className="h1" color="red" size={66}></MdOutlineError>
                        <span className="h4" style={{fontFamily: 'Lucida Console'}}> Operation failed ! </span>
                    </Col>
                </>
    );
}

function ValidateEmail(props) {
    let regex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    if (regex.test(props.email) === false && props.email !== '') {
        return (
            <Form.Text className="text-danger"> Please enter a valid email ('asd@fgh.com')</Form.Text>
        )
    }
}

export {NewProfile, EditProfile, ValidateEmail}