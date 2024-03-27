import Joi from "joi";

const product = Joi.object({
    title: Joi.string().min(3).max(45).required(),
    description: Joi.string(10).max(200).required(),
    shortdescription: Joi.string(10).max(80).required(),
    stock: Joi.number().required(),
    price: Joi.number().required().required(),
    pcode: Joi.string().min(2).max(10).required(),
    category: Joi.string().min(3).max(15).required(),
});

export const VALIDATORS = { product };