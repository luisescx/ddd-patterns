import OrderInterfaceRepository from "../../../../domain/checkout/repository/order-repository.interface";
import Order from "../../../../domain/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderInterfaceRepository {
  async create(entity: Order) {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order) {
    const sequelize = OrderModel.sequelize;
    await sequelize?.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction: t,
      });
      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));
      await OrderItemModel.bulkCreate(items, { transaction: t }).catch((e) =>
        console.log("error", e)
      );
      await OrderModel.update(
        { total: entity.total() },
        { where: { id: entity.id }, transaction: t }
      );
    });
  }

  async findById(orderId: string) {
    let orderModel: OrderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id: orderId,
        },
        include: ["items"],
        rejectOnEmpty: true,
      });
    } catch {
      throw new Error("Order not found");
    }

    const orderItems = orderModel.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.quantity,
        item.product_id
      );
    });

    const order = new Order(orderId, orderModel.customer_id, [...orderItems]);

    return order;
  }

  async findAll() {
    const orderModels = await OrderModel.findAll({
      include: ["items"],
    });

    const orders = orderModels.map((orderModel) => {
      let orderItems = orderModel.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.quantity,
          item.product_id
        );
      });

      return new Order(orderModel.id, orderModel.customer_id, [...orderItems]);
    });
    return orders;
  }
}
