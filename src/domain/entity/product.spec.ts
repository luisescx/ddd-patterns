import Product from "./product";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const product = new Product("", "Product1", 100);
    }).toThrowError("Id is required");
  });

  it("should throw an error when name is empty", () => {
    expect(() => {
      const product = new Product("id1", "", 100);
    }).toThrowError("Name is required");
  });

  it("should throw an error when price is less than zero", () => {
    expect(() => {
      const product = new Product("id1", "Product1", -1);
    }).toThrowError("Price must be greater than zero");
  });

  it("should change product name", () => {
    const product = new Product("id1", "Product1", 100);
    product.changeName("Product2");
    expect(product.name).toBe("Product2");
  });

  it("should change product price", () => {
    const product = new Product("id1", "Product1", 100);
    product.changePrice(200);
    expect(product.price).toBe(200);
  });
});
