import { Container, Table, Button, Spinner } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';
const dayjs = require('dayjs');

function ExpertTickets(props) {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  // TODO: scommentare quando sarà fixato il Ticket
  const getTickets = async () => {
    setIsLoading(true);
    try {
      const ticketsList = await API.getExpertTickets(props.expert.token, props.expert.id);
      setTickets(ticketsList);
    } catch (err) {
      setTickets([]);
    }
    setIsLoading(false);
  }

  const getTicketsPeriodically = async () => {
    try {
      const ticketsList = await API.getExpertTickets(props.expert.token, props.expert.id);
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
      <NavigationBar setLoggedIn={props.setLoggedIn} email={props.email} isCustomer={props.isCustomer} loggedIn={props.loggedIn} />
      <Container fluid className="py-4 px-4">
        <h3 className="text-start">Tickets</h3>
        <p className="text-start">Select a ticket you've been assigned to see the details</p>
        {isLoading === true ? <div><Spinner /></div> :
          <Table striped bordered hover>
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
                  <td><Button variant="primary" onClick={() => navigate(`/expert/tickets/${t.id}`)}>View</Button></td>
                </tr>
              )}
              {/* <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr> */}
            </tbody>
          </Table>
        }
      </Container>
    </>
  );
}

export default ExpertTickets;
