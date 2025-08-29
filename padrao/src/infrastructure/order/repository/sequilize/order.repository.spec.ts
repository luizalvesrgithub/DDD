import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
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
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
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
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
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
});
import { Sequelize } from "sequelize-typescript";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import OrderRepository from "./order.repository";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";

describe("OrderRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([OrderModel, OrderItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an order", async () => {
    const orderRepository = new OrderRepository();

    const item = new OrderItem("1", "Product 1", 100, "p1", 2);
    const order = new Order("o1", "c1", [item]);

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: "o1" },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toMatchObject({
      id: "o1",
      customer_id: "c1",
      total: 200,
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          product_id: "p1",
          quantity: 2,
        },
      ],
    });
  });

  it("should update an order", async () => {
    const orderRepository = new OrderRepository();

    const item = new OrderItem("1", "Product 1", 100, "p1", 2);
    const order = new Order("o1", "c1", [item]);

    await orderRepository.create(order);

    // Atualiza com novos itens
    const newItem = new OrderItem("2", "Product 2", 50, "p2", 3);
    const updatedOrder = new Order("o1", "c1", [newItem]);

    await orderRepository.update(updatedOrder);

    const orderModel = await OrderModel.findOne({
      where: { id: "o1" },
      include: ["items"],
    });

    expect(orderModel.total).toBe(150);
    expect(orderModel.items.length).toBe(1);
    expect(orderModel.items[0].name).toBe("Product 2");
  });

  it("should find an order by id", async () => {
    const orderRepository = new OrderRepository();

    const item = new OrderItem("1", "Product 1", 100, "p1", 2);
    const order = new Order("o1", "c1", [item]);

    await orderRepository.create(order);

    const foundOrder = await orderRepository.find("o1");

    expect(foundOrder.id).toBe("o1");
    expect(foundOrder.customerId).toBe("c1");
    expect(foundOrder.items.length).toBe(1);
    expect(foundOrder.items[0].name).toBe("Product 1");
  });

  it("should find all orders", async () => {
    const orderRepository = new OrderRepository();

    const item1 = new OrderItem("1", "Product 1", 100, "p1", 2);
    const order1 = new Order("o1", "c1", [item1]);

    const item2 = new OrderItem("2", "Product 2", 50, "p2", 4);
    const order2 = new Order("o2", "c2", [item2]);

    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders.length).toBe(2);
    expect(orders[0].id).toBe("o1");
    expect(orders[1].id).toBe("o2");
  });
});
