class Customer {
  constructor(email, name, surname, birthDate, province, city, address, streetNumber, postalCode, phone, role, token)
  {
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
    this.role = role;
    this.token = token;
  }
}

export default Customer;
