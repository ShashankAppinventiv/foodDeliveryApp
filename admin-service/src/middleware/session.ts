// import { Request,Response } from 'express';
// import jwt from 'jsonwebtoken'
// import dotenv from 'dotenv'
// import { redis } from '../provider/redis/redis';
// import { sessionEntity } from '../entity/session.entity';
// import { CustomException } from '../utils/exception.utils';
// import { ExceptionMessage, HttpStatusMessage } from '../interface/enum';
// import { responseUitls } from '../utils/response.util';
// dotenv.config();
// class SessionValidator{
//     constructor(){}
//     async checkSession(req:Request,res:Response,next: () => void)
//     {
//         try{let token:string= ""+req.headers.authorization;
//         let SECRET_KEY:string=""+process.env.SECRET_KEY;
//         let decodeData=JSON.parse(JSON.stringify(jwt.verify(token,SECRET_KEY)))
//         let redisSessionData=redis.getKey(decodeData._id)
//         req.headers._id=decodeData._id;
//         req.headers.userType=decodeData.type;
//         if(redisSessionData==decodeData.deviceId)
//         {
//             next()
//         }else{
//             let sessionData=await sessionEntity.findOne({
//                 deviceId:decodeData.deviceId,
//                 userId:decodeData._id,
//                 isActive:true,
//             },{_id:1})
//             if(sessionData){
//                 redis.setKeyWithExpiry(`${decodeData._id}`,`${decodeData.deviceId}`,9000);
//                 next();
//             }else{
//                 throw new CustomException(ExceptionMessage.UNAUTHORIZED,HttpStatusMessage.UNAUTHORIZED)
//             }
//         }}catch(error){
//             let err=responseUitls.errorResponse(error);
//             res.send(err);
//         }
//     }
// }
// export const sessionValidator = new SessionValidator();