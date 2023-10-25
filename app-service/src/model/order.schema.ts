import mongoose, { Schema} from "mongoose";
import { COLLECTION, orderState } from "../interface/enum";
import {mongo} from '../provider/mongo/mongo'
interface Ifood {
  name: string;
  quantity: number;
  price: number;
}

interface IorderDetail {
  resturantId: mongoose.Schema.Types.ObjectId;
  state: orderState;
  food: Ifood[];
  totalPrice: number;
}

interface IOrder {
  userId: mongoose.Types.ObjectId;
  product: IorderDetail[];
}
const orderSchema = new Schema<IOrder>({
  userId: mongoose.Types.ObjectId,
  product: [
      {
        state: { type: String, enum: orderState },
      resturantId: mongoose.Schema.Types.ObjectId,
      food: [
        {
          name: String,
          price: Number,
          quantity: Number,
        },
      ],
      totalPrice: Number,
    },
  ],
},{
    timestamps:true,
    versionKey:false
});
export const orderModel= mongo.getConnection().model<IOrder>(COLLECTION.ORDER,orderSchema)
