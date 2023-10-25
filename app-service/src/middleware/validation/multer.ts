import multer from 'multer'
import { Request,Response } from 'express'

//multer
export const upload = multer({
    storage:multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,"uploads")
        },
        filename:function(req,file,cb){
            cb(null,req.body.filename=req.headers._id+file.originalname)
        }
    })
}).single("profile");