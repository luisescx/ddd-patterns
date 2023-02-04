import Product from "../../domain/entity/product";
import ProductInterfaceRepository from "../../domain/repository/product-repository.interface";
import ProductModel from "../db/sequelize/model/product.model";

export default class ProductRepository implements ProductInterfaceRepository {
  async create(product: Product) {
    await ProductModel.create({
      id: product.id,
      name: product.name,
      price: product.price,
    });
  }

  async update(product: Product) {
    await ProductModel.update(
      { name: product.name, price: product.price },
      { where: { id: product.id } }
    );
  }

  async findById(productId: string) {
    const productModel = await ProductModel.findOne({
      where: { id: productId },
    });

    if (productModel?.id) {
      return new Product(
        productModel?.id,
        productModel?.name,
        productModel?.price
      );
    }

    return null;
  }

  async findAll() {
    const productModels = await ProductModel.findAll();
    return productModels.map(
      (value) => new Product(value.id, value.name, value.price)
    );
  }
}
