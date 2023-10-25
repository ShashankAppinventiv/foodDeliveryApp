import { MAIL_SUBJECT } from "../constant/constants";
import { userEntity } from "../entity/user.entity";
import {
  ExceptionMessage,
  HttpStatusMessage,
  SuccessMessage,
} from "../interface/enum";
import { AcceptAny } from "../interface/type";
import { nodeMailer } from "../provider/nodemailer/nodenmailer";
import { redis } from "../provider/redis/redis";
import { CustomException } from "../utils/exception.utils";
import { utils } from "../utils/utils";
import { sessionEntity } from "../entity/session.entity";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { responseUitls } from "../utils/response.util";
import fs from "fs";
import { userModel } from "../model/user.schema";
import mongoose from "mongoose";
env.config();
class UserService {
  constructor() {}
  signinRedis = async (payload: AcceptAny) => {
    try {
      let data = await userEntity.findOne(
        { $or: [{ username: payload.username }, { email: payload.email }] },
        { email: 1, username: 1 },
        {}
      );

      if (data == null) {
        let token = utils.otpGenerator(6);
        const subject = MAIL_SUBJECT.VERIFICATION_OTP;
        await nodeMailer.sendMail(payload.email, token, subject, payload.name);
        redis.setKeyWithExpiry(`${token}`, `${payload.email}`, 300);
        let payloadData = JSON.stringify(payload);
        redis.setKeyWithExpiry(
          `${payload.email}+${token}`,
          `${payloadData}`,
          300
        );
        return SuccessMessage.USER_REGISTRATION_MAIL;
      }
      if (data.email) {
        throw new CustomException(
          ExceptionMessage.EMAIL_ALREADY_EXIST,
          HttpStatusMessage.FORBIDDEN
        );
      } else if (data.username) {
        throw new CustomException(
          ExceptionMessage.USER_ALREADY_EXIST,
          HttpStatusMessage.FORBIDDEN
        );
      }
    } catch (error) {
      throw error;
    }
  };
  signin = async (payload: AcceptAny) => {
    try {
      let email = await redis.getKey(`${payload.otp}`);
      if (email == null) {
        throw new CustomException(
          ExceptionMessage.INCORRECT_OTP,
          HttpStatusMessage.FORBIDDEN
        );
      }
      let data = "" + (await redis.getKey(`${email}+${payload.otp}`));
      let finalData = JSON.parse(data);
      let CheckUser = await userEntity.findOne(
        { $or: [{ username: finalData.username }, { email: finalData.email }] },
        { email: 1, username: 1 },
        {}
      );
      if (CheckUser && CheckUser.email) {
        throw new CustomException(
          ExceptionMessage.EMAIL_ALREADY_EXIST,
          HttpStatusMessage.FORBIDDEN
        );
      } else if (CheckUser && CheckUser.username) {
        throw new CustomException(
          ExceptionMessage.USER_ALREADY_EXIST,
          HttpStatusMessage.FORBIDDEN
        );
      }
      await userEntity.insertMany(finalData, {}).catch(() => {
        throw new CustomException(
          ExceptionMessage.SOMETHING_WENT_WRONG,
          HttpStatusMessage.INTERNAL_SERVER_ERROR
        );
      });
      return SuccessMessage.USER_REGISTRATION;
    } catch (error) {
      throw error;
    }
  };
  login = async (payload: AcceptAny) => {
    try {
      let data = await userEntity.findOne(
        {
          username: payload.username,
        },
        { _id: 1, type: 1, password: 1 },
        {}
      );
      if (data) {
        if (data.password != payload.password) {
          throw new CustomException(
            ExceptionMessage.INVALID_PASSWORD,
            HttpStatusMessage.BAD_REQUEST
          );
        }
        let redisSession = await redis.getKey(`${data._id}`);
        if (!redisSession) {
          let dataSession = await sessionEntity.findOne(
            {
              userId: data._id,
              isActive: true,
              deviceId: payload.deviceId,
            },
            {}
          );
          if (!(dataSession == null)) {
            await redis.setKeyWithExpiry(
              `${data._id}`,
              `${payload.deviceId}`,
              9000
            );
          } else {
            let deviceId = payload.deviceId;
            await sessionEntity.updateMany(
              {
                userId: data._id,
                isActive: true,
              },
              {
                $set: {
                  isActive: false,
                },
              },
              {}
            );
            sessionEntity.saveData({
              userId: data._id,
              isActive: true,
              deviceId: payload.deviceId,
            });
            await redis.setKeyWithExpiry(
              `${data._id}`,
              `${payload.deviceId}`,
              9000
            );
          }
        } else if (redisSession != payload.deviceId) {
          let deviceId = payload.deviceId;
          await sessionEntity.updateMany(
            {
              userId: data._id,
              isActive: true,
            },
            {
              $set: {
                isActive: false,
              },
            },
            {}
          );
          sessionEntity.saveData({
            userId: data._id,
            isActive: true,
            deviceId: payload.deviceId,
          });
          await redis.setKeyWithExpiry(
            `${data._id}`,
            `${payload.deviceId}`,
            9000
          );
        }
        let SECRET_KEY = "" + process.env.SECRET_KEY;
        let token = jwt.sign(
          { _id: data._id, deviceId: payload.deviceId, type: data.type },
          SECRET_KEY,
          { expiresIn: 90000 }
        );
        return { token };
      } else {
        throw new CustomException(
          ExceptionMessage.USER_NOT_FOUND,
          HttpStatusMessage.NOT_FOUND
        );
      }
    } catch (error) {
      throw error;
    }
  };
  logout = async (payload: AcceptAny) => {
    try {
      let secret_key = "" + process.env.SECRET_KEY;
      let decodeData = JSON.parse(
        JSON.stringify(jwt.verify(payload, secret_key))
      );
      let data = await sessionEntity.updateOne(
        {
          userId: decodeData._id,
          isActive: true,
        },
        {
          isActive: false,
        },
        {}
      );
      await redis.delKey(`${decodeData._id}`);
      return SuccessMessage.LOGOUT_SUCCESS;
    } catch (err) {
      throw new CustomException(
        ExceptionMessage.SOMETHING_WENT_WRONG,
        HttpStatusMessage.SERVICE_UNAVAILABLE
      );
    }
  };
  updateProfile = async (payload: AcceptAny, id: string) => {
    try {
      await userEntity.updateOne(
        {
          _id: id,
        },
        payload,
        {}
      );
      return SuccessMessage.UPDATE_DETAILS;
    } catch (error) {
      throw new CustomException(
        ExceptionMessage.SOMETHING_WENT_WRONG,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
    }
  };
  forgetPassword = async (payload: AcceptAny) => {
    try {
      let token = utils.otpGenerator(6);
      let data=await userEntity.find({email:payload},{},{})
      // let data =await userEntity.aggregateData([
      //   {
      //     $search: {
      //       index: "email",
      //       text: {
      //         query: `${payload}`,
      //         path: "email"
      //       }
      //     }
      //   }
      // ],{});
      console.log(data)
      if(data.length<=0)
      {
        throw new CustomException(ExceptionMessage.USER_NOT_FOUND);
      }
      await nodeMailer.sendMail(
        payload,
        token,
        MAIL_SUBJECT.VERIFICATION_OTP,
        ""
      );
      await redis
        .setKeyWithExpiry(`changepassword${token}`, `${payload}`, 300)
        .catch(() => {
          throw new CustomException(
            ExceptionMessage.SOMETHING_WENT_WRONG,
            HttpStatusMessage.INTERNAL_SERVER_ERROR
          );
        });
      return SuccessMessage.Mail_SEND;
    } catch (error) {
      let err = responseUitls.errorResponse(
        error,
        ExceptionMessage.SOMETHING_WENT_WRONG,
        HttpStatusMessage.SERVICE_UNAVAILABLE
      );
      throw err;
    }
  };
  resetPassword = async (payload: AcceptAny) => {
    try {
      let redisEmail = await redis.getKey(`changepassword${payload.otp}`);
      if (redisEmail == null) {
        throw new CustomException(
          ExceptionMessage.INVALID_OTP,
          HttpStatusMessage.BAD_REQUEST
        );
      } else {
        await userEntity
          .updateOne(
            {
              email: redisEmail,
            },
            {
              password: payload.password,
            },
            {}
          )
          .catch((error) => {
            throw new CustomException(
              error,
              HttpStatusMessage.SERVICE_UNAVAILABLE
            );
          });
        await redis.delKey(`changepassword${payload.otp}`);
        return SuccessMessage.PASSWORD_CHANGED;
      }
    } catch (error) {
      throw error;
    }
  };
  addPicture = async (payload: AcceptAny, id: string) => {
    try {
      let file = `/uploads/${payload}`;
      await userEntity.updateOne(
        {
          _id: id,
        },
        { profile: `${file}` },
        {}
      );
      return SuccessMessage.PROFILE_PIC_UPLOAD;
    } catch (err) {
      throw err;
    }
  };
  addAddress = async (payload: AcceptAny, userId: string) => {
    try {
      let address = payload;
      let dataToSave = {
        city: payload.city,
        street: payload.street,
        description: payload.description,
        location: payload.location,
      };
      await userModel.updateOne(
        {
          _id: userId,
        },
        {
          $push: { address: dataToSave },
        }
      );
      return SuccessMessage.ADDRESS_ADD;
    } catch (err) {
      throw err;
    }
  };
  getAddress =async (userId:string) => {
    try{
      let result=await userEntity.find({
        _id: userId
      },{_id:0,address:1},{})
      return result;
    }catch(err)
    {
      throw err;
    }
  }
 }
export const userService = new UserService();
