class NewTicket {
    constructor(object, description, customerEmail, saleId, image) {
        this.ticketObject = object;
        this.description = description;
        this.customerId = customerEmail;
        this.saleId = parseInt(saleId);
        this.image = image;
    }
}

export default NewTicket;

