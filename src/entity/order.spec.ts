import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw an error when id is empty", () => {
    expect(() => {
      const orderItem = new OrderItem("od1", "name1", 100, 1, "p1");
      const order = new Order("", "c1", [orderItem]);
    }).toThrowError("Id is required");
  });

  it("should throw an error when customer id is empty", () => {
    expect(() => {
      const orderItem = new OrderItem("od1", "name1", 100, 1, "p1");
      const order = new Order("o1", "", [orderItem]);
    }).toThrowError("customerId is required");
  });

  it("should throw an error when items list is empty", () => {
    expect(() => {
      const order = new Order("o1", "c1", []);
    }).toThrowError("At least one item is required");
  });

  it("should calculate products", () => {
    const orderItem = new OrderItem("od1", "name1", 100, 1, "p1");
    const orderItem2 = new OrderItem("od2", "name2", 200, 2, "p1");

    const order = new Order("o1", "c1", [orderItem, orderItem2]);
    const total = order.total();

    expect(total).toBe(500);
  });

  it("should throw an error if quantity is less or equal than zero", () => {
    expect(() => {
      const orderItem = new OrderItem("od1", "name1", 100, 0, "p1");
      const order = new Order("o1", "c1", [orderItem]);
    }).toThrowError("Quantity must be greater than zero");
  });
});
