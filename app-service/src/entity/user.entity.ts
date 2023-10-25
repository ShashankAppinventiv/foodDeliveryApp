import { userModel } from "../model/user.schema";
import BaseEntity from "./base-mongo-entity";

class UserEntity extends BaseEntity{
    constructor()
    {
        super(userModel)
    }
}
export const userEntity = new UserEntity();