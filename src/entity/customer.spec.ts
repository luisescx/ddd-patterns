import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw an error when id is empty", () => {
    expect(() => {
      const customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw an error when name is empty", () => {
    expect(() => {
      const customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change customer name", () => {
    const customer = new Customer("123", "John");

    customer.changeName("Jane");
    expect(customer.name).toBe("Jane");
  });

  it("should activate user", () => {
    const customer = new Customer("123", "John");
    customer.address = new Address(
      "Avenue John House",
      10,
      "998010",
      "California"
    );

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should not be active", () => {
    const customer = new Customer("123", "John");

    expect(customer.isActive()).toBe(false);
  });

  it("should throw an error when address is undefined when you activate a user", () => {
    expect(() => {
      const customer = new Customer("1", "John");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });
});
