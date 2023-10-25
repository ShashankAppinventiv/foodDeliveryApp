import mongoose from "mongoose";
import { mongo } from "../provider/mongo/mongo";
import { COLLECTION } from "../interface/enum";
interface ICategory {
    name:String;
    parentId:mongoose.Schema.Types.ObjectId,
}
const categorySchema = new mongoose.Schema<ICategory>({
    name:String,
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    }
})
export const categoryModel = mongo.getConnection().model<ICategory>(COLLECTION.CATEGORY,categorySchema)