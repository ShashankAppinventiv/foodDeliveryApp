import { foodModel } from "../model/food.schema";
import BaseEntity from "./base-mongo-entity";

class FoodEntity extends BaseEntity {
  constructor() {
    super(foodModel);
  }
}
export const foodEntity = new FoodEntity();
