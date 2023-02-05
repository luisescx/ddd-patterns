import RepositoryInterface from "../../@shared/repository/repository-interface";
import Order from "../entity/order";

export default interface OrderInterfaceRepository
  extends RepositoryInterface<Order> {}
