import { useState, useRef, useEffect } from 'react';
import { Row, Col, Form, Table, Button } from 'react-bootstrap';
import API from '../API';

function ChatCustomer(props) {
  const [newMessage, setNewMessage] = useState('')
  const tableRef = useRef(null);
  const [closed, setClosed] = useState(false);
  const [messagesToCompare, setMessageToCompare] = useState([])
  const [firstMount, setFirstMount] = useState(0);

  useEffect(() => {

    if (firstMount < 2) {
      scrollToBottom();
      if (firstMount === 0) setFirstMount(1)
      else setFirstMount(2);
    }
    if (messagesToCompare.length === 0) {
      setMessageToCompare([...props.chatMessages])
    } else {
      if (props.chatMessages[props.chatMessages.length - 1].sent != messagesToCompare[messagesToCompare.length - 1].sent) {
        setMessageToCompare([...props.chatMessages])
        scrollToBottom();
      }
    }
    if (props.status == "CLOSED") {
      setClosed(true);
    } else setClosed(false);
  }, [props.chatMessages, props.status]);

  const onEnterPress = (event) => {
    if (event.keyCode == 13 && event.shiftKey == false) {
      sendMessage(newMessage, props.chatMessages)
      scrollToBottom();
      event.preventDefault();
    }
  }

  const handleOpenDialog = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = handleImageSelect;
    fileInput.click();
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const timestamp = new Date().getTime();
      const msg = {
        "text": null,
        "image": base64String.split(',')[1],
        "sender": props.typeOfUser,
        "timestamp": timestamp
      };
      await API.sendMessage(props.token, props.ticketId, msg);
      props.getMess()
      setNewMessage('')
    };

    reader.readAsDataURL(file);
  };



  const scrollToBottom = () => {
    tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  };

  const sendMessage = async (newMessage, chatMessages) => {
    if (newMessage != '') {
      const timestamp = new Date().getTime();
      const msg = {
        "text": newMessage,
        "image": null,
        "sender": props.typeOfUser,
        "timestamp": timestamp
      };
      await API.sendMessage(props.token, props.ticketId, msg);
      props.getMess()
      setNewMessage('')
    }
  }

  return (
    <>
      <div style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: 'white', backgroundColor: '#2B2B2B', color: 'white' }}>CHAT</div>
      <div className='border border-dark'></div>


      <Table style={{ display: 'block', height: '50vh', overflowY: 'scroll', backgroundColor: 'white', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
        <thead>
          <tr>
            <th style={{ width: "1%", border: 'none' }}></th>
            <th style={{ width: "125px", paddingTop: '5px', fontFamily: 'Lucida Console', fontSize: 16, border: 'none' }}>{props.expertName}</th>
            <th style={{ width: "auto", border: 'none' }}></th>
            <th style={{ width: "auto", border: 'none' }}></th>
            <th style={{ width: "125px", paddingTop: '5px', fontFamily: 'Lucida Console', fontSize: 16, border: 'none' }}></th>
            <th style={{ width: "1%", border: 'none' }}></th>
          </tr>
        </thead>
        <tbody ref={tableRef}>
          {props.chatMessages.map((cm) => <ChatMessagesRow message={cm} key={cm.msgKey} user={props.typeOfUser}></ChatMessagesRow>)}
        </tbody>
      </Table>



      <div className='border border-dark'></div>
      <Row >
        <Col></Col>
        <Col xs={6} style={{ marginBottom: '10px', marginTop: '10px' }}>
          {closed ?
            <></>
            :
            <>
              <Row>
                <Form >
                  <Form.Group className="mb-3" controlId="newMessageBox" >
                    <Form.Control as="textarea" rows='4' maxLength="200" value={newMessage} style={{ maxWidth: '100%', border: '1px solid black', fontSize: '0.7em' }} onKeyDown={onEnterPress}
                      onChange={e => setNewMessage(e.target.value)} />
                  </Form.Group>
                  <Button variant='dark float-end' style={{ fontSize: '0.9em' }}
                    onClick={() => sendMessage(newMessage, props.chatMessages)}>Send message &nbsp;<i className="bi bi-send-fill"></i></Button>
                </Form>
              </Row>
              <Row>
                <Col></Col>
                <Col></Col>
                <Col xs="6">
                  <Button variant='dark float-end' style={{ fontSize: '0.8em', marginTop: '2px' }}
                    onClick={handleOpenDialog}>Send image &nbsp;<i className="bi bi-image"></i></Button>
                </Col>
              </Row>
            </>
          }

        </Col>
        <Col></Col>
      </Row>


    </>
  );
}

