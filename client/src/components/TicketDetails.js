import { Button, Container, Row, Col, Form, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import API from '../API';
import { Image } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function TicketDetailsCustomer(props) {
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [closed, setClosed] = useState(false);
    const dayjs = require('dayjs');
    const [inProgress, setInProgress] = useState(false);
    const [resolved, setResolved] = useState(false);
    const [reopened, setReopened] = useState(false);

    const refreshData = async (result) => {
        if (result == 200) {
            if (props.refreshData === 0) {
                props.setRefreshData(1)
            }
            else {
                props.setRefreshData(0)
            };
        }
    }

    const closeTicket = async () => {
        try {
            const result = await API.closeTicket(props.token, props.ticketId, { status: "CLOSED" })
            await refreshData(result);
            setClosed(true);
        } catch (err) {
            console.log("ERROR : " + err);
            toast("Oops , something went wrong. Your ticket status was not updated");
        }
    }

    useEffect(() => {
        if (props.status == "CLOSED") {
            setClosed(true);
        } else setClosed(false)
        if (props.status == "RESOLVED") {
            setResolved(true);
        } else setResolved(false)
        if (props.status == "IN_PROGRESS") {
            setInProgress(true);
        } else setInProgress(false);
        if (props.status == "REOPENED") {
            setReopened(true);
        } else setReopened(false)
    }, [props.status]);

    const imageUrl = `data:image/png;base64,${props.ticketImage}`;
    return (
        <>

            <div style={{ fontSize: 18, fontWeight: 'bold', backgroundColor: '#2B2B2B', color: 'white' }}>TICKET DETAILS</div>


            <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px', marginBottom: '5px' }}>
                <Form.Group className="mb-3 mt-1" controlId="ticketObject">
                    <Form.Label style={{ fontSize: 17 }}>Object</Form.Label>
                    <Form.Control type="text" value={props.ticketObject} readOnly={true} style={{ fontSize: '0.8em' }} />
                </Form.Group>
                {props.ticketImage === null ?

                    <Form.Group className="mb-3" controlId="ticketDescription">
                        <Form.Label style={{ fontSize: 17 }}>Description</Form.Label>
                        <Form.Control as="textarea" style={{ minHeight: '120px', maxHeight: '120px', fontSize: '0.8em' }} value={props.ticketDescription} readOnly={true} />
                    </Form.Group>
                    :
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="ticketDescription">
                                <Form.Label style={{ fontSize: 17 }}>Description</Form.Label>
                                <Form.Control as="textarea" style={{ minHeight: '150px', maxHeight: '150px', fontSize: '0.8em' }} value={props.ticketDescription} readOnly={true} />
                            </Form.Group>
                        </Col>
                        <Col xs="5">
                            <Form.Group className="mb-3" controlId="ticketIamge">
                                <Form.Label style={{ fontSize: 17 }}>Attached image</Form.Label>
                                <Image src={imageUrl} alt="Ticket Image" rounded fluid />
                            </Form.Group>

                        </Col>
                    </Row>
                }

            </Form>
            <Row className='mb-2'>
                <Col>
                    <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px', }}>
                        <Form.Group className="mb-3" controlId="ticketDate">
                            <Form.Label style={{ fontSize: 14 }}>Date</Form.Label>
                            <Form.Control type="text" value={dayjs(props.date).format("DD/MM/YYYY")} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketEAN">
                            <Form.Label style={{ fontSize: 14 }}>EAN</Form.Label>
                            <Form.Control type="text" value={props.EAN} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                    </Form>
                </Col>
                <Col>
                    <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px', }}>
                        <Form.Group className="mb-3" controlId="ticketPriority">
                            <Form.Label style={{ fontSize: 14 }}>Priority</Form.Label>
                            <Form.Control type="text" value={props.priority} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketCategory">
                            <Form.Label style={{ fontSize: 14 }}>Category</Form.Label>
                            <Form.Control type="text" value={props.category} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                    </Form>

                </Col>
                <Col>
                    <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px', }}>
                        <Form.Group className="mb-3" controlId="ticketDevice">
                            <Form.Label style={{ fontSize: 14 }}>Device</Form.Label>
                            <Form.Control type="text" value={props.device} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketBrand">
                            <Form.Label style={{ fontSize: 14 }}>Brand</Form.Label>
                            <Form.Control type="text" value={props.brand} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>

            <Row>
                <Col></Col>
                <Col>
                    <Col>
                        <Button className='mb-2' variant='primary' disabled={props.displayTicketHistory} size='xs' style={{ fontSize: '0.9em' }} onClick={() => {
                            props.setDisplayTicketHistory(true)
                        }}>Ticket History</Button> </Col>

                    {showConfirmation ?
                        <>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9em', marginBottom: '15px' }}>Are you sure you want to close the ticket?</div>
                            <Row>
                                <Col xs={4}><Button className='mb-2' style={{ marginRight: '50px', fontSize: '1.5em' }} variant='outline-success' size='xs' onClick={() => { setShowConfirmation(false); closeTicket(); }
                                }><i class="bi bi-check2-circle" ></i></Button></Col>
                                <Col></Col>
                                <Col xs={4}> <Button className='mb-2' style={{ fontSize: '1.5em' }} variant='outline-danger' size='xs' onClick={() => { setShowConfirmation(false) }}><i class="bi bi-x-circle"></i> </Button></Col>
                            </Row>
                        </>
                        :
                        <Row >
                            <Form style={{ backgroundColor: '#2B2B2B', borderRadius: '15px' }}>
                                <Form.Group className="mb-3" controlId="ticketStatus">
                                    <Form.Label style={{ fontSize: 14, fontWeight: 'bold', fontWeight: 'bold', backgroundColor: '#2B2B2B', color: 'white' }}>Status Ticket</Form.Label>
                                    {closed ?
                                        <Form.Control type="text" style={{ textAlign: 'center', fontWeight: 'bold', color: 'red', fontSize: '0.9em' }} value={props.status} readOnly={true} />
                                        :
                                        <Form.Control type="text" style={{ textAlign: 'center', fontWeight: 'bold', color: 'green', fontSize: '0.9em' }} value={props.status} readOnly={true} />
                                    }
                                </Form.Group>
                            </Form>
                            {closed ?
                                <></>
                                :
                                <Button className='mb-2 mt-2' style={{ fontSize: '0.9em' }} variant='outline-danger' disabled={showConfirmation} size='lg' onClick={() => setShowConfirmation(true)}>Close Ticket</Button>
                            }


                        </Row>
                    }

                </Col>
                <Col></Col>
            </Row>

        </>
    );
}

function TicketDetailsExpert(props) {
    const dayjs = require('dayjs');
    const [closed, setClosed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [resolved, setResolved] = useState(false);
    const [reopened, setReopened] = useState(false);
    const [newStatus, setNewStatus] = useState("notSelected")
    const [isNewStatusSelected, setIsNewStatusSelected] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)


    const refreshData = async (result) => {
        if (result == 200) {
            if (props.refreshData === 0) {
                props.setRefreshData(1)
            }
            else {
                props.setRefreshData(0)
            };
        }
    }

    const updateStatus = async (newStatus) => {
        try {
            const result = await API.updateTicketStatusExpert(props.token, props.ticketId, { status: newStatus })
            await refreshData(result);
            if (newStatus == "CLOSED") {
                setClosed(true);
            }
        } catch (err) {
            console.log("ERROR : " + err);
            toast("Oops , something went wrong. Your ticket status was not updated");
        }
    }


    useEffect(() => {
        if (props.status == "CLOSED") {
            setClosed(true);
        } else setClosed(false)
        if (props.status == "RESOLVED") {
            setResolved(true);
        } else setResolved(false)
        if (props.status == "IN_PROGRESS") {
            setInProgress(true);
        } else setInProgress(false);
        if (props.status == "REOPENED") {
            setReopened(true);
        } else setReopened(false)
    }, [props.status]);

    const imageUrl = `data:image/png;base64,${props.ticketImage}`;
    return (
        <>

            <div style={{ fontSize: 18, fontWeight: 'bold', backgroundColor: '#2B2B2B', color: 'white' }}>TICKET DETAILS</div>

            <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px', marginBottom: '5px' }}>
                <Form.Group className="mb-3" controlId="ticketObject">
                    <Form.Label style={{ fontSize: 17 }}>Object</Form.Label>
                    <Form.Control type="text" value={props.ticketObject} readOnly={true} style={{ fontSize: '0.8em' }} />
                </Form.Group>

                {props.ticketImage == null ?

                    <Form.Group className="mb-3" controlId="ticketDescription">
                        <Form.Label style={{ fontSize: 17 }}>Description</Form.Label>
                        <Form.Control as="textarea" style={{ minHeight: '120px', maxHeight: '120px', fontSize: '0.8em' }} value={props.ticketDescription} readOnly={true} />
                    </Form.Group>
                    :
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="ticketDescription">
                                <Form.Label style={{ fontSize: 17 }}>Description</Form.Label>
                                <Form.Control as="textarea" style={{ minHeight: '150px', maxHeight: '150px', fontSize: '0.8em' }} value={props.ticketDescription} readOnly={true} />
                            </Form.Group>
                        </Col>
                        <Col xs="5">
                            <Form.Group className="mb-3" controlId="ticketIamge">
                                <Form.Label style={{ fontSize: 17 }}>Attached image</Form.Label>
                                <Image src={imageUrl} alt="Ticket Image" rounded fluid />
                            </Form.Group>

                        </Col>
                    </Row>
                }
            </Form>
            <Row className='mb-2'>
                <Col>
                    <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px', }}>
                        <Form.Group className="mb-3" controlId="ticketDate">
                            <Form.Label style={{ fontSize: 14 }}>Date</Form.Label>
                            <Form.Control type="text" value={dayjs(props.date).format("DD/MM/YYYY")} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketEAN">
                            <Form.Label style={{ fontSize: 14 }}>EAN</Form.Label>
                            <Form.Control type="text" value={props.EAN} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                    </Form>
                </Col>
                <Col>
                    <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px', }}>
                        <Form.Group className="mb-3" controlId="ticketPriority">
                            <Form.Label style={{ fontSize: 14 }}>Priority</Form.Label>
                            <Form.Control type="text" value={props.priority} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketCategory">
                            <Form.Label style={{ fontSize: 14 }}>Category</Form.Label>
                            <Form.Control type="text" value={props.category} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                    </Form>
                </Col>
                <Col>
                    <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px', }}>
                        <Form.Group className="mb-3" controlId="ticketDevice">
                            <Form.Label style={{ fontSize: 14 }}>Device</Form.Label>
                            <Form.Control type="text" value={props.device} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketBrand">
                            <Form.Label style={{ fontSize: 14 }}>Brand</Form.Label>
                            <Form.Control type="text" value={props.brand} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>


            <Row>

                <Col></Col>
                <Col>
                    <Row >
                        <Col>
                            <Button className='mb-2' variant='primary' disabled={props.displayTicketHistory} size='xs' style={{ fontSize: '0.9em' }} onClick={() => {
                                props.setDisplayTicketHistory(true)
                            }}>Ticket History</Button> </Col>
                        <Form style={{ backgroundColor: '#2B2B2B', borderRadius: '15px' }}>
                            <Form.Group className="mb-3" controlId="ticketStatus">
                                <Form.Label style={{ fontSize: 14, fontWeight: 'bold', fontWeight: 'bold', backgroundColor: '#2B2B2B', color: 'white' }}>Status Ticket</Form.Label>
                                {closed ?
                                    <Form.Control type="text" style={{ textAlign: 'center', fontWeight: 'bold', color: 'red', fontSize: '0.9em' }} value={props.status} readOnly={true} />
                                    :
                                    <Form.Control type="text" style={{ textAlign: 'center', fontWeight: 'bold', color: 'green', fontSize: '0.9em' }} value={props.status} readOnly={true} />
                                }
                            </Form.Group>
                        </Form>

                        {showConfirmation ?
                            <>
                                <div style={{ fontWeight: 'bold', fontSize: '1em', marginBottom: '15px', marginTop: '10px' }}>Update ticket status to  [{newStatus}] ?</div>
                                <Row className=''>
                                    <Col xs={6}>
                                        <div>
                                            <Button className='mb-2' style={{ marginRight: '50px', fontSize: '1.5em' }} variant='outline-success' size='xs' onClick={() => {
                                                setShowConfirmation(false); setIsNewStatusSelected(false); updateStatus(newStatus); setNewStatus("notSelected");
                                            }
                                            }><i className="bi bi-check2-circle" ></i></Button>
                                        </div>
                                    </Col>
                                    <Col></Col>
                                    <Col xs={3}>
                                        <div>
                                            <Button className='mb-2' style={{ fontSize: '1.5em' }} variant='outline-danger' size='xs' onClick={() => {
                                                setShowConfirmation(false); setIsNewStatusSelected(false); setNewStatus("notSelected")
                                            }}><i className="bi bi-x-circle"></i> </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                            :
                            <>
                                {
                                    closed ?
                                        <Form.Select className="mt-2" aria- label="Default select example" onChange={(e) => { setNewStatus(e.target.value); if (e.target.value == "notSelected") { setIsNewStatusSelected(false) } else setIsNewStatusSelected(true) }}>
                                            <option>Select new status</option>
                                            <option value="REOPENED">REOPENED</option>
                                        </Form.Select>
                                        :
                                        <>
                                            {
                                                inProgress ?
                                                    <Form.Select className="mt-2" aria-label="Default select example" onChange={(e) => { setNewStatus(e.target.value); if (e.target.value == "notSelected") { setIsNewStatusSelected(false) } else setIsNewStatusSelected(true) }}>
                                                        <option value="notSelected">Select new status</option>
                                                        <option value="RESOLVED" >RESOLVED</option>
                                                        <option value="CLOSED">CLOSED</option>
                                                    </Form.Select>
                                                    :
                                                    <>
                                                        {reopened ?
                                                            <Form.Select className="mt-2" aria-label="Default select example" onChange={(e) => { setNewStatus(e.target.value); if (e.target.value == "notSelected") { setIsNewStatusSelected(false) } else setIsNewStatusSelected(true) }}>
                                                                <option value="notSelected">Select new status</option>
                                                                <option value="RESOLVED">RESOLVED</option>
                                                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                                <option value="CLOSED">CLOSED</option>
                                                            </Form.Select>
                                                            :
                                                            <>
                                                                {resolved ?
                                                                    <Form.Select className="mt-2" aria-label="Default select example" onChange={(e) => { setNewStatus(e.target.value); if (e.target.value == "notSelected") { setIsNewStatusSelected(false) } else setIsNewStatusSelected(true) }}>
                                                                        <option value="notSelected">Select new status</option>
                                                                        <option value="REOPENED">REOPENED</option>
                                                                        <option value="CLOSED">CLOSED</option>
                                                                    </Form.Select>
                                                                    :
                                                                    <></>
                                                                }
                                                            </>
                                                        }
                                                    </>
                                            }
                                        </>

                                }
                                <Button className='mb-2 mt-2' style={{ fontSize: '0.9em' }} variant='outline-primary' size='lg' disabled={!isNewStatusSelected}
                                    onClick={() => { setShowConfirmation(true) }}
                                >Set Status</Button>

                            </>
                        }


                    </Row>
                </Col >
                <Col></Col>
                <div className='border border-dark'></div>
            </Row >



            <Row className='mt-2' style={{ backgroundColor: '#E6E6E6', marginLeft: '6px', marginRight: '6px', marginBottom: '10px', border: '1px solid #E6E6E6', borderRadius: '15px' }}>

                <div style={{ fontSize: 18, fontWeight: 'bold', backgroundColor: '#2B2B2B', color: 'white' }}>CUSTOMER DATA</div>

                <Row className='mb-2'>
                    <Col>
                        <Form style={{}}>
                            <Form.Group className="mb-3" controlId="CustomerName">
                                <Form.Label style={{ fontSize: 14 }}>Name</Form.Label>
                                <Form.Control type="text" value={props.customerName} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="City">
                                <Form.Label style={{ fontSize: 14 }}>City</Form.Label>
                                <Form.Control type="text" value={props.customerCity} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col>

                        <Form style={{}}>
                            <Form.Group className="mb-3" controlId="CustomerSurname">
                                <Form.Label style={{ fontSize: 14 }}>Surname</Form.Label>
                                <Form.Control type="text" value={props.customerSurname} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="CustomerAddress">
                                <Form.Label style={{ fontSize: 14 }}>Address</Form.Label>
                                <Form.Control type="text" value={props.customerAddress + " " + props.customerStreetNumber} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>

                        </Form>


                    </Col>
                    <Col>
                        <Form style={{}}>
                            <Form.Group className="mb-3" controlId="CustomerPhone">
                                <Form.Label style={{ fontSize: 14 }}>Phone</Form.Label>
                                <Form.Control type="text" value={props.customerPhone} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="CustomerPostalCode">
                                <Form.Label style={{ fontSize: 14 }}>Postal Code</Form.Label>
                                <Form.Control type="text" value={props.customerPostalCode} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Row>
            <Col>
            </Col>

        </>
    );
}

function TicketDetailsManager(props) {
    const [closed, setClosed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [resolved, setResolved] = useState(false);
    const [reopened, setReopened] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const dayjs = require('dayjs');

    const navigate = useNavigate();

    const updateStatus = async (newStatus) => {
        try {
            const result = await API.updateTicketStatusToOpenManager(props.token, props.ticketId, { status: newStatus });
            navigate(-1);
            toast("Ticket status has been resetted to Open successfully");
        } catch (err) {
            console.log("ERROR : " + err);
            toast("Oops , something went wrong. Your ticket status was not updated");
        }
    }

    useEffect(() => {
        if (props.status == "CLOSED") {
            setClosed(true);
        } else setClosed(false)
        if (props.status == "RESOLVED") {
            setResolved(true);
        } else setResolved(false)
        if (props.status == "IN_PROGRESS") {
            setInProgress(true);
        } else setInProgress(false);
        if (props.status == "REOPENED") {
            setReopened(true);
        } else setReopened(false)
    }, [props.status]);

    const imageUrl = `data:image/png;base64,${props.ticketImage}`;
    return (
        <>

            <div style={{ fontSize: 18, fontWeight: 'bold', backgroundColor: '#2B2B2B', color: 'white' }}>TICKET DETAILS</div>

            <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px', marginBottom: '5px' }}>
                <Form.Group className="mb-3" controlId="ticketObject">
                    <Form.Label style={{ fontSize: 17 }}>Object</Form.Label>
                    <Form.Control type="text" value={props.ticketObject} readOnly={true} style={{ fontSize: '0.8em' }} />
                </Form.Group>

                {props.ticketImage == null ?

                    <Form.Group className="mb-3" controlId="ticketDescription">
                        <Form.Label style={{ fontSize: 17 }}>Description</Form.Label>
                        <Form.Control as="textarea" style={{ minHeight: '120px', maxHeight: '120px', fontSize: '0.8em' }} value={props.ticketDescription} readOnly={true} />
                    </Form.Group>
                    :
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="ticketDescription">
                                <Form.Label style={{ fontSize: 17 }}>Description</Form.Label>
                                <Form.Control as="textarea" style={{ minHeight: '150px', maxHeight: '150px', fontSize: '0.8em' }} value={props.ticketDescription} readOnly={true} />
                            </Form.Group>
                        </Col>
                        <Col xs="5">
                            <Form.Group className="mb-3" controlId="ticketIamge">
                                <Form.Label style={{ fontSize: 17 }}>Attached image</Form.Label>
                                <Image src={imageUrl} alt="Ticket Image" rounded fluid />
                            </Form.Group>

                        </Col>
                    </Row>
                }
            </Form>
            <Row className='mb-2'>
                <Col>
                    <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px' }}>
                        <Form.Group className="mb-3" controlId="ticketDate">
                            <Form.Label style={{ fontSize: 14 }}>Date</Form.Label>
                            <Form.Control type="text" value={dayjs(props.date).format("DD/MM/YYYY")} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketEAN">
                            <Form.Label style={{ fontSize: 14 }}>EAN</Form.Label>
                            <Form.Control type="text" value={props.EAN} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                    </Form>
                </Col>
                <Col>
                    <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px' }}>
                        <Form.Group className="mb-3" controlId="ticketPriority">
                            <Form.Label style={{ fontSize: 14 }}>Priority</Form.Label>
                            <Form.Control type="text" value={props.priority} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketCategory">
                            <Form.Label style={{ fontSize: 14 }}>Category</Form.Label>
                            <Form.Control type="text" value={props.category} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                    </Form>
                </Col>
                <Col>
                    <Form style={{ backgroundColor: '#E6E6E6', border: '1px solid #E6E6E6', borderRadius: '15px' }}>
                        <Form.Group className="mb-3" controlId="ticketDevice">
                            <Form.Label style={{ fontSize: 14 }}>Device</Form.Label>
                            <Form.Control type="text" value={props.device} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketBrand">
                            <Form.Label style={{ fontSize: 14 }}>Brand</Form.Label>
                            <Form.Control type="text" value={props.brand} readOnly={true} style={{ fontSize: '0.8em' }} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>

            <Row>
                <Col></Col>
                <Col xs={3}>
                    <Row >
                        <Form style={{ backgroundColor: '#2B2B2B', borderRadius: '10px', border: '1px solid black', marginBottom: '2px' }}>
                            <Form.Group className="mb-3" controlId="ticketStatus">
                                <Form.Label style={{ fontSize: 14, fontWeight: 'bold', fontWeight: 'bold', backgroundColor: '#2B2B2B', color: 'white' }}>Assigned Expert</Form.Label>
                                <Form.Control type="text" style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: '0.9em' }} value={props.assignedExpert} readOnly={true} />
                            </Form.Group>
                        </Form>
                    </Row>
                </Col>

                <Col xs={3}>
                    <Button className='mb-2' variant='primary' disabled={props.displayTicketHistory} size='xs' style={{ fontSize: '0.9em' }} onClick={() => {
                        props.setDisplayTicketHistory(true)
                    }}>Ticket History</Button>
                    {showConfirmation ?
                        <>
                            <div style={{ fontWeight: 'bold', fontSize: '1em', marginBottom: '15px', marginTop: '10px', borderTop: '1px solid black' }}> Reset ticket status to [OPEN]?</div>
                            <Row>
                                <Col xs={6}>
                                    <div>
                                        <Button className='mb-2' style={{ marginRight: '50px', fontSize: '1.5em' }} variant='outline-success' size='xs' onClick={() => {
                                            setShowConfirmation(false); updateStatus("OPEN"); setInProgress(false);
                                        }
                                        }><i className="bi bi-check2-circle" ></i></Button>
                                    </div>
                                </Col>
                                <Col></Col>
                                <Col xs={4}>
                                    <div>
                                        <Button className='mb-2' style={{ fontSize: '1.5em' }} variant='outline-danger' size='xs' onClick={() => {
                                            setShowConfirmation(false);
                                        }}><i className="bi bi-x-circle"></i> </Button>
                                    </div>
                                </Col>
                            </Row>
                        </>
                        :
                        <>
                            {inProgress ?
                                <Button className="mb-1" variant='warning' size='xs' style={{ fontSize: '0.8em' }} onClick={() => { setShowConfirmation(true) }}> Reset to Open Status </Button>
                                :
                                <></>
                            }
                        </>
                    }
                </Col>
                <Col xs={3}>
                    <Row >
                        <Form style={{ backgroundColor: '#2B2B2B', borderRadius: '15px' }}>
                            <Form.Group className="mb-3" controlId="ticketStatus">
                                <Form.Label style={{ fontSize: 14, fontWeight: 'bold', fontWeight: 'bold', backgroundColor: '#2B2B2B', color: 'white' }}>Status Ticket</Form.Label>
                                {closed ?
                                    <Form.Control type="text" style={{ textAlign: 'center', fontWeight: 'bold', color: 'red', fontSize: '0.9em' }} value={props.status} readOnly={true} />
                                    :
                                    <Form.Control type="text" style={{ textAlign: 'center', fontWeight: 'bold', color: 'green', fontSize: '0.9em' }} value={props.status} readOnly={true} />
                                }
                            </Form.Group>
                        </Form>
                    </Row>
                </Col>
                <Col></Col>
                <div className='border border-dark'></div>
            </Row>



            <Row className='mt-2' style={{ backgroundColor: '#E6E6E6', marginLeft: '6px', marginRight: '6px', marginBottom: '10px', marginBottom: '10px', border: '1px solid #E6E6E6', borderRadius: '15px' }}>

                <div style={{ fontSize: 18, fontWeight: 'bold', backgroundColor: '#2B2B2B', color: 'white' }}>CUSTOMER DATA</div>

                <Row className='mb-2'>
                    <Col>
                        <Form style={{ backgroundColor: '#E6E6E6' }}>
                            <Form.Group className="mb-3" controlId="ticketDate">
                                <Form.Label style={{ fontSize: 14 }}>Name</Form.Label>
                                <Form.Control type="text" value={props.customerName} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="ticketEAN">
                                <Form.Label style={{ fontSize: 14 }}>City</Form.Label>
                                <Form.Control type="text" value={props.customerCity} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col>

                        <Form style={{ backgroundColor: '#E6E6E6' }}>
                            <Form.Group className="mb-3" controlId="ticketPriority">
                                <Form.Label style={{ fontSize: 14 }}>Surname</Form.Label>
                                <Form.Control type="text" value={props.customerSurname} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="ticketCategory">
                                <Form.Label style={{ fontSize: 14 }}>Address</Form.Label>
                                <Form.Control type="text" value={props.customerAddress} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>

                        </Form>


                    </Col>
                    <Col>
                        <Form style={{ backgroundColor: '#E6E6E6' }}>
                            <Form.Group className="mb-3" controlId="ticketDevice">
                                <Form.Label style={{ fontSize: 14 }}>Phone</Form.Label>
                                <Form.Control type="text" value={props.customerPhone} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="ticketBrand">
                                <Form.Label style={{ fontSize: 14 }}>Postal Code</Form.Label>
                                <Form.Control type="text" value={props.customerPostalCode} readOnly={true} style={{ fontSize: '0.8em' }} />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Row>
            <Col>
            </Col>

        </>
    );
}

export { TicketDetailsCustomer, TicketDetailsExpert, TicketDetailsManager };