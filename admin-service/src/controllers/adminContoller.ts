import { Request,Response, json } from "express";
import { providerService } from "../provider/grpc/grpc.service";
import { responseUitls } from "../utils/response.util";
class AdminController {
 getUsers= async (req:Request,res:Response)=>{
    try{
        let data=await providerService.getData({name:"admin"});
        let userInfo=JSON.parse(data.name);
        res.send(userInfo)
    }catch(err){    
        res.send(err)
    }
 }
}
export const adminController =new AdminController();