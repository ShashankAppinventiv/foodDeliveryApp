import mongoose, { Schema } from "mongoose";
import { COLLECTION } from "../interface/enum";
import { mongo } from "../provider/mongo/mongo";
import { number } from "joi";

interface Iitems {
  foodId: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}


interface ICart {
  userId: mongoose.Schema.Types.ObjectId;
  resturantId: mongoose.Schema.Types.ObjectId;
  totalPrice:Number;
  items: Iitems[];
}

const cartSchema = new Schema<ICart>({
  userId: mongoose.Schema.Types.ObjectId,
  resturantId: mongoose.Schema.Types.ObjectId,
  totalPrice:Number,
  items: [
    {
      foodId: mongoose.Types.ObjectId,
      name: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

export const cartModel = mongo
  .getConnection()
  .model<ICart>(COLLECTION.CART, cartSchema);
