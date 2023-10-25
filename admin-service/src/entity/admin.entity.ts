import { adminModel } from "../model/admin.model";
import BaseEntity from "./base-mongo-entity";

class AdminEntity extends BaseEntity{
    constructor(){
        super(adminModel);
    }
}
export const adminEntity = new AdminEntity();