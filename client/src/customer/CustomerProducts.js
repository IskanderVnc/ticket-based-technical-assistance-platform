import { Container, Table, Button, Modal, Form, FormGroup, FormControl, Tabs, Tab, Spinner } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import API from '../API';
import CustomerTickets from './CustomerTickets';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CustomerProducts(props) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dayjs = require('dayjs');
  const currentDate = dayjs();

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const products = await API.getRegisteredProducts(props.customer.token, props.customer.email);
      setProducts(products);
    } catch (err) {
      setProducts([]);
    }
    setIsLoading(false);
  }

  const getSales = async () => {
    setIsLoading(true);
    try {
      const salesList = await API.getUnregisteredProducts(props.customer.token, props.customer.email);
      setSales(salesList)
    } catch (err) {
      setSales([]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getProducts();
    getSales();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFieldName('');
  };

  const handleFieldNameChange = (event) => {
    setFieldName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (products.find((p) => p.saleId == fieldName)) {
      toast("This sale is already registered!");
      handleCloseModal();
      return;
    }
    setIsLoading(true);
    try {
      await API.updateSaleRegistered(props.customer.token, props.customer.email, fieldName);
      setTimeout(() => { getProducts() }, 1000);
    } catch {
      toast("This sale doesn't exist");
      handleCloseModal();
      setIsLoading(false);
      return;
    }
    setIsLoading(false);

    handleCloseModal();
  };

  const handleRegisterSale = async (saleId) => {
    setIsLoading(true);
    try {
      await API.updateSaleRegistered(props.customer.token, props.customer.email, saleId);
      setTimeout(() => { getSales() }, 1000);
      setTimeout(() => { getProducts() }, 1000);
    } catch {
      toast("This sale doesn't exist");
      handleCloseModal();
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    handleCloseModal();
  };

  const getProductsPeriodically = async () => {
    try {
      const productsList = await API.getRegisteredProducts(props.customer.token, props.customer.email);
      setProducts(productsList);
    } catch (err) {
      setProducts([]);
    }
  }

  useEffect(() => {
    let intervalId = setInterval(getProductsPeriodically, 2000);

    getProductsPeriodically(); // Run fetchData() once immediately

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <div className="wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <NavigationBar setLoggedIn={props.setLoggedIn} isCustomer={props.isCustomer} loggedIn={props.loggedIn} email={props.customer.email} style={{ position: 'sticky', top: '0' }} />
          <div className="scrollable-content" style={{ flex: '1', overflowY: 'auto' }}>
            {/* <Container fluid> */}
            <Tabs
              defaultActiveKey="products"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab className="px-4" eventKey="products" title="Products">
                <h3 className="text-start">Registered products</h3>
                <p className="text-start">Need to add a new product? Click here
                  <span className="text-primary ms-1 align-self-center" onClick={handleOpenModal} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    Register new product
                  </span>
                </p>
                {isLoading === true ? <div><Spinner /></div> : <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Sale ID</th>
                      <th>EAN</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Warranty end date</th>
                      <th>Ticket</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length !== 0 ?
                      products.map((t, index) =>
                        <tr key={index}>
                          <td>{t.saleId}</td>
                          <td>{t.ean}</td>
                          <td>{t.name}</td>
                          <td>{t.brand}</td>
                          <td>{t.category}</td>
                          <td>{t.price}</td>
                          <td>{dayjs(t.warrantyEndDate).format("DD/MM/YYYY")}</td>
                          {
                            t.ticketOpened === true ? (
                              <td>Ticket already opened</td>
                            ) : (
                              dayjs(t.warrantyEndDate).isBefore(currentDate) ? (
                                <td>Warranty expired!</td>
                              ) : (
                                <td><Button variant="primary" onClick={() => { props.setProductSel(t.name); navigate(`/customer/open-ticket/${t.saleId}`) }}>Open</Button></td>
                              )
                            )
                          }
                        </tr>
                      ) :
                      <></>}
                  </tbody>
                </Table>}
              </Tab>
              <Tab eventKey="tickets" title="Tickets">
                <CustomerTickets customer={props.customer} setLoggedIn={props.setLoggedIn} loggedIn={props.loggedIn} isCustomer={props.isCustomer} />
              </Tab>
            </Tabs>
            {/* </Container> */}
            <Modal show={showModal} size="lg" onHide={handleCloseModal} style={{}}>
              <Modal.Header closeButton>
                <Modal.Title>Register product</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <FormControl
                      type="text"
                      placeholder="Sale ID"
                      value={fieldName}
                      required={true}
                      onChange={handleFieldNameChange}
                    />
                  </FormGroup>
                  <Button type="submit" className='mt-3'>Register</Button>
                </Form> */}
                {sales.length !== 0 ? <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Sale ID</th>
                      <th>EAN</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Purchased date</th>
                      <th>Register</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length !== 0 ?
                      sales.map((s, index) =>
                        <tr key={index}>
                          <td>{s.saleId}</td>
                          <td>{s.ean}</td>
                          <td>{s.name}</td>
                          <td>{s.brand}</td>
                          <td>{s.category}</td>
                          <td>{s.price}</td>
                          <td>{dayjs(s.warrantyStartDate).format("DD/MM/YYYY")}</td>
                          <td><Button variant="primary" onClick={() => { handleRegisterSale(s.saleId) }}>Register</Button></td>
                        </tr>
                      ) :
                      <></>}
                  </tbody>
                </Table> : <p>There are no unregistered products</p>}
              </Modal.Body>
            </Modal>
          </div>
        </div >
      </div >
    </>
  );
}

export default CustomerProducts;