export default class OrderItem {
  private _id: string;
  private _productId: string;
  private _name: string;
  private _price: number;
  private _quantity: number;

  constructor(
    id: string,
    name: string,
    price: number,
    quantity: number,
    productId: string
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._quantity = quantity;
    this._productId = productId;
    this.validate();
  }

  get id() {
    return this._id;
  }

  get productId() {
    return this._productId;
  }

  get name() {
    return this._name;
  }

  get price() {
    return this._price;
  }

  get quantity() {
    return this._quantity;
  }

  validate() {
    if (this._quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
  }

  orderItemTotal() {
    return this._price * this._quantity;
  }
}