function ChatExpert(props) {
  const [newMessage, setNewMessage] = useState('');
  const tableRef = useRef(null);
  const [closed, setClosed] = useState(false);
  const [messagesToCompare, setMessageToCompare] = useState([]);
  const [firstMount, setFirstMount] = useState(0);
  useEffect(() => {

    if (firstMount < 2) {
      scrollToBottom();
      if (firstMount === 0) setFirstMount(1)
      else setFirstMount(2);
    }
    if (messagesToCompare.length === 0) {
      setMessageToCompare([...props.chatMessages])
    } else {
      if (props.chatMessages[props.chatMessages.length - 1].sent != messagesToCompare[messagesToCompare.length - 1].sent) {
        setMessageToCompare([...props.chatMessages])
        scrollToBottom();
      }
    }

    if (props.status == "CLOSED") {
      setClosed(true);
    } else setClosed(false);
  }, [props.chatMessages, props.status]);

  const onEnterPress = (event) => {
    if (event.keyCode == 13 && event.shiftKey == false) {
      sendMessage(newMessage, props.chatMessages);
      scrollToBottom();
      event.preventDefault();
    }
  }

  const handleOpenDialog = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = handleImageSelect;
    fileInput.click();
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const timestamp = new Date().getTime();
      const msg = {
        "text": null,
        "image": base64String.split(',')[1],
        "sender": props.typeOfUser,
        "timestamp": timestamp
      };
      await API.sendMessage(props.token, props.ticketId, msg);
      props.getMess()
      setNewMessage('')
    };

    reader.readAsDataURL(file);
  };

  const scrollToBottom = () => {
    tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  };

  const sendMessage = async (newMessage, chatMessages) => {
    if (newMessage != '') {
      const timestamp = new Date().getTime();
      const msg = {
        "text": newMessage,
        "image": null,
        "sender": props.typeOfUser,
        "timestamp": timestamp
      };
      await API.sendMessage(props.token, props.ticketId, msg);
      props.getMess()
      setNewMessage('')
    }
  }

  return (
    <>
      <div style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: 'white', backgroundColor: '#2B2B2B', color: 'white' }}>CHAT</div>
      <div className='border border-dark'></div>


      <Table style={{ display: 'block', height: '60vh', overflowY: 'scroll', backgroundColor: 'white', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
        <thead>
          <tr>
            <th style={{ width: "1%", border: 'none' }}></th>
            <th style={{ width: "125px", paddingTop: '5px', fontFamily: 'Lucida Console', fontSize: 16, border: 'none' }}>{props.customerName}&nbsp;{props.customerSurname}</th>
            <th style={{ width: "auto", border: 'none' }}></th>
            <th style={{ width: "auto", border: 'none' }}></th>
            <th style={{ width: "125px", paddingTop: '5px', fontFamily: 'Lucida Console', fontSize: 16, border: 'none' }}></th>
            <th style={{ width: "1%", border: 'none' }}></th>
          </tr>
        </thead>
        <tbody ref={tableRef}>
          {props.chatMessages.map((cm) => <ChatMessagesRow message={cm} key={cm.msgKey} user={props.typeOfUser}></ChatMessagesRow>)}
        </tbody>
      </Table>



      <div className='border border-dark'></div>
      <Row >
        <Col></Col>
        <Col xs={6} style={{ marginBottom: '10px', marginTop: '10px' }}>
          {closed ?
            <></>
            :
            <>
              <Row>
                <Form >
                  <Form.Group className="mb-3" controlId="newMessageBox" >
                    <Form.Control as="textarea" rows='4' value={newMessage} style={{ maxWidth: '100%', border: '1px solid black', fontSize: '0.7em' }} onKeyDown={onEnterPress}
                      onChange={e => setNewMessage(e.target.value)} />
                  </Form.Group>
                  <Button variant='dark float-end' style={{ fontSize: '0.9em' }}
                    onClick={() => sendMessage(newMessage, props.chatMessages)}>Send message &nbsp;<i className="bi bi-send-fill"></i></Button>
                </Form>
              </Row>
              <Row>
                <Col></Col>
                <Col></Col>
                <Col xs="6">
                  <Button variant='dark float-end' style={{ fontSize: '0.8em', marginTop: '2px' }}
                    onClick={handleOpenDialog}>Send image &nbsp;<i className="bi bi-image"></i></Button>
                </Col>
              </Row>
            </>
          }

        </Col>
        <Col></Col>
      </Row>

    </>
  );
}

