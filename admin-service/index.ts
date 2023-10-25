import express,{Express} from 'express'
import { portNumber } from './src/constant/constants';
import { adminRouter } from './src/routers/adminRouter';
class App{
    private app!:Express
    private port!:number
    constructor(){
        this.startApp();
    }
    private startApp(){
        this.loadMiddleware()
        this.loadGlobalMiddleware()
        this.loadRouter()
        this.initServer();
    }
    private loadMiddleware(){
        this.app=express()
    }
    private loadRouter(){
        this.app.use('/check',adminRouter.adminRouter())
    }
    private loadGlobalMiddleware(){
        this.app.use(express.json())
        this.port=portNumber
    }
    private initServer(){
        this.app.listen(this.port,()=>{
            console.log(`Server listening on port ${this.port}`)
        })
    }
}
new App();