import { credentials } from "@grpc/grpc-js";
import { GRPC_HOST, GRPC_PORT, GRPC_PROTO } from "../../constant/constants";
import { GRPC } from "./grpc";
import { firstValueFrom } from "rxjs";

class ProviderService extends GRPC {
    private service!:string;
    constructor()
    {
        super(GRPC_PROTO.PROTO_FILE.MAIN_PROTO,GRPC_PROTO.PACKAGE.MAIN_PACKAGE)
        this.loadService();
    }
    private loadService(){

        this.service=new this.package.Provider(`${GRPC_HOST}:${GRPC_PORT}`,credentials.createInsecure())
    }
    public async getData(payload:any){
        try{
            console.log(payload)
            const res:any=await firstValueFrom(
                this.invokeService(this.service,'GetUsers',payload)
            )
            return res;
        }catch(err){
            throw err;
        }
    }
}
export const providerService = new ProviderService();