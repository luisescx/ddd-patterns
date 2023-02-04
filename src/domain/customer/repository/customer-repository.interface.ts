import RepositoryInterface from "../../@shared/repository/repository-interface";
import Customer from "../../entity/customer";

export default interface CustomerInterfaceRepository
  extends RepositoryInterface<Customer> {}