function ChatManager(props) {
  const tableRef = useRef(null);
  const [messagesToCompare, setMessageToCompare] = useState([])
  const [firstMount, setFirstMount] = useState(0);

  useEffect(() => {

    if (firstMount < 2) {
      scrollToBottom();
      if (firstMount === 0) setFirstMount(1)
      else setFirstMount(2);
    }
    if (messagesToCompare.length === 0) {
      setMessageToCompare([...props.chatMessages])
    } else {
      if (props.chatMessages[props.chatMessages.length - 1].sent != messagesToCompare[messagesToCompare.length - 1].sent) {
        setMessageToCompare([...props.chatMessages])
        scrollToBottom();
      }
    }
  }, [props.chatMessages]);

  const scrollToBottom = () => {
    tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  };


  return (
    <>
      <div style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: 'white', backgroundColor: '#2B2B2B', color: 'white' }}>CHAT</div>
      <div className='border border-dark'></div>


      <Table style={{ display: 'block', height: '60vh', overflowY: 'scroll', backgroundColor: 'white', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
        <thead>
          <tr>
            <th style={{ width: "1%", border: 'none' }}></th>
            <th style={{ width: "125px", paddingTop: '5px', fontFamily: 'Lucida Console', fontSize: 16, border: 'none' }}>{props.customerName}&nbsp;{props.customerSurname}</th>
            <th style={{ width: "auto", border: 'none' }}></th>
            <th style={{ width: "auto", border: 'none' }}></th>
            <th style={{ width: "125px", paddingTop: '5px', fontFamily: 'Lucida Console', fontSize: 16, border: 'none' }}>{props.assignedExpert}</th>
            <th style={{ width: "1%", border: 'none' }}></th>
          </tr>
        </thead>
        <tbody ref={tableRef}>
          {props.chatMessages.map((cm) => <ChatMessagesRow message={cm} key={cm.msgKey} user={props.typeOfUser}></ChatMessagesRow>)}
        </tbody>
      </Table>



      <div className='border border-dark'></div>

    </>
  );
}

