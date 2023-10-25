import mongoose from "mongoose";
import { foodEntity } from "../entity/food.entity";
import { resturantEntity } from "../entity/returant.entity";
import { AcceptAny } from "../interface/type";
import { foodModel } from "../model/food.schema";
import { CustomException } from "../utils/exception.utils";
import { ExceptionMessage, HttpStatusMessage, SuccessMessage } from "../interface/enum";
import { cartEntity } from "../entity/cart.entity";
import { ICartArray } from "../interface/gobal.interface";
import { userEntity } from "../entity/user.entity";
import { orderEntity } from "../entity/order.entity";

class UserActivityService {
  AllFood = async (restaurantId: string) => {
    try {
      let result = await foodModel.find({
        resturantId: new mongoose.Types.ObjectId(`${restaurantId}`),
      });
      return result;
    } catch (err) {
      throw err;
    }
  };
  FoodWithCategory = async (resturantId: string, Category: string) => {
    try {
      let result = await foodModel.aggregate([
        {
          $search: {
            index: "food-search",
            compound: {
              filter: [
                {
                  text: {
                    query: `${Category}`,
                    path: "category",
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            resturantId: new mongoose.Types.ObjectId(`${resturantId}`),
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  };
  FoodWithName = async (resturantId: string, FoodName: string) => {
    try {
      let result = await foodModel.aggregate([
        {
          $search: {
            index: "food-search",
            compound: {
              filter: [
                {
                  text: {
                    query: `${FoodName}`,
                    path: "name",
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            resturantId: new mongoose.Types.ObjectId(`${resturantId}`),
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  };
  FoodWithCategoryAndName = async (
    resturantId: string,
    FoodName: string,
    Category: string
  ) => {
    try {
      let result = await foodModel.aggregate([
        {
          $search: {
            index: "food-search",
            compound: {
              should: [
                {
                  text: {
                    query: `${FoodName}`,
                    path: "name",
                  },
                },
                {
                  text: {
                    query: `${Category}`,
                    path: "category",
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            resturantId: new mongoose.Types.ObjectId(`${resturantId}`),
          },
        },
        {
          $project: {
            description: 1,
            name: 1,
            price: 1,
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  };
  findNearResturants = async (payload: AcceptAny) => {
    try {
      let result = await resturantEntity.aggregateData(
        [
          {
            $geoNear: {
              near: { type: "Point", coordinates: payload.coordinates },
              distanceField: "dist.calculated",
              maxDistance: 10000,
              includeLocs: "dist.location",
              spherical: true,
            },
          },
          { $project: { _id: 1, name: 1, description: 1 } },
        ],
        {}
      );
      return result;
    } catch (err) {
      throw err;
    }
  };
  findFoodDetails = async (foodId: string) => {
    try {
      let response = await foodEntity.findOne(
        { _id: new mongoose.Types.ObjectId(`${foodId}`) },
        { _id: 1, name: 1, price: 1, resturantId: 1 },
        {}
      );
      if (!response) {
        throw new CustomException(
          ExceptionMessage.NOT_FOUND,
          HttpStatusMessage.NOT_FOUND
        );
      }
      return response;
    } catch (err) {
      throw err;
    }
  };
  insertDataIntoCart = async (payload: AcceptAny, userId: string) => {
    try {
      let checkData = await cartEntity.findOne(
        {
          userId: userId,
        },
        {},
        {}
      );
      let arrayData: any = {
        foodId: payload._id,
        name: payload.name,
        price: payload.price,
        quantity: 1,
      };
      let resp;
      if (!checkData) {
        resp = await cartEntity.insertMany(
          {
            userId: userId,
            resturantId: payload.resturantId,
            items: arrayData,
            totalPrice: arrayData.price,
          },
          {}
        );
      } else {
        let check = await cartEntity.findOne(
          {
            userId: userId,
            resturantId: payload.resturantId,
          },
          {},
          {}
        );
        if (!check) {
          resp = await cartEntity.updateOne(
            {
              userId: userId,
            },
            {
              resturantId: payload.resturantId,
              items: arrayData,
              totalPrice: arrayData.price,
            },
            {}
          );
        } else {
          let data = await cartEntity.findOne(
            {
              "items.foodId": `${payload._id}`,
            },
            {},
            {}
          );
          if (data) {
            resp = await cartEntity.updateOne(
              {
                userId: userId,
                "items.foodId": `${payload._id}`,
              },
              {
                $inc: { "items.$.quantity": 1, totalPrice: arrayData.price },
              },
              {}
            );
          } else {
            resp = await cartEntity.updateOne(
              {
                userId: userId,
              },
              {
                $push: { items: arrayData },
                $inc: { totalPrice: arrayData.price },
              },
              {}
            );
          }
        }
      }
      return { resp };
    } catch (err) {
      throw err;
    }
  };
  getCartData = async (userId: string, userAddress: string) => {
    try {
      let checkAddress = await userEntity.findOne(
        {
          "address._id": userAddress,
        },
        { "address.location.coordinates": 1, _id: 0 },
        {}
      );
      if (!checkAddress) {
        throw new CustomException(ExceptionMessage.INVALID_ADDRESS);
      }
      let coordinates = checkAddress.address[0].location.coordinates;
      let cartDetails = await cartEntity.findOne(
        {
          userId: userId,
        },
        {},
        {}
      );
      let distance = await resturantEntity.aggregateData(
        [
          {
            $geoNear: {
              near: { type: "Point", coordinates: coordinates },
              distanceField: "dist.calculated",
              maxDistance: 10000,
              includeLocs: "dist.location",
              spherical: true,
            },
          },
          {
            $match: {
              _id: new mongoose.Types.ObjectId(`${cartDetails.resturantId}`),
            },
          },
          { $project: { "dist.calculated": 1, _id: 0 } },
        ],
        {}
      );
      let finalDistance = distance[0].dist.calculated;
      if (finalDistance > 10000) {
        throw new CustomException(ExceptionMessage.DISTANCE_ERROR);
      }
      return cartDetails;
    } catch (err) {
      throw err;
    }
  };
  placeOrder = async (payload: AcceptAny) => {
    try {
      let dataToSave={
        state:'SUCCESS',
        resturantId:payload.resturantId,
        food:payload.items,
        totalPrice:payload.totalPrice
      }
      let userOrder=await orderEntity.findOne({
        userId:payload.userId
      },{},{})
      if(!userOrder){
        await orderEntity.insertMany({
          userId:payload.userId,
          product: dataToSave },{}
          )
      }else{
        await orderEntity.updateMany({userId:payload.userId},{
          $push :{product: dataToSave} },{}
          )
      }
      cartEntity.deleteMany({
        userId:payload.userId
      })
      return SuccessMessage.ORDER_PLACED;
    } catch (err) {
      throw err;
    }
  };
}
export const userActivityService = new UserActivityService();
