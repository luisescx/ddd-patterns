import { Sequelize } from "sequelize-typescript";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import Order from "../../../../domain/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/customer.model";
import CustomerRepository from "../../../customer/repository/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      2,
      product.id
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel?.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      2,
      product.id
    );

    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.findById(order.id);

    expect(orderResult).toStrictEqual(order);
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      2,
      product.id
    );

    let order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    const product2 = new Product("456", "Product 2", 10);
    await productRepository.create(product2);
    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      1,
      product2.id
    );
    order = new Order("123", "123", [orderItem, orderItem2]);
    await orderRepository.update(order);
    const orderResult = await orderRepository.findById(order.id);

    expect(orderResult).toStrictEqual(order);
  });

  it("should throw an error when customer is not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      const orderResult = await orderRepository.findById("KEKEKKEKKE");
    }).rejects.toThrow("Order not found");
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      2,
      product.id
    );

    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(1);
    expect(orders).toContainEqual(order);
  });
});