function ChatMessagesRow(props) {
  return (
    <>
      <tr>
        <ChatMessagesData message={props.message} user={props.user}></ChatMessagesData>
      </tr>
    </>
  );
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


function ChatMessagesData(props) {

  const imageUrl = `data:image/png;base64,${props.message.image}`;
  const timestamp = props.message.sent
  const formattedTimestamp = formatTimestamp(timestamp);

  if (props.user == "customer") {
    return (
      props.message.sender ?
        <>
          <td style={{ border: 'none', width: '1%' }}> </td>
          <td style={{ border: 'none', width: '125px', maxWidth: '125px', whiteSpace: 'normal', wordBreak: 'break-word' }}> </td>
          <td style={{ border: 'none', width: 'auto' }}> </td>
          <td style={{ border: 'none', fontSize: '0.8em', width: 'auto' }}> {formattedTimestamp}</td>
          {props.message.message === null ?
            <td style={{ backgroundColor: '#CDF5D6', borderRadius: '15px', border: 'none', fontSize: '0.8em' }}>
              <img src={imageUrl} alt="Immagine" style={{ width: '200px', height: 'auto', width: '200px', }} />
            </td>
            :
            <td style={{ backgroundColor: '#CDF5D6', borderRadius: '15px', border: 'none', fontSize: '0.8em', width: '125px', maxWidth: '125px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{props.message.message}</td>
          }
          <td style={{ border: 'none', width: '1%' }}> </td>
        </>
        :
        <>
          <td style={{ border: 'none', width: '1%' }}> </td>
          {props.message.message === null ?
            <td style={{ backgroundColor: '#BEE0F7', borderRadius: '15px', border: 'none', fontSize: '0.8em' }}>
              <img src={imageUrl} alt="Immagine" style={{ width: '200px', height: 'auto', width: '200px' }} />
            </td>
            :
            <td style={{ backgroundColor: '#BEE0F7', borderRadius: '15px', border: 'none', fontSize: '0.8em', width: '125px', maxWidth: '125px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{props.message.message}</td>
          }
          <td style={{ border: 'none', fontSize: '0.8em', width: 'auto' }}> {formattedTimestamp}</td>
          <td style={{ border: 'none', width: 'auto' }}> </td>
          <td style={{ border: 'none', width: '125px', maxWidth: '125px', whiteSpace: 'normal', wordBreak: 'break-word' }}></td>
          <td style={{ border: 'none', width: '1%' }}> </td>
        </>
    );
  } else {
    return (
      !props.message.sender ?
        <>
          <td style={{ border: 'none', width: '1%' }}> </td>
          <td style={{ border: 'none', width: '125px', maxWidth: '125px', whiteSpace: 'normal', wordBreak: 'break-word' }}> </td>
          <td style={{ border: 'none', width: 'auto' }}> </td>
          <td style={{ border: 'none', fontSize: '0.8em', width: 'auto' }}> {formattedTimestamp}</td>
          {props.message.message === null ?
            <td style={{ backgroundColor: '#CDF5D6', borderRadius: '15px', border: 'none', fontSize: '0.8em' }}>
              <img src={imageUrl} alt="Immagine" style={{ width: '200px', height: 'auto', width: '200px' }} />
            </td>
            :
            <td style={{ backgroundColor: '#CDF5D6', borderRadius: '15px', border: 'none', fontSize: '0.8em', width: '125px', maxWidth: '125px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{props.message.message}</td>
          }
          <td style={{ border: 'none', width: '1%' }}> </td>
        </>
        :
        <>
          <td style={{ border: 'none', width: '1%' }}> </td>
          {props.message.message === null ?
            <td style={{ backgroundColor: '#BEE0F7', borderRadius: '15px', border: 'none', fontSize: '0.8em' }}>
              <img src={imageUrl} alt="Immagine" style={{ width: '200px', height: 'auto', width: '200px', maxWidth: '200px' }} />
            </td>
            :
            <td style={{ backgroundColor: '#BEE0F7', borderRadius: '15px', border: 'none', fontSize: '0.8em', width: '125px', maxWidth: '125px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{props.message.message}</td>
          }
          <td style={{ border: 'none', fontSize: '0.8em', width: 'auto' }}> {formattedTimestamp}</td>
          <td style={{ border: 'none', width: 'auto' }}> </td>
          <td style={{ border: 'none', width: '125px', maxWidth: '125px', whiteSpace: 'normal', wordBreak: 'break-word' }}></td>
          <td style={{ border: 'none', width: '1%' }}> </td>
        </>
    );
  }
}

export { ChatCustomer, ChatExpert, ChatManager };