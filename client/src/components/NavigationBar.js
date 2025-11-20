import { Container, Navbar, Dropdown, Nav } from 'react-bootstrap';
import { Tools, PersonCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function NavigationBar(props) {
  const navigate = useNavigate()
  return (
    <Navbar bg="dark" variant="dark" className="d-flex align-items-center">
      <Container fluid>
        <Navbar.Brand>
          <h4 className="d-flex align-items-center">
            <Tools size={28} color="white" className="me-2" />
            Ticketify
          </h4>
        </Navbar.Brand>
        <div className="ml-auto">
          {props.loggedIn ?
            <>
              <Nav className="me-auto align-items-center" style={{ color: 'white' }}>
                {props.email}
                <Dropdown className='ms-2'>
                  <Dropdown.Toggle
                    variant="dark"
                    id="dropdown-menu"
                    className="d-flex align-items-center"
                  >
                    <PersonCircle size={32} color="white" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ minWidth: '85px', marginLeft: '-13px' }}>
                    {props.isCustomer ?
                      <>
                        <Dropdown.Item onClick={() => navigate('/customer/profile')}>
                          Profile
                        </Dropdown.Item>
                      </>
                      :
                      <></>
                    }
                    <Dropdown.Item onClick={()=> props.setLoggedIn(false)}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
            : <></>
          }
        </div>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;