import { resturantModel } from "../model/resturant.schema";
import BaseEntity from "./base-mongo-entity";

class Resturant extends BaseEntity{
    constructor(){
        super(resturantModel)
    }
}
export const resturantEntity = new Resturant();