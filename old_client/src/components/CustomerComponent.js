import {Col, Spinner, Table} from "react-bootstrap";
import {IoMdInformationCircleOutline} from "react-icons/io";
import {MdOutlineError} from "react-icons/md";

function CustomerTable(props) {

    return (
        props.loadingCustomer[0] ?
            <>
                <Col align="center">
                    <Spinner className="h4" variant="warning" animation="border" role="status"></Spinner>
                    <div className="h3 mt-4" style={{fontFamily: 'Lucida Console'}}> Loading...</div>
                </Col>
            </>
            :
            props.loadingCustomer[1] ?
                (
                    props.loadingCustomer[2] ?
                        <>
                        <div className="h3 border" style={{fontFamily: 'Lucida Console'}}>CUSTOMER DETAILS</div>
                            <Table>
                                <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>City</th>
                                    <th>Province</th>
                                    <th>Postal Code</th>
                                    <th>Address</th>
                                    <th>Street Number</th>
                                    <th>Phone</th>
                                    <th style={{width: '120px'}}>Birth Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {props.customers.map((c) => <CustomerRow customer={c} key={c.email}></CustomerRow>)}
                                </tbody>
                            </Table>
                        </>
                        :
                        <>
                            <Col className="border" align="center">
                                <IoMdInformationCircleOutline className="h1" color="#1589FF"
                                                              size={56}></IoMdInformationCircleOutline>
                                <span className="h4" style={{fontFamily: 'Lucida Console'}}> No customer with such email has been found! </span>
                            </Col>
                        </>
                )
                :
                <>
                    <Col className="border" align="center">
                        <MdOutlineError className="h1" color="red" size={66}></MdOutlineError>
                        <span className="h4" style={{fontFamily: 'Lucida Console'}}> Operation failed ! </span>
                    </Col>
                </>
    );
}

function CustomerRow(props) {
    return (
        <>
            <tr>
                <CustomerData customer={props.customer}></CustomerData>
            </tr>
        </>
    );
}

function CustomerData(props) {
    return (
        <>
            <td className="table-content"> {props.customer.email}</td>
            <td className="table-content">{props.customer.name}</td>
            <td className="table-content">{props.customer.surname}</td>
            <td className="table-content">{props.customer.city}</td>
            <td className="table-content">{props.customer.province}</td>
            <td className="table-content">{props.customer.postalCode}</td>
            <td className="table-content" style={{whiteSpace: 'nowrap'}}>{props.customer.address}</td>
            <td className="table-content">{props.customer.streetNumber}</td>
            <td className="table-content">{props.customer.phone}</td>
            <td className="table-content" style={{whiteSpace: 'nowrap'}}>{props.customer.birthDate}</td>

        </>
    );
}

export {CustomerTable}