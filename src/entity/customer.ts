import Address from "./address";

class Customer {
  _id: string;
  _name: string;
  _address!: Address;
  _active = true;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
  }

  validate() {
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
    if (this._id.length === 0) {
      throw new Error("Id os required");
    }
  }

  changeName(name: string) {
    this._name = name;
  }

  activate() {
    if (!this._address) {
      throw new Error("Address is mandatory to create a customer");
    }
    this._active = true;
  }

  set address(address: Address) {
    this._address = address;
  }

  deactivate() {
    this._active = false;
  }
}
