import Expert from './models/Expert'
import Manager from './models/Manager';
import Customer from './models/Customer';
import Product from './models/Product';
import TicketTable from './models/TicketTable';
import ExpertAssignTicket from './models/ExpertAssignTicket';
import ProductOnlyInfo from './models/ProductOnlyInfo';
import jwt from 'jwt-decode';
import Ticket from './models/Ticket';
import TicketDetails from './models/TicketDetails';
//const SERVER_URL = 'http://localhost:8081/api';

const login = async (credentials) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    })
    if (response.ok) {
        const jwtToken = await response.json();
        return jwtToken.access_token;
    } else {
        throw credentials.username;
    }
}

const signup = async (user) => {
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
    if (response.ok) {
        const signupResponse = await response.json();
        return signupResponse;
    } else {
        throw user.email;
    }
}

const editProfile = async (token, user) => {
    fetch(`/api/profiles/${user.email}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.text();
    }).catch(error => {
        console.log('Error:', error);
    });
}

const getUser = async (token) => {
    const decodedToken = jwt(token);
    const email = decodedToken.email;
    const role = decodedToken.resource_access["springboot-keycloak-client"].roles[0];

    if (role === "client") {
        const response = await fetch(`/api/profiles/${email}`, {
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const user = await response.json();

        if (response.ok) {
            return new Customer(user.email, user.name, user.surname, user.birthDate, user.province, user.city, user.address, user.streetNumber, user.postalCode, user.phone, "client", token);
        } else {
            throw user;
        }
    } else if (role === "expert") {
        const response = await fetch(`/api/experts?email=${email}`, {
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        const users = await response.json();
        const user = users[0];
        if (response.ok) {
            return new Expert(user.id, user.email, user.name, user.surname, user.domains, "expert", token);
        } else {
            throw user;
        }
    } else if (role === "manager") {
        return new Manager("manager", token, email);
    }
}

const getCustomerData = async (token, customerEmail) => {
    const response = await fetch(`/api/profiles/${customerEmail}`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const user = await response.json();
    if (response.ok) {
        return new Customer(user.email, user.name, user.surname, user.birthDate, user.province, user.city, user.address, user.streetNumber, user.postalCode, user.phone, "client", token);
    } else {
        throw user;
    }

}
const createExpert = async (token, expert) => {
    const response = await fetch('/api/createExpert', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        // TODO: definire il JSON dell'expert corretamente
        body: JSON.stringify(expert),
    })
    if (!response.ok) {
        const errDetails = await response.text();
        throw errDetails;
    }
}


const updateSaleRegistered = async (token, customerId, saleId) => {
    fetch(`/api/sales/${customerId}/${saleId}/registered`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.text();
    }).catch(error => {
        console.log('Error:', error);
    });
}

const getRegisteredProducts = async (token, customerId) => {
    const response = await fetch(`/api/sales/${customerId}/registered`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const products = await response.json();

    if (response.ok) {
        let ris = products.map((p) => new Product(p.id, p.product.ean, p.product.name, p.product.brand, p.product.category, p.registered, p.ticketOpened, p.warrantyEndDate, null, p.product.price));
        return ris;
        // return products.map((p) => new Product(p.id, p.product.ean, p.product.name, p.product.brand, p.product.category, p.registered));
        // return new products.filter((p) => p.registered == true);
    } else {
        throw products;
    }
}

const getUnregisteredProducts = async (token, customerId) => {
    const response = await fetch(`/api/sales?customerId=${customerId}`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const products = await response.json();

    if (response.ok) {
        let ris = products.filter((p) => p.registered === false).map((p) => new Product(p.id, p.product.ean, p.product.name, p.product.brand, p.product.category, p.registered, p.ticketOpened, p.warrantyEndDate, p.warrantyStartDate, p.product.price));
        return ris;
        // return products.map((p) => new Product(p.id, p.product.ean, p.product.name, p.product.brand, p.product.category, p.registered));
        // return new products.filter((p) => p.registered == true);
    } else {
        throw products;
    }
}

const addNewTicket = async (token, newTicket) => {
    fetch('/api/tickets', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTicket)
    }).then(response => {
        return response.text();
    }).catch(error => {
        console.log('Error:', error);
        throw error;
    });
}

const getExperts = async (token) => {
    const response = await fetch(`/api/experts`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const experts = await response.json();

    if (response.ok) {
        let ris = experts.map((p) => new ExpertAssignTicket(p.id, p.name, p.surname, p.email, p.domains));
        return ris;
        // return products.map((p) => new Product(p.id, p.product.ean, p.product.name, p.product.brand, p.product.category, p.registered));
        // return new products.filter((p) => p.registered == true);
    } else {
        throw experts;
    }
}

const getProduct = async (token, ean) => {
    const response = await fetch(`/api/products/${ean}`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const product = await response.json();

    if (response.ok) {
        let ris = new ProductOnlyInfo(product.ean, product.name, product.brand, product.category, product.price, product.releaseYear);
        return ris;
        // return products.map((p) => new Product(p.id, p.product.ean, p.product.name, p.product.brand, p.product.category, p.registered));
        // return new products.filter((p) => p.registered == true);
    } else {
        throw product;
    }
}

const getTicket = async (token, id) => {
    const response = await fetch(`/api/tickets/${id}`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const ticket = await response.json();

    if (response.ok) {
        let ris = new Ticket(ticket.id, ticket.ticketObject, ticket.description, ticket.sale.product.ean, ticket.image);
        return ris;
        // return products.map((p) => new Product(p.id, p.product.ean, p.product.name, p.product.brand, p.product.category, p.registered));
        // return new products.filter((p) => p.registered == true);
    } else {
        throw ticket;
    }
}

const getTicketDetails = async (token, id) => {
    const response = await fetch(`/api/tickets/${id}`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });

    const ticket = await response.json();
    if (response.ok) {
        let ris = new TicketDetails(ticket.id, ticket.ticketObject, ticket.description, ticket.openedDate, ticket.priorityLevel, ticket.status, ticket.expert, ticket.customer,
            ticket.sale.product.ean, ticket.sale.product.name, ticket.sale.product.brand, ticket.sale.product.category, ticket.messages, ticket.image);
        return ris;
    } else {
        throw ticket;
    }
}

const getTicketHistory = async (token, ticketId) => {
    const response = await fetch(`/api/tickets/${ticketId}/history`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const ticketHistory = await response.json();
    if (response.ok) {
        return ticketHistory;
    } else {
        throw ticketHistory;
    }
}

const closeTicket = async (token, ticketId, newStatus) => {
    return new Promise((resolve, reject) => {
        fetch(`/api/tickets/${ticketId}/close`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStatus)
        })
            .then(response => {
                resolve(response.status); // Resolve the promise with the status
            })
            .catch(error => {
                reject(error); // Reject the promise with the error
            });
    });
}

const updateTicketStatusToOpenManager = async (token, ticketId, newStatus) => {
    return new Promise((resolve, reject) => {
        fetch(`/api/tickets/${ticketId}/status`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStatus)
        })
            .then(response => {
                resolve(response.status); // Resolve the promise with the status
            })
            .catch(error => {
                reject(error); // Reject the promise with the error
            });
    });
}

const updateTicketStatusExpert = async (token, ticketId, newStatus) => {
    return new Promise((resolve, reject) => {
        fetch(`/api/tickets/${ticketId}/status`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStatus)
        })
            .then(response => {
                resolve(response.status); // Resolve the promise with the status
            })
            .catch(error => {
                reject(error); // Reject the promise with the error
            });
    });
}

const assignExpert = async (token, ticketId, assignExpert) => {
    fetch(`/api/tickets/${ticketId}/assign`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignExpert)
    }).then(response => {
        return response.text();
    }).catch(error => {
        console.log('Error:', error);
    });
}

const sendMessage = async (token, ticketId, message) => {
    fetch(`/api/tickets/${ticketId}/send`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    }).then(response => {
        return response.text();
    }).catch(error => {
        console.log('Error:', error);
    });
}

const getCustomerTickets = async (token, customerId) => {
    const response = await fetch(`/api/customers/${customerId}/tickets`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const ticketsByCustomer = await response.json();

    if (response.ok) {
        return ticketsByCustomer.tickets.map((t) => new TicketTable(t.id, t.sale.id, t.sale.product.ean, t.sale.product.name, t.sale.product.brand, t.status, t.openedDate, t.lastUpdate))
    } else {
        throw ticketsByCustomer;
    }
}

const getExpertTickets = async (token, expertId) => {
    const response = await fetch(`/api/experts/${expertId}/tickets`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const ticketsByExpert = await response.json();

    if (response.ok) {
        return ticketsByExpert.tickets.map((t) => new TicketTable(t.id, t.sale.id, t.sale.product.ean, t.sale.product.name, t.sale.product.brand, t.status, t.openedDate, t.lastUpdate))
    } else {
        throw ticketsByExpert;
    }
}

const getAssignedTickets = async (token) => {
    const response = await fetch(`/api/tickets`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const assignedTickets = await response.json();

    if (response.ok) {
        return assignedTickets.filter((t) => t.expert !== null).map((t) => new TicketTable(t.id, t.sale.id, t.sale.product.ean, t.sale.product.name, t.sale.product.brand, t.status, t.openedDate, t.lastUpdate));
    } else {
        throw assignedTickets;
    }
}

const getUnassignedTickets = async (token) => {
    const response = await fetch(`/api/tickets`, {
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const unassignedTickets = await response.json();

    if (response.ok) {
        return unassignedTickets.filter((t) => t.expert === null && t.status !== "CLOSED").map((t) => new TicketTable(t.id, t.sale.id, t.sale.product.ean, t.sale.product.name, t.sale.product.brand, t.status, t.openedDate, t.lastUpdate));
    } else {
        throw unassignedTickets;
    }
}

const getResetPasswordEmail = async (email) => {
    const response = await fetch(`/api/reset-password-email/${email}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw response;
    } else {
        return response;
    }
}

const putResetPasswordEmail = async (email, token) => {
    const body = { token: token };
    const response = await fetch(`/api/reset-password/${email}/token`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw response;
    } else {
        return response;
    }
}

const putChangePassword = async (email, newPassword) => {
    const body = { password: newPassword };
    const response = await fetch(`/api/reset-password/${email}/new-password`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw response;
    } else {
        return response;
    }
}
const API = { login, getUser, getCustomerData, sendMessage, editProfile, createExpert, getRegisteredProducts, updateSaleRegistered, addNewTicket, signup, getExperts, assignExpert, getProduct, getTicket, getTicketDetails, getTicketHistory, closeTicket, updateTicketStatusExpert, updateTicketStatusToOpenManager, getRegisteredProducts, getCustomerTickets, getExpertTickets, getAssignedTickets, getUnassignedTickets, getResetPasswordEmail, putResetPasswordEmail, putChangePassword, getUnregisteredProducts };
export default API;