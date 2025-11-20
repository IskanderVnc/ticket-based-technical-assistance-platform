import { Navbar, Container, Row, Col } from 'react-bootstrap';
import { TicketDetailsManager } from '../components/TicketDetails';
import { ChatManager } from '../components/Chat';
import { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import TicketHistory from '../components/TicketHistory';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../API';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManagerTicket(props) {
  const navigate = useNavigate()
  const { id } = useParams();
  const [ticket, setTicket] = useState({})
  const [product, setProduct] = useState({})
  const [displayTicketHistory, setDisplayTicketHistory] = useState(false);
  const [ticketHistory, setTicketHistory] = useState([]);
  const [assignedExpert, setAssignedExpert] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerSurname, setCustomerSurname] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPostalCode, setCustomerPostalCode] = useState("");
  const [customerStreetNumber, setCustomerStreetNumber] = useState("");
  const [firstStart, setFirstStart] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);

  /*const ticketObject = "The device stopped working"
  const ticketDescription = "The phone stopped working after turning off. The battery was low and after running out of charge completely the phone never turned on again. I tried to even change battery but nothing happened. I may need a substitution. Thanks in advance"
  const date = "12/06/2023"
  const priority = "Medium"
  const device = "iPhoni 22"
  const EAN = "12345678911"
  const category = "Smartphone"
  const brand = "Pear"*/

  /*const ticketHistory = [{ "status": "OPEN", "date": "20/06/2023 15:15" }, { "status": "IN PROGRESS", "date": "20/06/2023 16:20" }, { "status": "RESOLVED", "date": "20/07/2023 09:24" },
  { "status": "CLOSED", "date": "20/07/2023 10:05" }, { "status": "REOPENED", "date": "20/07/2023 12:32" },
  { "status": "REOPENED", "date": "20/07/2023 12:33" }, { "status": "REOPENED", "date": "20/07/2023 12:42" }
    , { "status": "REOPENED", "date": "20/07/2023 12:55" }, { "status": "REOPENED", "date": "20/07/2023 1222" }, { "status": "TEST", "date": "20/07/2023 123123" }]*/

  // const chatMessages = [{ "message": "Hello customer, can you give me more details?", "sent": "20/06/2023 15:34", "sender": 0 },
  // { "message": "Yes, the phone has been working normally for a month, but then today it randomly stopped working. I didn't do anything, it didn't fall or anything like that", "sent": "20/06/2023 18:34", "sender": 1 },
  // { "message": "Ok, let's proceed with a substitution", "sent": "20/06/2023 18:39", "sender": 0 }]

  const getSelectedTicketAndProductDataAndCustomerDetails = async () => {
    try {
      const ticketDetails = await API.getTicketDetails(props.manager.token, id)
      setTicket({
        object: ticketDetails.object, description: ticketDetails.description, openedDate: ticketDetails.openedDate, priority: ticketDetails.priority, image: ticketDetails.image,
        status: ticketDetails.status
      })
      setAssignedExpert(ticketDetails.assignedExpert.name + " " + ticketDetails.assignedExpert.surname);
      setCustomerName(ticketDetails.customer.name);
      setCustomerSurname(ticketDetails.customer.surname);
      setProduct({ device: ticketDetails.device, ean: ticketDetails.ean, category: ticketDetails.category, brand: ticketDetails.brand });

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

      const customerDetails = await API.getCustomerData(props.manager.token, ticketDetails.customer.email);

      setCustomerAddress(customerDetails.address);
      setCustomerCity(customerDetails.city);
      setCustomerPhone(customerDetails.phone);
      setCustomerPostalCode(customerDetails.postalCode);
      setCustomerStreetNumber(customerDetails.streetNumber);
    } catch (err) {
      console.log("ERROR : " + err);
      toast("Error : couldn't retrieve data");
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
      const th = await API.getTicketHistory(props.manager.token, id)
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
                <Col className='mt-3' style={{ overflowY: 'visible', marginRight: '2px', marginLeft: '13px' }}>
                  <TicketDetailsManager ticketImage={ticket.image} ticketObject={ticket.object} ticketDescription={ticket.description} date={ticket.openedDate} priority={ticket.priority} status={ticket.status} device={product.device} token={props.manager.token}
                    EAN={product.ean} category={product.category} brand={product.brand} assignedExpert={assignedExpert} customerName={customerName} customerSurname={customerSurname} customerPhone={customerPhone} ticketId={id}
                    customerCity={customerCity} customerAddress={customerAddress} customerStreetNumber={customerStreetNumber} customerPostalCode={customerPostalCode} setDisplayTicketHistory={setDisplayTicketHistory} displayTicketHistory={displayTicketHistory}
                    fetchData={fetchData}></TicketDetailsManager>
                </Col>
                {displayTicketHistory ?
                  <>
                    <Col className='zeroPaddingAndMargin' style={{ position: 'absolute', top: '40%', left: '36%', width: '30vw', height: '35vh', overflowY: 'hidden', overflowX: 'hidden', border: '5px ridge #D0D0D0', padding: '0px', backgroundColor: '#2B2B2B' }}>
                      <TicketHistory ticketHistory={ticketHistory} setDisplayTicketHistory={setDisplayTicketHistory}></TicketHistory>
                    </Col>
                  </>
                  :
                  <>
                  </>
                }
                <Col className='mt-3 square border border-dark' style={{ backgroundColor: '#F0F0F0', overflowY: 'visible', marginRight: '13px' }}>
                  <ChatManager chatMessages={chatMessages} typeOfUser={"expert"} customerName={customerName} customerSurname={customerSurname} assignedExpert={assignedExpert} status={ticket.status}></ChatManager>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerTicket;