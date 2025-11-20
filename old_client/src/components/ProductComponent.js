import { Col, Spinner, Table } from "react-bootstrap";
import { MdOutlineError } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io"

function ProductTable(props) {

    return (
        props.loadingProducts[0] ?
            <>
                <Col align="center">
                    <Spinner className="h4" variant="warning" animation="border" role="status"></Spinner>
                    <div className="h3 mt-4" style={{ fontFamily: 'Lucida Console' }}> Loading...</div>
                </Col>
            </>
            :
            props.loadingProducts[1] ?
                (
                    props.loadingProducts[2] ?
                        <>
                            <div className="h3 border" style={{ fontFamily: 'Lucida Console' }}>PRODUCT DETAILS</div>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>EAN</th>
                                        <th>Name</th>
                                        <th>Brand</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Release Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.products.map((p) => <ProductRow product={p} key={p.ean}></ProductRow>)}
                                </tbody>
                            </Table>
                        </>
                        :
                        <>
                            <Col className="border" align="center">
                                <IoMdInformationCircleOutline className="h1" color="#1589FF"
                                    size={56}></IoMdInformationCircleOutline>
                                <span className="h4" style={{ fontFamily: 'Lucida Console' }}>  No product with such ID has been found!  </span>
                            </Col>
                        </>
                )
                :
                <>
                    <Col className="border" align="center">
                        <MdOutlineError className="h1" color="red" size={66}></MdOutlineError>
                        <span className="h4" style={{ fontFamily: 'Lucida Console' }}> Operation failed ! </span>
                    </Col>
                </>
    );
}

function ProductRow(props) {
    return (
        <>
            <tr>
                <ProductData product={props.product}></ProductData>
            </tr>
        </>
    );
}

function ProductData(props) {
    return (
        <>
            <td className="table-content"> {props.product.ean}</td>
            <td className="table-content">{props.product.name}</td>
            <td className="table-content">{props.product.brand}</td>
            <td className="table-content">{props.product.category}</td>
            <td className="table-content">{props.product.price}</td>
            <td className="table-content">{props.product.releaseYear}</td>

        </>
    );
}

export { ProductTable }