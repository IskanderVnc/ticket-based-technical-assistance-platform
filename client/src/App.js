import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useRouteMatch,
  useNavigate,
  useParams
} from "react-router-dom";
import NavigationBar from './components/NavigationBar';
import CustomerNewTicket from './customer/CustomerNewTicket';
import AssignTicket from './manager/AssignTicket';
import Home from './components/Home';
import CustomerProducts from './customer/CustomerProducts';
import CustomerTickets from './customer/CustomerTickets';
import CustomerTicket from './customer/CustomerTicket';
import ExpertTickets from './expert/ExpertTickets';
import ExpertTicket from './expert/ExpertTicket';
import ManagerHome from './manager/ManagerHome';
import ManagerTicket from './manager/ManagerTicket';
import API from './API';
import { useEffect, useState } from 'react';
import CustomerProfile from './customer/CustomerProfile';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({});
  const [isCustomer, setIsCustomer] = useState(false);
  const [productSel, setProductSel] = useState('');

  const handleLogin = async (credentials) => {
    try {
      const token = await API.login(credentials);
      const loggedInUser = await API.getUser(token);
      setUser(loggedInUser);
      setEmail(loggedInUser.email);
      if (loggedInUser.role === "client") setIsCustomer(true);
      setLoggedIn(true);
    } catch (err) {
      toast("Wrong username or password.");
    }
  }

  const handleSignup = async (user) => {
    try {
      await API.signup(user);
      const credentials = { username: user.email, password: user.password }
      await handleLogin(credentials)
    } catch (err) {
      toast("Error: this email already exists.");
    }
  }
  
  useEffect(() => {
    if(loggedIn === false){
      setIsCustomer(false)
    }
  }, [loggedIn]);

  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/" element={
            loggedIn ?
              user.role === "client" ? <Navigate replace to="/customer" />
                : user.role === "expert" ? <Navigate replace to="/expert/tickets" />
                  : <Navigate replace to="/manager" />
              : < Home email={email} loggedIn={loggedIn} signup={handleSignup} login={handleLogin} />
          } />

          {/* <Route exact path="/" element={<Home login={handleLogin} />} /> */}

          <Route exact path="/customer" element={loggedIn ? <CustomerProducts customer={user} setLoggedIn={setLoggedIn} setProductSel={setProductSel} loggedIn={loggedIn} isCustomer={isCustomer} /> : <Navigate replace to="/" />} />
          {/* <Route path="/customer/tickets" element={loggedIn ? <CustomerTickets email={email} customer={user} setLoggedIn={setLoggedIn} loggedIn={loggedIn} isCustomer={isCustomer}/> : <Navigate replace to="/" />} /> */}
          <Route path="/customer/tickets/:id" element={loggedIn ? <CustomerTicket email={email} customer={user} setLoggedIn={setLoggedIn} loggedIn={loggedIn} isCustomer={isCustomer} /> : <Navigate replace to="/" />} />
          <Route path="/customer/open-ticket/:saleId" element={loggedIn ? <CustomerNewTicket customer={user} setLoggedIn={setLoggedIn} email={email} productSel={productSel} loggedIn={loggedIn} isCustomer={isCustomer} /> : <Navigate replace to="/" />} />
          <Route path="/customer/profile" element={loggedIn ? <CustomerProfile email={email} customer={user} setUser={setUser} setLoggedIn={setLoggedIn} loggedIn={loggedIn} isCustomer={isCustomer} user={user} /> : <Navigate replace to="/" />} />

          <Route path="/expert/tickets" element={loggedIn ? <ExpertTickets email={email} expert={user} setLoggedIn={setLoggedIn} loggedIn={loggedIn} isCustomer={isCustomer} /> : <Navigate replace to="/" />} />
          <Route path="/expert/tickets/:id" element={loggedIn ? <ExpertTicket email={email} expert={user} setLoggedIn={setLoggedIn} loggedIn={loggedIn} isCustomer={isCustomer} /> : <Navigate replace to="/" />} />

          <Route exact path="/manager" element={loggedIn ? <ManagerHome email={email} manager={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn} isCustomer={isCustomer} /> : <Navigate replace to="/" />} />
          <Route path="/manager/tickets/:id" element={loggedIn ? <ManagerTicket email={email} manager={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn} isCustomer={isCustomer} /> : <Navigate replace to="/" />} />
          <Route path="/manager/assign-ticket/:id" element={loggedIn ? <AssignTicket email={email} manager={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn} isCustomer={isCustomer} /> : <Navigate replace to="/" />} />

          {/* <Route path='*' element={<DefaultRoute />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
