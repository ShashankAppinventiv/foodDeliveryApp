import { cartModel } from "../model/cart.schema";
import BaseEntity from "./base-mongo-entity";

class CartEntity extends BaseEntity{
    constructor(){
        super(cartModel)
    }
}
export const cartEntity = new CartEntity();