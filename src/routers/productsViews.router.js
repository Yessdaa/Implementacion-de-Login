import express from 'express';
import { BadRequestError } from '../utils/index.js'
import mongoose from 'mongoose';
import { productModel } from "../services/models/product.model.js";

const viewsProductsRouter = express.Router();



viewsProductsRouter.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    let sortOptions = sort ? { price: sort === 'desc' ? -1 : 1 } : {};
    let queryOptions = query ? JSON.parse(query) : {};

    try {
        const options = {
            ...queryOptions,
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOptions,
            lean: true
        };

        const products = await productModel.paginate({}, options);

        const modifiedProducts = products.docs.map(product => ({
            _id: product._id.toString(),
            title: product.title,
            description: product.description,
            price: product.price
        }));

        res.render('products', {
            products: modifiedProducts,
            totalPages: products.totalPages,
            currentPage: products.page,
            hasNextPage: products.hasNextPage,
            hasPrevPage: products.hasPrevPage,
            nextPage: products.nextPage,
            prevPage: products.prevPage,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

viewsProductsRouter.get('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productModel.findById(productId).lean();

        if (!product) {
            throw new BadRequestError('Producto no encontrado');
        }

        res.render('productDetails', { product });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

viewsProductsRouter.post('/add-to-cart/:id', async (req, res) => {
    const productId = req.params.id;

});

export { viewsProductsRouter };