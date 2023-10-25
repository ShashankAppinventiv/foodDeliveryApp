import { Server, ServerCredentials, credentials, loadPackageDefinition } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import path from 'path'
import { grpcRouter } from './src/routers/grpc.router'
import { GRPC_HOST, GRPC_PORT } from './src/constant/constants'
export class GRPC{
    private userPackage:any
    private grpcServer!:Server
    constructor(){
        this.startGrpcServer()
    }
    private startGrpcServer(){
        this.loadGRPC()
        this.grpcServer=new Server();
        this.loadServiceDefinition()
        this.startServer();
    }
    private loadGRPC(){
        const protoPath=path.resolve(__dirname,`${process.cwd()}/src/proto/main.proto`)
        const packageDef=loadSync(protoPath,{
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        })
        const grpcObject=loadPackageDefinition(packageDef);
        this.userPackage=grpcObject.userData
    }
    private loadServiceDefinition(){
        grpcRouter.loadService(this.grpcServer,this.userPackage);
    }
    private startServer(){
        this.grpcServer.bindAsync(`${GRPC_HOST}:${GRPC_PORT}`,ServerCredentials.createInsecure(),this.callBack)
    }
    private callBack=(err:Error | null,port:number)=>{
        if(err){
            console.log(err)
            return
        }
        this.grpcServer.start()
            console.log(`GRPC listening on port ${port}`);
        
    }
}