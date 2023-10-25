import mongoose, { Schema} from "mongoose"
import { mongo} from "../provider/mongo/mongo"
import { COLLECTION, USER_TYPE } from "../interface/enum"
interface IAddress {
    city:string,
    street:string,
    description:string
    location:{
        type:{
            type:string,
        },
        coordinates:{
            type:[number],
        }
    },
}
interface IUser {
    name:string,
    profile:string,
    username:string,
    password:string,
    email:string,
    mobile:number,
    type:USER_TYPE,
    address:IAddress[]
}
const AddressSchema = new Schema<IAddress>(
{
    city:String,
    street:String,
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
const userSchema = new Schema<IUser>({
    name:String,
    username:String,
    profile:String,
    password:String,
    email:String,
    mobile:Number,
    type:{type:String,enum:USER_TYPE},
    address:[AddressSchema]
})
export const userModel = mongo.getConnection().model<IUser>(COLLECTION.USER,userSchema)