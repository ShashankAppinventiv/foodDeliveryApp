import { foodEntity } from "../entity/food.entity";
import { resturantEntity } from "../entity/returant.entity";
import { ExceptionMessage, HttpStatusMessage, SuccessMessage } from "../interface/enum";
import { AcceptAny } from "../interface/type";
import { Types } from "mongoose";
import { resturantModel } from "../model/resturant.schema";
import { CustomException } from "../utils/exception.utils";
import { foodModel } from "../model/food.schema";

class SellerService {
  constructor() {}
  getAllResturant = async (payload: AcceptAny) => {
    try {
      let data = await resturantEntity.find({ OwnerId: payload }, {}, {});
      return data;
    } catch (err) {
      throw err;
    }
  };
  addRestaurant = async (payload: AcceptAny, sellerId: string) => {
    try {
      await resturantEntity.saveData({ ...payload, OwnerId: sellerId });
      return SuccessMessage.RESTURANT_ADD;
    } catch (error) {
      throw error;
    }
  };
  UpdateResturant = async (payload: AcceptAny, resturantId: string) => {
    try {
      const objectId = Types.ObjectId;
      let data = await resturantModel.updateOne(
        {
          _id: resturantId,
        },
        payload
      );
      return SuccessMessage.RESTURANT_UPDATE;
    } catch (error) {
      throw error;
    }
  };
  deleteResturant = async (payload: AcceptAny) => {
    try {
      let id = payload.resturantId;
      await resturantEntity.deleteMany({
        _id: id,
      });
      return SuccessMessage.RESTURANT_DELETE;
    } catch (error) {
      throw error;
    }
  };
  getAllFood = async (payload: AcceptAny) => {
    try {
      let data = await foodEntity.find({ sellerId: payload }, {}, {});
      return data;
    } catch (err) {
      throw err;
    }
  };
  addFood = async (
    payload: AcceptAny,
    sellerId: string,
    resturantId: string
  ) => {
    try {
      await foodEntity.saveData({
        ...payload,
        sellerId: sellerId,
        resturantId: resturantId,
      });
      return SuccessMessage.FOOD_ADD;
    } catch (error) {
      throw error;
    }
  };
  UpdateFood = async (payload: AcceptAny,id:string,sellerId:string) => {
    try {
      let data= await foodModel.updateOne(
        {
          _id: id,
          sellerId: sellerId
        },
          payload
      );
      return SuccessMessage.FOOD_UPDATE;
    } catch (error) {
      throw error;
    }
  };
  deleteFood = async (payload: AcceptAny,sellerId:String) => {
    try {
      let id = payload.foodId;
      await foodEntity.deleteMany({
        _id: id,
        sellerId: sellerId
      });
      return SuccessMessage.FOOD_DELETE;
    } catch (error) {
      throw error;
    }
  };
  checkOwnerShip = async (resturantId: string, sellerId: string) => {
    try {
      let result = await resturantEntity.findOne(
        {
          _id: resturantId,
          OwnerId: sellerId,
        },
        { _id: 1 },
        {}
      );
      if(!result)
      {
        throw new CustomException(ExceptionMessage.UNAUTHORIZED,HttpStatusMessage.UNAUTHORIZED);
      }
    } catch (err) {
      throw err
    }
  };
}
export const sellerService = new SellerService();
