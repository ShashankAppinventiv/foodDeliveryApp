import {
  ExceptionMessage,
  HttpStatusCode,
  HttpStatusMessage,
  SuccessMessage,
} from "../interface/enum";
import { userService } from "../service/user.service";
import { responseUitls } from "../utils/response.util";
import { Request, Response } from "express";
class UserController {
  signin = async (req: Request, res: Response) => {
    try {
      const payload = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        mobile: req.body.mobile,
        type: req.body.type,
      };
      let response = await userService.signinRedis(payload);
      let finalResponse = responseUitls.successResponse(
        { response },
        SuccessMessage.Mail_SEND,
        HttpStatusMessage.OK
      );
      res.status(HttpStatusCode.OK).send(finalResponse);
    } catch (error) {
      let err = responseUitls.errorResponse(
        error,
        ExceptionMessage.USER_ALREADY_EXIST
      );
      res.status(HttpStatusCode.BAD_REQUEST).send(err);
    }
  };
  signinVerification = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      let response = await userService.signin(payload);
      let finalResponse = responseUitls.successResponse(
        { response },
        SuccessMessage.USER_REGISTRATION,
        HttpStatusMessage.CREATED
      );
      res.send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(err);
      res.send(error);
    }
  };
  login = async (req: Request, res: Response) => {
    try {
      let payload = req.body;
      let response = await userService.login(payload);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.ACCEPTED,
        HttpStatusMessage.ACCEPTED
      );
      res.status(HttpStatusCode.ACCEPTED).send(finalResponse);
    } catch (error) {
      let err = responseUitls.errorResponse(
        error,
        ExceptionMessage.LOGIN_FAILED,
        HttpStatusMessage.FORBIDDEN
      );
      res.status(HttpStatusCode.FORBIDDEN).send(err);
    }
  };
  logout = async (req: Request, res: Response) => {
    try {
      let payload = req.headers.authorization;
      let response = await userService.logout(payload);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.OK,
        HttpStatusMessage.OK
      );
      res.send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(err);
      res.send(error);
    }
  };
  updateProfile = async (req: Request, res: Response) => {
    try {
      let payload = req.body;
      let id: string = "" + req.headers._id;
      console.log(payload, id);
      let response = await userService.updateProfile(payload, id);
      let finalResponse = responseUitls.successResponse(
        { response },
        HttpStatusMessage.CREATED,
        HttpStatusMessage.CREATED
      );
      res.status(HttpStatusCode.CREATED).send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(err);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error);
    }
  };
  forgetPassword = async (req: Request, res: Response) => {
    try {
      let payload = req.body.email;
      let response = await userService.forgetPassword(payload);
      let finalResponse = responseUitls.successResponse(
        response,
        HttpStatusMessage.ACCEPTED,
        HttpStatusMessage.ACCEPTED
      );
      res.status(HttpStatusCode.ACCEPTED).send(finalResponse);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send(error);
    }
  };
  resetPassword = async (req: Request, res: Response) => {
    try {
      let payload = req.body;
      let response = await userService.resetPassword(payload);
      let finalResponse = responseUitls.successResponse(
        { response },
        HttpStatusMessage.ACCEPTED,
        HttpStatusMessage.ACCEPTED
      );
      res.status(HttpStatusCode.ACCEPTED).send(finalResponse);
    } catch (err) {
      let error = responseUitls.errorResponse(err);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error);
    }
  };
  updatePic = async (req: Request, res: Response) => {
    try {
      let payload = req.file?.filename;
      let id = "" + req.headers._id;
      let response = await userService.addPicture(payload, id);
      let finalResponse = responseUitls.successResponse(
        { response },
        HttpStatusMessage.ACCEPTED,
        HttpStatusMessage.ACCEPTED
      );
      res.status(HttpStatusCode.ACCEPTED).send(finalResponse);
    } catch (error) {
      let err = responseUitls.errorResponse(
        error,
        ExceptionMessage.SOMETHING_WENT_WRONG,
        HttpStatusMessage.INTERNAL_SERVER_ERROR
      );
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(err);
    }
  };
  addAddress = async (req: Request, res: Response) => {
    try {
      let payload = req.body;
      let userId: string = `${req.headers._id}`;
      let response = await userService.addAddress(payload, userId);
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
  getAddress = async (req: Request, res: Response) => {
    try{
      let userId=`${req.headers._id}`;
      let response=await userService.getAddress(userId);
      let finalResponse= responseUitls.successResponse(response)
      res.status(finalResponse.code).send(finalResponse);
    }catch(err){
      let error=responseUitls.errorResponse(err)
      res.status(error.code).send(error);
    }
  };
}
export const userController = new UserController();
