import {Product} from "./objects/Product";
import {Customer} from "./objects/Customer";
import dayjs from "dayjs";

const getAllProducts = async () => {
    let resultArray = [];
    const response = await fetch(`/API/products`);
    const productsJSON = await response.json();
    if (response.ok) {
        if (productsJSON.length > 1) {
            return productsJSON.map(r => new Product(r.ean, r.name, r.brand, r.category, r.price, r.releaseYear));
        } else if(productsJSON.length === 1) {
            let product = new Product(productsJSON[0].ean, productsJSON[0].name, productsJSON[0].brand, productsJSON[0].category, productsJSON[0].price, productsJSON[0].releaseYear);
            resultArray.push(product);
            return resultArray;
        } else {
            /* NO PRODUCTS IN DATABASE */
            return []
        }
    } else
        return undefined;
};

const getProductByID = async (productID) => {
    let resultArray = [];
    const response = await fetch(`/API/products/${productID}`);
    const productJSON = await response.json();
    if (response.ok) {
        let product = new Product(productJSON.ean, productJSON.name, productJSON.brand, productJSON.category, productJSON.price, productJSON.releaseYear);
        resultArray.push(product)
        return resultArray;
    } else {
        if (response.status === 404) {
            return resultArray;
        } else
            return undefined;
    }
};

const getCustomerByEmail = async (email) => {
    let resultArray = [];
    const response = await fetch(`/API/profiles/${email}`);
    const profileJSON = await response.json();
    const date = dayjs(profileJSON.birthDate).format('DD-MM-YYYY');
    if (response.ok) {
        let customer = new Customer(profileJSON.email, profileJSON.name, profileJSON.surname, profileJSON.city, profileJSON.province,
            profileJSON.postalCode, profileJSON.address, profileJSON.streetNumber, profileJSON.phone, date);
        resultArray.push(customer)
        return resultArray;
    } else {
        if (response.status === 404) {
            return resultArray;
        } else
            return undefined;
    }
};

const addNewCustomer = async (customer) => {
    const response = await fetch(`/API/profiles`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(customer)
    });
    if (!response.ok) {
        if (response.status === 409) {
            return []
        } else
            return undefined;
    } else {
        return 1;
    }
}

const updateCustomerProfile = async (email, customer) => {
    let request = {	name:  customer.name,
        surname:  customer.surname,
        city: customer.city,
        province: customer.province,
        postalCode: customer.postalCode,
        address: customer.address,
        streetNumber: customer.streetNumber,
        phone:  customer.phone,
        birthDate:  customer.birthDate}
    const response = await fetch(`/API/profiles/${email}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(request),
    });
    if (response.ok) {
        return 1;
    } else {
        if(response.status === 404){
            return undefined
        } else
            return undefined;
    }
}

const API = {
    getAllProducts,
    getCustomerByEmail,
    getProductByID,
    addNewCustomer,
    updateCustomerProfile
}
export default API