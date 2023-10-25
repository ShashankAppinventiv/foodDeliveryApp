import { Router } from "express";
import { adminController } from "../controllers/adminContoller";
class Seller {
  private router!: Router;
  constructor() {
    this.router = Router();
  }
  adminRouter() {
    this.router.get('/get-all-users',adminController.getUsers)
    return this.router;
  }
}
export const adminRouter = new Seller();
