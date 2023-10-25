import { string } from "joi";
import mongoose, { Collection, model } from "mongoose";
import { mongo } from "../provider/mongo/mongo";
import { COLLECTION } from "../interface/enum";

interface IRestaurant {
    OwnerId:mongoose.Schema.Types.ObjectId,
    name:string,
    description:string,
    location:{
        type:{
            type:string,
        },
        coordinates:{
            type:[number],
        }
    },
}
const restaurantSchema = new mongoose.Schema<IRestaurant>({
    OwnerId:mongoose.Schema.Types.ObjectId,
    name:String,
    description:String,
    location:{
        type:{
            type:String
        },
        coordinates:{
            type:[Number]
        }
    },
})
export const resturantModel = mongo.getConnection().model<IRestaurant>(COLLECTION.RESTAURANT,restaurantSchema);