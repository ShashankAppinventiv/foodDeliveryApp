import { orderModel } from "../model/order.schema";
import BaseEntity from "./base-mongo-entity";

class OrderEntity extends BaseEntity{
    constructor() {
        super(orderModel)
    }
}
export const orderEntity= new OrderEntity();