class Product {
  constructor(saleId, ean, name, brand, category, registered, ticketOpened, warrantyEndDate, warrantyStartDate = "", price = "1200") {
    this.saleId = saleId;
    this.ean = ean;
    this.name = name;
    this.brand = brand;
    this.category = category;
    this.registered = registered;
    this.ticketOpened = ticketOpened;
    this.warrantyEndDate = warrantyEndDate;
    this.warrantyStartDate = warrantyStartDate;
    this.price = price;
  }
}

export default Product;