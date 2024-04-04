import { productModel } from "../models/product.model.js";
import { BadRequestError, NotFoundError } from "../../utils/index.js";
import moment from 'moment'

export class ProductService {

    getAllProductList = async () => {
        const products = await productModel.find()
        return products
    }

    getProductById = async (_id) => {
        const product = await productModel.findOne({ _id })
        return product
    }

    addNewProduct = async (newProduct) => {
        const { pcode } = newProduct;
        const findedProduct = await productModel.findOne({ pcode });
        if (findedProduct) {
            throw new BadRequestError(`Ya existe un producto con ese mismo codigo de producto: ${pcode}`);
        }
        const product = await productModel.create(newProduct);
        return product;

    };
    updateProduct = async (id, newProduct) => {
        newProduct.fechaUpdate = moment().format()
        const product = await productModel.findOneAndUpdate(
            { id }, newProduct, { new: true })
        if (!product) {
            throw new BadRequestError('No existe un producto con ese id.')
        }
        return product
    };

    deleteProduct = async (_id) => {
        const product = await productModel.deleteOne({ _id })
        if (product.deletedCount === 0) {
            throw new BadRequestError('No existe un producto para borrar con ese id.')
        }
        return product;
    }

    getProductCount = async (filter) => {
        const count = await productModel.countDocuments(filter);
        return count;
    }

    getProducts = async (filter, limit, skip, sortOption) => {
        const products = await productModel.find(filter)
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort(sortOption);
        return products;
    }
}