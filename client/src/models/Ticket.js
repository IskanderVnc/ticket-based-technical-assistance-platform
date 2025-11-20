class Ticket {
  constructor(id, ticketObject, description, productEan, image) {
    this.id = id;
    this.ticketObject = ticketObject;
    this.description = description;
    this.productEan = productEan;
    this.image = image;
  }
}

export default Ticket;