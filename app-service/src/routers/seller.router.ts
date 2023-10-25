import { Router } from "express";
import { sellerController } from "../controller/sellerController";
import { sessionEntity } from "../entity/session.entity";
import { sessionValidator } from "../middleware/session";
import { validate } from "../middleware/validation/validation";
import Joi from "joi";
import { JOI_VALIDATION } from "../middleware/validation/joi.validation";
class Seller {
  private router!: Router;
  constructor() {
    this.router = Router();
  }
  ResturantRouter() {
    this.router.get(
      "/get-resturant",
      sessionValidator.checkSession,
      sellerController.getResturant
    );
    this.router.post(
      "/add-resturant",
      sessionValidator.checkSession,
      validate.body(Joi.object(JOI_VALIDATION.RESTURANT.ADD)),
      sellerController.addRestaurant
    );
    this.router.patch(
      "/update-resturant",
      sessionValidator.checkSession,
      validate.queryParam(Joi.object(JOI_VALIDATION.RESTURANT.UPDATE_PARAM)),
      validate.body(Joi.object(JOI_VALIDATION.RESTURANT.UPDATE)),
      sellerController.updateResturant
    );
    this.router.delete(
      "/delete-resturant",
      sessionValidator.checkSession,
      validate.queryParam(Joi.object(JOI_VALIDATION.RESTURANT.REMOVE)),
      sellerController.deleteResturant
    );
    return this.router;
  }
  FoodRouter() {
    this.router.get(
      "/get-food",
      sessionValidator.checkSession,
      sellerController.getFood
    );
    this.router.post(
      "/add-food",
      sessionValidator.checkSession,
      validate.queryParam(Joi.object(JOI_VALIDATION.FOOD.ADD_PARAM)),
      validate.body(Joi.object(JOI_VALIDATION.FOOD.ADD)),
      sellerController.addFood
    );
    this.router.patch(
      "/update-food",
      sessionValidator.checkSession,
      validate.queryParam(Joi.object(JOI_VALIDATION.FOOD.UPDATE_PARAM)),
      validate.body(Joi.object(JOI_VALIDATION.FOOD.UPDATE)),
      sellerController.updateFood
    );
    this.router.delete(
      "/delete-food",
      sessionValidator.checkSession,
      validate.queryParam(Joi.object(JOI_VALIDATION.FOOD.REMOVE)),
      sellerController.deleteFood
    );
    return this.router;
  }
}
export const sellerRouter = new Seller();
