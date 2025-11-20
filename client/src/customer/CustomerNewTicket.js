import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ButtonGroup, Container, Row, Col } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import API from '../API';
import NewTicket from '../models/NewTicket';
import { Ticket } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function BreadcrumbNav() {
  const navigate = useNavigate();

  return (
    <Breadcrumb>

      <Breadcrumb.Item onClick={() => navigate(-1)}>
        Products
      </Breadcrumb.Item>
      <Breadcrumb.Item active>Open Ticket</Breadcrumb.Item>
    </Breadcrumb>
  );
}

function CustomerNewTicket(props) {
  const navigate = useNavigate();

  const { saleId } = useParams();

  const [fieldObject, setFieldObject] = useState('');
  const [fieldDesc, setFieldDesc] = useState('');

  const handleFieldObjectChange = (event) => {
    setFieldObject(event.target.value);
  };

  const handleFieldDescChange = (event) => {
    setFieldDesc(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    let newTicket = new NewTicket(fieldObject, fieldDesc, props.email, saleId, selectedFiles);
    try {
      await API.addNewTicket(props.customer.token, newTicket)
      toast("Ticket create successfully")
      navigate(-1)
    }
    catch (err) {
      toast(err)
    }
  };

  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0]; //Limiting to 1 files
    const reader = new FileReader();
    if (file == null) {
      setSelectedFiles(null)
    } else {
      reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        const array = new Uint8Array(arrayBuffer);
        const fileByteArray = Array.from(array);

        setSelectedFiles(fileByteArray);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <NavigationBar setLoggedIn={props.setLoggedIn} loggedIn={props.loggedIn} isCustomer={props.isCustomer} email={props.email} />
      <Container fluid className="px-4 py-4">
        <BreadcrumbNav />
        <h1>Open New Ticket for {props.productSel}</h1>
        <Row className="text-start">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="newTicketForm.object">
              <Form.Label>Object</Form.Label>
              <Form.Control required type="text" placeholder="Object of the new ticket" value={fieldObject} onChange={handleFieldObjectChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newTicketForm.description">
              <Form.Label>Description</Form.Label>
              <Form.Control required as="textarea" rows={5} placeholder="Describe here your problem" value={fieldDesc} onChange={handleFieldDescChange} />
            </Form.Group>
            <Form.Group controlId="newTicketForm.files" className="mb-3">
              <Form.Label>Attachments</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>{'  '}
            <Button onClick={() => navigate(-1)} variant="danger">Cancel</Button>
          </Form>
        </Row>
      </Container>
    </>
  );
}

export default CustomerNewTicket;