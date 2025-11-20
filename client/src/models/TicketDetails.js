class TicketDetails {
    constructor(id, object, description, openedDate, priority, status, assignedExpert, customer, ean, device, brand, category, messages, image) {
        this.id = id;
        this.object = object;
        this.description = description;
        this.openedDate = openedDate;
        this.priority = priority;
        this.status = status;
        this.assignedExpert = assignedExpert;
        this.customer = customer;
        this.ean = ean;
        this.device = device;
        this.brand = brand;
        this.category = category;
        this.messages = messages;
        this.image = image;
    }
}

export default TicketDetails;