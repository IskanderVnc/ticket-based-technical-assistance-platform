class Profile {
    constructor(email, password, userName, name, surname, city, province, postalCode, address, streetNumber, phone, birthDate, role = "client")
    {
      this.email = email;
      this.password = password;
      this.userName = userName;
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
    }
  }
  
  export default Profile;