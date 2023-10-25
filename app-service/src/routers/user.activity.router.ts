import { Router } from "express";
import { sessionValidator } from "../middleware/session";
import { validate } from "../middleware/validation/validation";
import Joi from "joi";
import { JOI_VALIDATION } from "../middleware/validation/joi.validation";
import { userActivityController } from "../controller/user-activity-controller";

class FilterRouter {
    private router!: Router
    constructor(){
        this.router=Router();
    }
    filter(){
        this.router.get('/near-restaurants',
        sessionValidator.checkSession,
        validate.body(Joi.object(JOI_VALIDATION.COORDINATES)),
        userActivityController.nearByResturants,
        )
        return this.router
    }
    viewAllFood(){
        this.router.get('/view-food',sessionValidator.checkSession,
        validate.queryParam(Joi.object(JOI_VALIDATION.SEARCH_FOOD)),
        userActivityController.viewFood)
        return this.router
    }
    addToCart(){
        this.router.get('/food/add-to-cart',sessionValidator.checkSession,
        validate.body(Joi.object(JOI_VALIDATION.CART.ADDTOCART)),
        userActivityController.addToCart)
        return this.router
    }
    buyProduct(){
        this.router.post('/order',sessionValidator.checkSession,
        validate.body(Joi.object(JOI_VALIDATION.ORDERS.BUY)),
        userActivityController.buyProduct)
        return this.router
    }
}
export const filterRouter=new FilterRouter();


