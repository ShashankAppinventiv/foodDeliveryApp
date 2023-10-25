import { Schema } from "mongoose";
import {mongo} from '../provider/mongo/mongo'
import { COLLECTION } from "../interface/enum";
interface IAdmin {
    username:string,
    password:string,
    email:string,
}
const adminSchema = new Schema<IAdmin>({
    username:String,
    password:String,
    email:String
})

export const adminModel=mongo.getConnection().model<IAdmin>(COLLECTION.ADMIN,adminSchema);