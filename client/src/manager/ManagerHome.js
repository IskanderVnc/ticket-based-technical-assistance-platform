import { Container, Table, Button, Tabs, Tab, Form, Col, Row, Modal, Spinner } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import API from '../API';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const dayjs = require('dayjs');

const domains = [
  { value: 'COMPUTER', label: 'Computer' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'TV', label: 'TV' },
  { value: 'HOUSEHOLD_APPLIANCE', label: 'Household appliance' }
];

function ManagerHome(props) {
  const navigate = useNavigate();
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getUnassignedTickets = async () => {
    setIsLoading(true);
    try {
      const unassignedTicketsList = await API.getUnassignedTickets(props.manager.token);
      setUnassignedTickets(unassignedTicketsList);
    } catch (err) {
      setUnassignedTickets([]);
    }
    setIsLoading(false);
  }

  const getAssignedTickets = async () => {
    setIsLoading(true);
    try {
      const assignedTicketsList = await API.getAssignedTickets(props.manager.token);
      setAssignedTickets(assignedTicketsList);
    } catch (err) {
      setAssignedTickets([]);
    }
    setIsLoading(false);
  }

  const getUnassignedTicketsPeriodically = async () => {
    try {
      const unassignedTicketsList = await API.getUnassignedTickets(props.manager.token);
      setUnassignedTickets(unassignedTicketsList);
    } catch (err) {
      setUnassignedTickets([]);
    }
  }

  const getAssignedTicketsPeriodically = async () => {
    try {
      const assignedTicketsList = await API.getAssignedTickets(props.manager.token);
      setAssignedTickets(assignedTicketsList);
    } catch (err) {
      setAssignedTickets([]);
    }
  }

  useEffect(() => {
    getUnassignedTickets();
    getAssignedTickets();
  }, []);

  useEffect(() => {
    let intervalId = setInterval(getAssignedTicketsPeriodically, 2000);

    getAssignedTicketsPeriodically();

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let intervalId = setInterval(getUnassignedTicketsPeriodically, 2000);

    getUnassignedTicketsPeriodically();

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
    // Check and see if errors exist, and remove them from the error object:
    if (!!errors[field]) setErrors({
      ...errors,
      [field]: null
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // get our new errors
    const newErrors = findFormErrors();
    // Conditional logic:
    if (Object.keys(newErrors).length > 0) {
      // We got errors!
      setErrors(newErrors);
    } else {
      try {
        const { name, surname, email, password, confirmPassword } = form;
        await API.createExpert(props.manager.token, {
          email: email,
          userName: email,
          password: password,
          name: name,
          surname: surname,
          domains: selectedDomains.map((d) => d.value)
        });
        toast("Expert has been created successfully");
      } catch (err) {
        setAssignedTickets([]);
        toast("Oops, something went wrong. An expert with this email may already exist");
      }

      // No errors! Put any logic here for the form submission!
      handleCloseModal();
    }
  }

  const findFormErrors = () => {
    const { name, surname, email, password, confirmPassword } = form;
    const newErrors = {};
    // name errors
    if (!name || name === '') newErrors.name = 'Cannot be blank';
    // surname errors
    if (!surname || surname === '') newErrors.surname = 'Cannot be blank';
    // email errors
    if (!email || email === '') newErrors.email = 'Cannot be blank';
    else if (!isEmailValid(email)) newErrors.email = 'Email should have abc@xyz.com format';
    // password erros
    if (!password || password === '') newErrors.password = 'Cannot be blank';
    else if (password !== confirmPassword) newErrors.password = 'Inserted password and confirmed password are different';
    // confirm password erros
    if (!confirmPassword || confirmPassword === '') newErrors.confirmPassword = 'Cannot be blank';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Inserted password and confirmed password are different';

    return newErrors;
  }

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const isEmailValid = (email) => {
    let regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    if (regex.test(email) === false && email !== '') {
      return false;
    } else return true;
  }

  return (
    <>
      <NavigationBar setLoggedIn={props.setLoggedIn} email={props.email} isCustomer={props.isCustomer} loggedIn={props.loggedIn} />
      <Tabs
        defaultActiveKey="unassignedTickets"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="unassignedTickets" title="Unassigned Tickets">
          <Container fluid className="pb-4 px-4">
            <h3 className="text-start">Unassigned Tickets</h3>
            <p className="text-start">Select a ticket you want to assign<br />Do you want to register a new expert?<Button variant="link" onClick={handleOpenModal}>Click here</Button></p>
            {isLoading === true ? <div><Spinner /></div> : <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sale ID</th>
                  <th>EAN</th>
                  <th>Device</th>
                  <th>Brand</th>
                  <th>Status</th>
                  <th>Opened date</th>
                  <th>Last update</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {unassignedTickets.length !== 0 ?
                  unassignedTickets.map((t, index) =>
                    <tr key={index}>
                      <td>{t.id}</td>
                      <td>{t.saleId}</td>
                      <td>{t.ean}</td>
                      <td>{t.device}</td>
                      <td>{t.brand}</td>
                      <td>{t.status}</td>
                      <td>{dayjs(t.openedDate).format("DD/MM/YYYY")}</td>
                      <td>{dayjs(t.lastUpdate).format("DD/MM/YYYY")}</td>
                      <td><Button variant="primary" onClick={() => navigate(`/manager/assign-ticket/${t.id}`)}>Assign</Button></td>
                    </tr>
                  ) : <></>}
              </tbody>
            </Table>}
          </Container>
        </Tab>
        <Tab eventKey="assignedTickets" title="Assigned Tickets">
          <Container fluid className="pb-4 px-4">
            <h3 className="text-start">Assigned Tickets</h3>
            <p className="text-start">Select a ticket to see the details</p>
            {isLoading === true ? <div><Spinner /></div> : <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sale ID</th>
                  <th>EAN</th>
                  <th>Device</th>
                  <th>Brand</th>
                  <th>Status</th>
                  <th>Opened date</th>
                  <th>Last update</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {assignedTickets.length !== 0 ?
                  assignedTickets.map((t, index) =>
                    <tr key={index}>
                      <td>{t.id}</td>
                      <td>{t.saleId}</td>
                      <td>{t.ean}</td>
                      <td>{t.device}</td>
                      <td>{t.brand}</td>
                      <td>{t.status}</td>
                      <td>{dayjs(t.openedDate).format("DD/MM/YYYY")}</td>
                      <td>{dayjs(t.lastUpdate).format("DD/MM/YYYY")}</td>
                      <td><Button variant="primary" onClick={() => navigate(`/manager/tickets/${t.id}`)}>View</Button></td>
                    </tr>
                  ) : <></>}
              </tbody>
            </Table>}
          </Container>
        </Tab>
      </Tabs>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Register expert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="expertFormName">
                <Form.Label className="text-start">Name</Form.Label>
                <Form.Control
                  onChange={e => setField('name', e.target.value)}
                  isInvalid={!!errors.name}
                  placeholder="John" />
                <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="expertFormSurname">
                <Form.Label className="text-start">Surname</Form.Label>
                <Form.Control
                  onChange={e => setField('surname', e.target.value)}
                  isInvalid={!!errors.surname}
                  placeholder="Smith" />
                <Form.Control.Feedback type='invalid'>{errors.surname}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="expertFormDomains">
                <Form.Label className="text-start">Domains</Form.Label>
                <Select
                  isMulti
                  value={selectedDomains}
                  onChange={setSelectedDomains}
                  options={domains}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="expertFormEmail">
                <Form.Label className="text-start">Email</Form.Label>
                <Form.Control
                  onChange={e => setField('email', e.target.value)}
                  isInvalid={!!errors.email}
                  type="email"
                  placeholder="email@email.com" />
                <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="expertFormPassword">
                <Form.Label className="text-start">Password</Form.Label>
                <Form.Control
                  onChange={e => setField('password', e.target.value)}
                  isInvalid={!!errors.password}
                  type="password"
                  placeholder="Password" />
                <Form.Control.Feedback type='invalid'>{errors.password}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="expertFormConfirmPassword">
                <Form.Label className="text-start">Confirm password</Form.Label>
                <Form.Control
                  onChange={e => setField('confirmPassword', e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                  type="password"
                  placeholder="Confirm password" />
                <Form.Control.Feedback type='invalid'>{errors.confirmPassword}</Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>Register</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ManagerHome;