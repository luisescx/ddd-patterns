import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendEmailWhenCustomerIsCreated from "../../customer/event/handler/send-email-when-customer-is-created.handler";
import SendMessageWhenCustomerChangedAddressEvent from "../../customer/event/handler/send-message-when-customer-changed-address.handler";
import Customer from "../../customer/entity/customer";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";
import CustomerChangedAddressEvent from "../../customer/event/customer-changed-address.event";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify when a new customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenCustomerIsCreated();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const customer = new Customer("1", "John");

    const firstCustomerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name,
      description: "Esse é o primeiro console.log do evento: CustomerCreated",
    });
    eventDispatcher.notify(firstCustomerCreatedEvent);
    const secondCustomerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name,
      description: "Esse é o segundo console.log do evento: CustomerCreated",
    });
    eventDispatcher.notify(secondCustomerCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalledTimes(2);
  });

  it("should notify when a customer change its address", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenCustomerIsCreated();
    const eventAddressHandler =
      new SendMessageWhenCustomerChangedAddressEvent();
    const spyEventHandler = jest.spyOn(eventAddressHandler, "handle");
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register(
      "CustomerChangedAddressEvent",
      eventAddressHandler
    );

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventAddressHandler);

    const customer = new Customer("1", "John");

    const firstCustomerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name,
      description: "Esse é o primeiro console.log do evento: CustomerCreated",
    });
    eventDispatcher.notify(firstCustomerCreatedEvent);

    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    const customerChangedAddressEvent = new CustomerChangedAddressEvent({
      id: customer.id,
      name: customer.name,
      description: `Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.address}`,
    });
    eventDispatcher.notify(customerChangedAddressEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
