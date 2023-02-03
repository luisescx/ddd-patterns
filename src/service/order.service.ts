import Customer from "../entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";

export default class OrderService {
  static total(order: Order[]) {
    return order.reduce((prev, acc) => prev + acc.total(), 0);
  }

  static placeOrder(customer: Customer, items: OrderItem[]) {
    if (items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    const order = new Order("id1", customer.id, items);
    customer.addRewardPoints(order.total() / 2);
    return order;
  }
}
