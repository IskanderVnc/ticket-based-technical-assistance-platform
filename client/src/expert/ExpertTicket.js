import { Navbar, Container, Row, Col, Spinner } from 'react-bootstrap';
import { TicketDetailsExpert } from '../components/TicketDetails';
import { ChatExpert } from '../components/Chat';
import TicketHistory from '../components/TicketHistory';
import NavigationBar from '../components/NavigationBar';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../API';

function ExpertTicket(props) {
  const navigate = useNavigate()
  const { id } = useParams();
  const [ticket, setTicket] = useState({})
  const [product, setProduct] = useState({})
  const [displayTicketHistory, setDisplayTicketHistory] = useState(false);
  const [ticketHistory, setTicketHistory] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerSurname, setCustomerSurname] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPostalCode, setCustomerPostalCode] = useState("");
  const [customerStreetNumber, setCustomerStreetNumber] = useState("");
  const [refreshData, setRefreshData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);

  const assignedExpert = ""
  /*const ticketHistory = [{ "status": "OPEN", "date": "20/06/2023 15:15" }, { "status": "IN PROGRESS", "date": "20/06/2023 16:20" }, { "status": "RESOLVED", "date": "20/07/2023 09:24" },
  { "status": "CLOSED", "date": "20/07/2023 10:05" }, { "status": "REOPENED", "date": "20/07/2023 12:32" },
  { "status": "REOPENED", "date": "20/07/2023 12:33" }, { "status": "REOPENED", "date": "20/07/2023 12:42" }
    , { "status": "REOPENED", "date": "20/07/2023 12:55" }, { "status": "REOPENED", "date": "20/07/2023 1222" }, { "status": "TEST", "date": "20/07/2023 123123" }]*/

  const getSelectedTicketAndProductDataAndCustomerDetails = async () => {
    try {
      const ticketDetails = await API.getTicketDetails(props.expert.token, id)
      setTicket({
        object: ticketDetails.object,
        description: ticketDetails.description,
        openedDate: ticketDetails.openedDate,
        priority: ticketDetails.priority,
        status: ticketDetails.status,
        image: ticketDetails.image
      })

      const messages = ticketDetails.messages.map((element) => {
        return {
          message: element.text,
          image: element.image,
          sent: element.timestamp,
          sender: element.sender === "customer" ? 1 : 0,
          msgKey: element.id
        }
      })
      setChatMessages(messages.sort((a, b) => new Date(a.sent) - new Date(b.sent)));
      setCustomerName(ticketDetails.customer.name);
      setCustomerSurname(ticketDetails.customer.surname);
      setProduct({ device: ticketDetails.device, ean: ticketDetails.ean, category: ticketDetails.category, brand: ticketDetails.brand })
      const customerDetails = await API.getCustomerData(props.expert.token, ticketDetails.customer.email);
      setCustomerAddress(customerDetails.address);
      setCustomerCity(customerDetails.city);
      setCustomerPhone(customerDetails.phone);
      setCustomerPostalCode(customerDetails.postalCode);
      setCustomerStreetNumber(customerDetails.streetNumber);
    } catch (err) {
      setTicket({});
    }
  }
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
    const formattedTime = `${formattedHours}:${formattedMinutes}`;

    return `${formattedDate}\n${formattedTime}`;
  }

  const getSelectedTicketHistory = async () => {
    try {
      const th = await API.getTicketHistory(props.expert.token, id)
      var thList = []
      for (let i = 0; i < th.length; i++) {
        thList.push({ status: th[i].status, date: formatTimestamp(th[i].timestamp) });
      }
      setTicketHistory(thList)
    } catch (err) {
      console.log("Getting history ERROR : " + err)
      setTicketHistory([])
    }
  }

  const fetchData = () => {
    getSelectedTicketAndProductDataAndCustomerDetails();
    getSelectedTicketHistory();
  }

  useEffect(() => {
    let intervalId = setInterval(fetchData, 2000);

    fetchData(); // Run fetchData() once immediately

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <div className="wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <NavigationBar setLoggedIn={props.setLoggedIn} email={props.email} style={{ position: 'sticky', top: '0' }} isCustomer={props.isCustomer} loggedIn={props.loggedIn} />
          <div className="scrollable-content" style={{ flex: '1', overflowY: 'auto' }}>
            <Container fluid style={{ marginBottom: '12px' }}>
              {/*<Row>
                <Col style={{ disply: 'flex', justifyContent: 'left' }}>
                  <span className="text-primary me-3 align-self-left" onClick={() => { navigate(-1) }} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    Back
                  </span>
                </Col>
                <Col xs={11}></Col>
              </Row>*/}
              <Row>
                <Col className='mt-3 ' style={{ overflow: 'visible', marginRight: '2px', marginLeft: '13px' }}>
                  <TicketDetailsExpert ticketImage={ticket.image} ticketObject={ticket.object} ticketDescription={ticket.description} date={ticket.openedDate} priority={ticket.priority} status={ticket.status} device={product.device}
                    EAN={product.ean} category={product.category} brand={product.brand} assignedExpert={assignedExpert} customerName={customerName} customerSurname={customerSurname} customerPhone={customerPhone}
                    customerCity={customerCity} customerAddress={customerAddress} customerStreetNumber={customerStreetNumber} customerPostalCode={customerPostalCode} setDisplayTicketHistory={setDisplayTicketHistory} displayTicketHistory={displayTicketHistory}
                    refreshData={refreshData} setRefreshData={setRefreshData} ticketId={id} token={props.expert.token}
                  ></TicketDetailsExpert>
                  {displayTicketHistory ?
                    <>
                      <Col className='zeroPaddingAndMargin' style={{ position: 'absolute', top: '40%', left: '36%', width: '30vw', height: '35vh', overflowY: 'hidden', overflowX: 'hidden', border: '5px ridge #D0D0D0', padding: '0px', backgroundColor: '#2B2B2B' }}>
                        <TicketHistory ticketHistory={ticketHistory} setDisplayTicketHistory={setDisplayTicketHistory} ></TicketHistory>
                      </Col>
                    </>
                    :
                    <>
                    </>
                  }
                </Col>
                <Col className='mt-3 square border border-dark' style={{ backgroundColor: '#F0F0F0', overflowY: 'visible', marginRight: '13px' }}>
                  <ChatExpert getMess={getSelectedTicketAndProductDataAndCustomerDetails} ticketId={id} token={props.expert.token} chatMessages={chatMessages} typeOfUser={"expert"} setChatMessages={setChatMessages} customerName={customerName} customerSurname={customerSurname} status={ticket.status}></ChatExpert>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );

}

export default ExpertTicket;