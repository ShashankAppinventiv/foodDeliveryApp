import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { responseUitls } from "../utils/response.util";
import { Request,Response } from "express";
import { userEntity } from "../entity/user.entity";
class AdminController{
    constructor(){}
    getUsers=async (req:ServerUnaryCall<any,any>,res:sendUnaryData<any>)=>{
        try{
            console.log("000000000000000--------->",req.request)
            let userInfo=await userEntity.find({},{_id:1,name:1},{});
            let data=JSON.stringify(userInfo)
            console.log(data)
            res(null,{name:data});
        }catch(err){
            let error=responseUitls.errorResponse(err)
            console.log(error);
        }
    }
}
export const adminController=new AdminController();