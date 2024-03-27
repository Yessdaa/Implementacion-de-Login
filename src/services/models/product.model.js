import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "products";

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};

const productSchema = new mongoose.Schema({
    title: stringTypeSchemaNonUniqueRequired,
    shortdescription: stringTypeSchemaNonUniqueRequired,
    description: stringTypeSchemaNonUniqueRequired,
    stock: stringTypeSchemaNonUniqueRequired,
    price: stringTypeSchemaNonUniqueRequired,
    pcode: stringTypeSchemaUniqueRequired,
    category: stringTypeSchemaNonUniqueRequired,
    img1: String,
    img2: String,
    fecharegistro: stringTypeSchemaNonUniqueRequired,
});


productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema);