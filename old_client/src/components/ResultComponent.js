import {ProductTable} from "./ProductComponent";
import {CustomerTable} from "./CustomerComponent";
import {EditProfile, NewProfile} from "./CustomerFormComponent";

function ResultComponent(props) {

    if (props.showListProducts === true) {
        return (
            <ProductTable products={props.products} loadingProducts={props.loadingProducts}></ProductTable>
        );
    } else if (props.showProduct === true) {
        return (
            <ProductTable products={props.products} loadingProducts={props.loadingProducts}></ProductTable>
        );
    } else if (props.showProfile === true) {
        return (
            <CustomerTable customers={props.customers} loadingCustomer={props.loadingCustomer}></CustomerTable>
        );
    } else if (props.showNewProfileForm === true) {
        return (
            <NewProfile customers={props.customers} refreshingInsertion={props.refreshingInsertion} busy={props.busy}
                        setBusy={props.setBusy}></NewProfile>
        );
    } else if (props.showEditProfileForm === true) {
        return (
            <EditProfile customers={props.customers} refreshingInsertion2={props.refreshingInsertion2}
                         loadingCustomer={props.loadingCustomer} busy={props.busy}
                         setBusy={props.setBusy}></EditProfile>
        );
    }

}

export {ResultComponent}