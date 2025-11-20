function Customer(email, name, surname, city, province, postalCode,address, streetNumber,phone, birthDate) {
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.city = city;
    this.province = province;
    this.postalCode = postalCode;
    this.address = address;
    this.streetNumber = streetNumber;
    this.phone = phone;
    this.birthDate = birthDate;
}

exports.Customer = Customer;