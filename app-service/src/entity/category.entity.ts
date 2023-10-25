import { categoryModel } from "../model/category.schema";
import BaseEntity from "./base-mongo-entity";

class CategoryEntity extends BaseEntity{
    constructor() {
        super(categoryModel);
    }
}
export const categoryEntity =new CategoryEntity();