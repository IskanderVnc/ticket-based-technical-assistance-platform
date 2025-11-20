import { useState } from 'react';
import { Row, Col, Form, Table, Button } from 'react-bootstrap';

function TicketHistory(props) {

    return (

        <>
            <Button className='float-end' variant="danger" size="sm" onClick={() => { props.setDisplayTicketHistory(false) }}>x</Button>
            <div style={{ fontSize: 18, fontWeight: 'bold', backgroundColor: '#2B2B2B', color: 'white', margin: '0px' }}>HISTORY</div>
            <div className='border border-dark'></div>

            <Table style={{ display: 'block', height: '30vh', overflowY: 'scroll', backgroundColor: 'white', border: '1px solid black', marginBottom: '0px', margin: '0px' }}>
                <thead>
                    <tr>
                        <th style={{ width: "10%", paddingTop: '0px', fontFamily: 'Lucida Console', fontSize: 17 }}>Status</th>
                        <th style={{ width: "10%", paddingTop: '0px', fontFamily: 'Lucida Console', fontSize: 17 }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {props.ticketHistory.map((th) => <TicketHistoryRow status={th.status} date={th.date} key={th.date}></TicketHistoryRow>)}
                </tbody>
            </Table>


            <div className='border border-dark' style={{ backgroundColor: 'white' }}></div>

        </>
    );
}

function TicketHistoryRow(props) {
    return (
        <>
            <tr style={{ border: '1px solid black' }}>
                <TicketHistoryData status={props.status} date={props.date} ></TicketHistoryData>
            </tr>
        </>
    );
}

function TicketHistoryData(props) {

    return (
        <>
            <td style={{ border: 'none', fontSize: '0.8em', color: 'black' }}> {props.status}</td>
            <td style={{ border: 'none', fontSize: '0.8em', color: 'black' }}> {props.date}</td>
        </>
    );
}

export default TicketHistory;