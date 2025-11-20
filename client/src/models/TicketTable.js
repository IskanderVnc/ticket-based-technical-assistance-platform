class TicketTable {
  constructor(id, saleId, ean, device, brand, status, openedDate, lastUpdate) {
    this.id = id;
    this.saleId = saleId;
    this.ean = ean;
    this.device = device;
    this.brand = brand;
    this.status = status;
    this.openedDate = openedDate;
    this.lastUpdate = lastUpdate;
  }
}

export default TicketTable;