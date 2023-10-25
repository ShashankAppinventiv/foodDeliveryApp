import { Server } from '@grpc/grpc-js'
import router,{Router} from 'express'
import { adminController } from '../controller/admin.controller'
class GrpcRouter {
    private router!:Router
    constructor(){
        this.router=router()
    }
    public loadService(grpcServer:Server,userPackage:any){
        grpcServer.addService(userPackage.Provider.service,{
            GetUsers:adminController.getUsers
        })
    }
}
export const grpcRouter=new GrpcRouter()