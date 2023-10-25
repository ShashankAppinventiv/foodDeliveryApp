import { Router } from "express";
import { userController } from "../controller/userController";
import { sessionValidator } from "../middleware/session";
import { validate } from "../middleware/validation/validation";
import Joi, { valid } from "joi";
import { JOI_VALIDATION } from "../middleware/validation/joi.validation";
import { upload } from "../middleware/validation/multer";
class UserRouter {
  private router!: Router;
  constructor() {
    this.router = Router();
  }
  userRouter() {
    this.router.post(
      "/signup",
      validate.body(Joi.object(JOI_VALIDATION.USER.SIGN_IN)),
      userController.signin
    );
    this.router.post(
      "/verify-new-user",
      validate.body(Joi.object(JOI_VALIDATION.USER.OTP)),
      userController.signinVerification
    );
    this.router.post(
      "/login",
      validate.body(Joi.object(JOI_VALIDATION.USER.LOGIN)),
      userController.login
    );
    this.router.patch("/logout", userController.logout);
    this.router.post(
      "/update-profile",
      validate.body(Joi.object(JOI_VALIDATION.USER.UPDATE_PROFILE)),
      sessionValidator.checkSession,
      userController.updateProfile
    );
    this.router.patch(
      "/forgetpassword",
      validate.body(Joi.object(JOI_VALIDATION.USER.EMAIL)),
      userController.forgetPassword
    );
    this.router.post(
      "/add-address",
      sessionValidator.checkSession,
      validate.body(Joi.object(JOI_VALIDATION.USER.ADDRESS)),
      userController.addAddress
    );
    this.router.get('/get-address',sessionValidator.checkSession,userController.getAddress)
    this.router.patch(
      "/resetpassword",
      validate.body(Joi.object(JOI_VALIDATION.USER.FORGET_PASSWORD)),
      userController.resetPassword
    );
    this.router.post(
      "/upload-pic",
      sessionValidator.checkSession,
      upload,
      userController.updatePic
    );
    return this.router;
  }
}
export const userRouter = new UserRouter();
