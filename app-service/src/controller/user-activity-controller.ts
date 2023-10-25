import { Request, Response } from "express";
import {
  ExceptionMessage,
  HttpStatusCode,
  HttpStatusMessage,
} from "../interface/enum";
import { responseUitls } from "../utils/response.util";
import { userActivityService } from "../service/user.activity.service";
import { utils } from "../utils/utils";
class UserActivityController {
  constructor() {}
  nearByResturants = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "buyer") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        throw error;
      }
      const payload = req.body;
      let response = await userActivityService.findNearResturants(payload);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.OK
      );
      res.status(finalResponse.code).send(finalResponse);
    } catch (error) {
      let err = responseUitls.errorResponse(
        error,
        ExceptionMessage.SOMETHING_WENT_WRONG
      );
      res.status(err.code).send(err);
    }
  };
  viewFood = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "buyer") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        throw error;
      }
      let response;
      if (req.query.foodName && req.query.category) {
        response = await userActivityService.FoodWithCategoryAndName(
          `${req.query.resturantId}`,
          `${req.query.foodName}`,
          `${req.query.category}`
        );
      } else if (req.query.foodName) {
        response = await userActivityService.FoodWithName(
          `${req.query.resturantId}`,
          `${req.query.foodName}`
        );
      } else if (req.query.category) {
        response = await userActivityService.FoodWithCategory(
          `${req.query.resturantId}`,
          `${req.query.category}`
        );
      } else {
        response = await userActivityService.AllFood(`${req.body.resturantId}`);
      }
      let finalResponse = responseUitls.successResponse(response);
      res.status(finalResponse.code).send(finalResponse);
    } catch (error) {
      let err = responseUitls.errorResponse(error);
      res.status(err.code).send(err);
    }
  };
  addToCart = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "buyer") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        throw error;
      }
      let foodId: string = req.body.foodId;
      let userId: string = `${req.headers._id}`;
      let foodData = await userActivityService.findFoodDetails(foodId);
      let response = await userActivityService.insertDataIntoCart(
        foodData,
        userId
      );
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.CREATED,
        HttpStatusMessage.CREATED
      );
      res.status(finalResponse.code).send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(err);
      res.status(error.code).send(error);
    }
  };
  buyProduct = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "buyer") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        throw error;
      }
      let addressId=req.body.addressId;
      let userId=`${req.headers._id}`;
      let cartInfo=await userActivityService.getCartData(userId,addressId);
      let response = await userActivityService.placeOrder(cartInfo);
      let finalResponse= responseUitls.successResponse(response)
      res.status(finalResponse.code).send(finalResponse)
    } catch (err) {
      let error = responseUitls.errorResponse(err);
      res.status(error.code).send(error);
    }
  };
}

export const userActivityController = new UserActivityController();
