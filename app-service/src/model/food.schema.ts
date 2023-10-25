import mongoose from "mongoose";
import { mongo } from "../provider/mongo/mongo";
import { COLLECTION } from "../interface/enum";

interface IFood {
  resturantId: mongoose.Schema.Types.ObjectId;
  sellerId:mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category:string
  totalRating:number,
  totalPeople:number
}
const FoodSchema = new mongoose.Schema<IFood>({
  resturantId: mongoose.Schema.Types.ObjectId,
  sellerId:mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  price: Number,
  category:String,
  totalRating:Number,
  totalPeople:Number
},{
  
});
export const foodModel = mongo
  .getConnection()
  .model<IFood>(COLLECTION.FOOD, FoodSchema);
