import React from 'react';
import { ButtonGroup, Container, Row, Col, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';

import { Card } from 'react-bootstrap';
import { Columns } from 'react-bootstrap-icons';
import NavigationBar from '../components/NavigationBar';
import { Navigate, useNavigate } from 'react-router-dom';
import ExpertAssignTicket from '../models/ExpertAssignTicket';
import TicketAssignExpert from '../models/TicketAssignExpert';
import API from '../API'
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 




const TicketDetailsBox = (props) => {
  const imageUrl = `data:image/png;base64,${props.ticket.image}`;
  return (
    <Card>
      {/*<Card.Header>Ticket Details</Card.Header>*/}
      <Card.Body>
        <Card.Text>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Object</Form.Label>
              <Form.Control type="text" value={props.ticket.ticketObject} readOnly />
            </Form.Group>
            {props.ticket.image === null ? 
              <Form.Group className="mb-3">
                <Form.Label>Problem Description</Form.Label>
                <Form.Control as="textarea" rows={5} value={props.ticket.description} readOnly />
              </Form.Group>
              :
              <Row>
                <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Problem Description</Form.Label>
                  <Form.Control as="textarea" rows={5} value={props.ticket.description} readOnly />
                </Form.Group>
                </Col>
                <Col>
                <br/>
                  <img src={imageUrl} alt="Ticket Image" rounded fluid style={{ width: '250px', height: 'auto' }}/>
                </Col>
              </Row>
            }
            
          </Form>
        </Card.Text>
        <Card>
          <Card.Header>Product Details</Card.Header>
          <Card.Body>
            <Card.Text>
              EAN: {props.product.ean}&emsp;
              Name: {props.product.name}&emsp;
              Brand: {props.product.brand}&emsp;
              Category: {props.product.category}&emsp;
              Price: {props.product.price}&emsp;
              Release Year: {props.product.releaseYear}
            </Card.Text>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

const AssignExpertBox = (props) => {

  const { id } = useParams();

  const [fieldName, setFieldName] = useState('');
  const [fieldSurname, setFieldSurname] = useState('');
  const [fieldMail, setFieldMail] = useState('');
  const [fieldDomain, setFieldDomain] = useState('');
  const [selExpert, setSelExpert] = useState('');

  

  const filterExperts = (name, surname, mail, domain) => {
    let aus = props.experts;
    if (name != "") {
      aus = aus.filter((e) => e.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (surname != "") {
      aus = aus.filter((e) => e.surname.toLowerCase().includes(surname.toLowerCase()));
    }
    if (mail != "") {
      aus = aus.filter((e) => e.email.toLowerCase().includes(mail.toLowerCase()));
    }
    if (domain != "") {
      aus = aus.filter((e) => e.domains.includes(domain));
    }

    props.setExpertsFiltered(aus)
  }
  const handleselExpertChange = (event) => {
    setSelExpert(event.target.value);
  };

  const handleFieldNameChange = (event) => {
    setFieldName(event.target.value);
    const filterValue = event.target.value;

    filterExperts(filterValue, fieldSurname, fieldMail, fieldDomain);
  };

  const handleFieldSurnameChange = (event) => {
    setFieldSurname(event.target.value);
    const filterValue = event.target.value;

    filterExperts(fieldName, filterValue, fieldMail, fieldDomain);
  };

  const handleFieldMailChange = (event) => {
    setFieldMail(event.target.value);
    const filterValue = event.target.value;

    filterExperts(fieldName, fieldSurname, filterValue, fieldDomain);
  };

  const handleFieldDomainChange = (event) => {
    setFieldDomain(event.target.value);
    const filterValue = event.target.value;

    filterExperts(fieldName, fieldSurname, fieldMail, filterValue);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if(selExpert != ''){
      let assignExpert = new TicketAssignExpert(parseInt(selExpert), selectedPriority.toUpperCase())
      try{
        await API.assignExpert(props.manager.token, id, assignExpert)
        toast("Expert assigned successfully")
        navigate(-1)
      }
      catch(err){
        toast(err)
      }
    }else{
      toast("Chage filter and select an expert.")
    }
    
  };

  const navigate = useNavigate();
  const [selectedPriority, setSelectedPriority] = useState('medium');

  const handlePriorityChange = (option) => {
    setSelectedPriority(option);
  };

  return (
    <Card>

      <Card.Body>

        <Form >
          <Row>Search by:</Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={fieldName} onChange={handleFieldNameChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Surname</Form.Label>
                <Form.Control type="text" value={fieldSurname} onChange={handleFieldSurnameChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={fieldMail} onChange={handleFieldMailChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Domains</Form.Label>
                <Form.Select aria-label="Default select example" value={fieldDomain} onChange={handleFieldDomainChange}>
                  <option value="">All</option>
                  <option value="HOUSEHOLD_APPLIANCE">Household Appliance</option>
                  <option value="TV">Tv</option>
                  <option value="PHONE">Phone</option>
                  <option value="COMPUTER">Computer</option>
                </Form.Select>
              </Form.Group>
            </Col>

          </Row>
        </Form>
        <Form onSubmit={handleSubmit}>

          <Row>

            <Form.Group required as={Row} className="mb-3">
              <Form.Label as="legend" column sm={2}>

              </Form.Label>

              {
                props.expertsFiltered.length == 0 ? <p>No experts match with the filter</p> :
                  props.expertsFiltered.map((expert, index) => (
                    <Form.Check
                      key={expert.email}
                      type="radio"
                      label={expert.name + " " + expert.surname + " - (" + expert.email + ") - [" + expert.domains + "]"}
                      name="formHorizontalRadios"
                      value={expert.id}
                      onChange={handleselExpertChange}
                      required={true}
                    />
                  ))}
            </Form.Group>

          </Row>
          <Row>
            <Col>
              Select ticket priority:
            </Col>
            <Col>
              <ButtonGroup>
                <Button
                  variant={selectedPriority === 'low' ? 'primary' : 'light'}
                  onClick={() => handlePriorityChange('low')}
                >
                  Low
                </Button>
                <Button
                  variant={selectedPriority === 'medium' ? 'primary' : 'light'}
                  onClick={() => handlePriorityChange('medium')}
                >
                  Medium
                </Button>
                <Button
                  variant={selectedPriority === 'high' ? 'primary' : 'light'}
                  onClick={() => handlePriorityChange('high')}
                >
                  High
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Button variant="primary" type="submit">
            Submit
          </Button>{'  '}
          <Button onClick={()=>navigate(-1)} variant="danger">Cancel</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

function AssignTicket(props) {
  const { id } = useParams();
  const [productSel, setProductSel] = useState({})
  const [ticket, setTicket] = useState({})
  const [experts, setExperts] = useState([])
  const [expertsFiltered, setExpertsFiltered] = useState([])
  const [isLoading, setIsLoading] = useState(true);


  const getExperts = async () => {
    try {
      const experts_var = await API.getExperts(props.manager.token)
      setExperts(experts_var)
      setExpertsFiltered(experts_var)
     
    }catch(err) {
      toast("Error during the download of the experts informations.")
      setExperts([])
    }
  }

  const getProduct = async (ean) => {
    try {
      const product = await API.getProduct(props.manager.token, ean);
      setProductSel(product)
    }catch(err) {
      toast("Error during the download of the product informations.")
      setProductSel({})
    }
    setIsLoading(false);
  }

  const getTicket = async () => {
    try {
      const ticket = await API.getTicket(props.manager.token, id)
      getProduct(ticket.productEan);
      setTicket(ticket);
    }catch(err) {
      toast("Error during the download of the ticket informations.")
      setTicket({})
    }
    

  }

  useEffect(() => {
    setIsLoading(true);
    getExperts();
    getTicket();
  }, []);

  return (
    <>
      <NavigationBar setLoggedIn={props.setLoggedIn} email={props.email} isCustomer={props.isCustomer} loggedIn={props.loggedIn}/>
      <Container fluid>
        {isLoading === true ? <div><Spinner /></div> :
        <Row>
          <Col md={6}  >
            <h2 className="m-5">Ticket (id: {ticket.id})</h2>
            <Row className="text-start m-2">
              <TicketDetailsBox ticket={ticket} product={productSel} />
            </Row>
          </Col>
          <Col md={6}>
            <h2 className="m-5">Assign Expert</h2>
            <Row className="text-start m-2">
              <AssignExpertBox experts={experts} expertsFiltered={expertsFiltered} setExpertsFiltered={setExpertsFiltered} manager={props.manager} />
            </Row>
          </Col>
        </Row>
}
      </Container>
    </>
  );
}

export default AssignTicket;