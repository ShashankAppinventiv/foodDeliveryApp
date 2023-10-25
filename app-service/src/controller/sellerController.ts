import { sellerService } from "../service/seller.service";
import { Request, Response } from "express";
import { responseUitls } from "../utils/response.util";
import { ExceptionMessage, HttpStatusMessage } from "../interface/enum";
import { resturantEntity } from "../entity/returant.entity";
class SellerActivityController {
  constructor() {}
  addRestaurant = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "seller") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        return res.status(error.code).send(error);
      }
      const payload = req.body;
      const sellerId: string = "" + req.headers._id;
      let response = await sellerService.addRestaurant(payload, sellerId);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.CREATED,
        HttpStatusMessage.CREATED
      );
      res.status(finalResponse.code).send(finalResponse);
    } catch (error) {
      const err = responseUitls.errorResponse(
        error,
        ExceptionMessage.SOMETHING_WENT_WRONG
      );
      res.status(err.code).send(err);
    }
  };
  updateResturant = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "seller") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        return res.status(error.code).send(error);
      }
      let payload = req.body;
      let resturantId = "" + req.query.resturantId;
      let response = await sellerService.UpdateResturant(payload, resturantId);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.CREATED,
        HttpStatusMessage.CREATED
      );
      res.status(finalResponse.code).send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(
        err,
        ExceptionMessage.SOMETHING_WENT_WRONG,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
      res.status(error.code).send(error);
    }
  };
  getResturant = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "seller") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        return res.status(error.code).send(error);
      }
      const id: string = "" + req.headers._id;
      let response = await sellerService.getAllResturant(id);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.OK,
        HttpStatusMessage.OK
      );
      res.status(finalResponse.code).send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(
        err,
        ExceptionMessage.SOMETHING_WENT_WRONG,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
      res.status(error.code).send(error);
    }
  };
  deleteResturant = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "seller") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        return res.status(error.code).send(error);
      }
      let payload = req.query;
      let response = await sellerService.deleteResturant(payload);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.ACCEPTED,
        HttpStatusMessage.ACCEPTED
      );
      res.status(finalResponse.code).send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(
        err,
        ExceptionMessage.SOMETHING_WENT_WRONG,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
      res.status(error.code).send(error);
    }
  };
  addFood = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "seller") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        return res.status(error.code).send(error);
      }
      const payload = req.body;
      const resturantId: string = "" + req.query.resturantId;
      const sellerId: string = "" + req.headers._id;
      await sellerService.checkOwnerShip(resturantId,sellerId);
      let response = await sellerService.addFood(
        payload,
        sellerId,
        resturantId
      );
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.CREATED,
        HttpStatusMessage.CREATED
      );
      res.status(finalResponse.code).send(finalResponse);
    } catch (error) {
      const err = responseUitls.errorResponse(
        error,
        ExceptionMessage.SOMETHING_WENT_WRONG
      );
      res.status(err.code).send(err);
    }
  };
  updateFood = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "seller") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        return res.status(error.code).send(error);
      }
      const payload = req.body;
      const FoodId: string = "" + req.query.foodId;
      const sellerId: string = "" + req.headers._id;
      let response = await sellerService.UpdateFood(payload,FoodId,sellerId);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.CREATED,
        HttpStatusMessage.CREATED
      );
      res.status(finalResponse.code).send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(
        err,
        ExceptionMessage.SOMETHING_WENT_WRONG,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
      res.status(error.code).send(error);
    }
  };
  getFood = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "seller") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        return res.status(error.code).send(error);
      }
      const id: string = "" + req.headers._id;
      
      let response = await sellerService.getAllFood(id);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.OK,
        HttpStatusMessage.OK
      );
      res.status(finalResponse.code).send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(
        err,
        ExceptionMessage.SOMETHING_WENT_WRONG,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
      res.status(error.code).send(error);
    }
  };
  deleteFood = async (req: Request, res: Response) => {
    try {
      if (req.headers.userType != "seller") {
        let error = responseUitls.errorResponse(
          ExceptionMessage.UNAUTHORIZED,
          ExceptionMessage.UNAUTHORIZED,
          HttpStatusMessage.UNAUTHORIZED
        );
        return res.status(error.code).send(error);
      }
      let payload = req.query;
      const sellerId: string = "" + req.headers._id;
      let response = await sellerService.deleteFood(payload, sellerId);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.ACCEPTED,
        HttpStatusMessage.ACCEPTED
      );
      res.status(finalResponse.code).send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(
        err,
        ExceptionMessage.SOMETHING_WENT_WRONG,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
      res.status(error.code).send(error);
    }
  };
}
export const sellerController = new SellerActivityController();
