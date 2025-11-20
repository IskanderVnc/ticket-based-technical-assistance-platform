import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Navbar, Container, Row, Col} from 'react-bootstrap';
import {ActionsComponent} from "./components/ActionComponent";
import {useState} from "react";
import {ResultComponent} from "./components/ResultComponent";

function App() {
    const [products, setProducts] = useState([])
    const [customers, setCustomers] = useState([])
    const [showListProducts, setShowListProducts] = useState(false);
    const [showProduct, setShowProduct] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showNewProfileForm, setShowNewProfileForm] = useState(false);
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const [refreshingInsertion, setRefreshingInsertion] = useState(0);
    const [refreshingInsertion2, setRefreshingInsertion2] = useState(0);
    const [loadingProducts, setLoadingProducts] = useState([false, false, false]); // [loading,success/fail,found/notFound]
    const [loadingCustomer, setLoadingCustomer] = useState([false, false, false]); // [loading,success/fail,found/notFound]
    const [busy, setBusy] = useState(false);

    return (
        <div className="App">
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand>LAB 2</Navbar.Brand>
                </Container>
            </Navbar>
            <Row>
                <Col className='col-md-1'></Col>
                <ActionsComponent
                    setShowListProducts={setShowListProducts}
                    setShowProduct={setShowProduct}
                    setShowProfile={setShowProfile}
                    setShowNewProfileForm={setShowNewProfileForm}
                    setShowEditProfileForm={setShowEditProfileForm}
                    setProducts={setProducts}
                    setCustomers={setCustomers}
                    refreshingInsertion={refreshingInsertion}
                    setRefreshingInsertion={setRefreshingInsertion}
                    refreshingInsertion2={refreshingInsertion2}
                    setRefreshingInsertion2={setRefreshingInsertion2}
                    setLoadingProducts={setLoadingProducts}
                    setLoadingCustomer={setLoadingCustomer}
                    busy={busy}
                    setBusy={setBusy}
                ></ActionsComponent>
                <Col className='col-md-5 mt-4 ms-4'>
                    <ResultComponent
                        showListProducts={showListProducts}
                        showProduct={showProduct}
                        showProfile={showProfile}
                        showNewProfileForm={showNewProfileForm}
                        showEditProfileForm={showEditProfileForm}
                        products={products}
                        customers={customers}
                        refreshingInsertion={refreshingInsertion}
                        refreshingInsertion2={refreshingInsertion2}
                        loadingProducts={loadingProducts}
                        loadingCustomer={loadingCustomer}
                        busy={busy}
                        setBusy={setBusy}
                    ></ResultComponent>
                </Col>
                <Col className='col-md-1'></Col>
            </Row>
        </div>
    );
}

export default App;
