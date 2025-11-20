import { Container, Table, Button, Spinner } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';
const dayjs = require('dayjs');

function CustomerTickets(props) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getTickets = async () => {
    setIsLoading(true);
    try {
      const ticketsList = await API.getCustomerTickets(props.customer.token, props.customer.email);
      setTickets(ticketsList);
    } catch (err) {
      setTickets([]);
    }
    setIsLoading(false);
  }

  const getTicketsPeriodically = async () => {
    try {
      const ticketsList = await API.getCustomerTickets(props.customer.token, props.customer.email);
      setTickets(ticketsList);
    } catch (err) {
      setTickets([]);
    }
  }

  useEffect(() => {
    getTickets();
  }, []);

  useEffect(() => {
    let intervalId = setInterval(getTicketsPeriodically, 2000);

    getTicketsPeriodically(); // Run fetchData() once immediately

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <Container fluid className="pb-4 px-4">
        <h3 className="text-start">Tickets</h3>
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
            {tickets.map((t, index) =>
              <tr key={index}>
                <td>{t.id}</td>
                <td>{t.saleId}</td>
                <td>{t.ean}</td>
                <td>{t.device}</td>
                <td>{t.brand}</td>
                <td>{t.status}</td>
                <td>{dayjs(t.openedDate).format("DD/MM/YYYY")}</td>
                <td>{dayjs(t.lastUpdate).format("DD/MM/YYYY")}</td>
                <td><Button variant="primary" onClick={() => navigate(`/customer/tickets/${t.id}`)}>View</Button></td>
              </tr>
            )}
          </tbody>
        </Table>}
      </Container>
    </>
  );
}

export default CustomerTickets;
