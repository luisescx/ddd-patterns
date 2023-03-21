import CustomerInterfaceRepository from "../../../domain/customer/repository/customer-repository.interface";
import {
  InputFindCustomerDto,
  OutputFindCustomerDto,
} from "./find.customer.dto";

export default class FindCustomerUseCase {
  private customerRepository: CustomerInterfaceRepository;

  constructor(customerRepository: CustomerInterfaceRepository) {
    this.customerRepository = customerRepository;
  }

  async execute(input: InputFindCustomerDto): Promise<OutputFindCustomerDto> {
    const customer = await this.customerRepository.findById(input.id);

    if (customer) {
      return {
        id: customer?.id,
        name: customer?.name,
        address: {
          street: customer.address.street,
          city: customer.address.city,
          number: customer.address.number,
          zip: customer.address.zip,
        },
      };
    }

    return {} as OutputFindCustomerDto;
  }
}
