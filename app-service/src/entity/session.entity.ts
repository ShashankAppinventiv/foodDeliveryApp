import { sessionModel } from "../model/session.schema";
import BaseEntity from "./base-mongo-entity";

class SessionEntity extends BaseEntity{ 
    constructor(){
        super(sessionModel);
    }
}
export const sessionEntity= new SessionEntity();
