import express, { Express } from "express";
import { portNumber, swaggerContext, userActivityContext } from "./src/constant/constants";
import { userContext, sellerContext } from "./src/constant/constants";
import { userRouter,sellerRouter, filterRouter } from "./src/routers/router";
import { mongo } from "./src/provider/mongo/mongo";
import { serve, setup } from "swagger-ui-express";
import { utils } from "./src/utils/utils";
import * as swaggerDocument from "./swagger/parse-swagger.json";
import { GRPC } from "./grpc";
class App {
  private app!: Express;
  private port!: number;
  private userContext!: string;
  private sellerContext!: string;
  private swaggerContext!: string;
  private userActivityContext!: string;
  constructor() {
    this.startApp();
  }
  startApp() {
    this.app = express();
    this.loadContext();
    this.loadGlobalMiddleWare();
    mongo.initiateMongoConnection;
    new GRPC()
    this.loadRouter();
    this.initServer();
  }
  loadGlobalMiddleWare() {
    this.app.use(express.json());
    this.port = portNumber;
}
loadContext() {
    this.swaggerContext = swaggerContext;
    this.sellerContext = sellerContext;
    this.userContext = userContext;
    this.userActivityContext= userActivityContext
  }
  loadRouter() {
    this.app.use(this.swaggerContext, serve, setup(swaggerDocument));
    this.app.use(this.userContext, userRouter.userRouter());
    this.app.use(this.sellerContext, sellerRouter.ResturantRouter());
    this.app.use(this.sellerContext,sellerRouter.FoodRouter())
    this.app.use(this.userActivityContext,filterRouter.filter())
    this.app.use(this.userActivityContext,filterRouter.viewAllFood())
    this.app.use(this.userActivityContext,filterRouter.addToCart())
    this.app.use(this.userActivityContext,filterRouter.buyProduct())
  }
  initServer() {
    this.app.listen(this.port, this.callback);
  }
  private callback = () => {
    console.log(`Server listing on port: ${this.port}`);
  };
}
(async () => {
  // await utils.generateSwagger();
  new App();
})();