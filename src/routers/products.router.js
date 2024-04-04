import express from 'express'
import mongoose from 'mongoose';
import { ProductService } from '../services/products/ProductService.js';
import { BadRequestError, ApiResponse } from '../utils/index.js'
import Product from '../services/products/ProductClass.js'

import { productModel } from '../services/models/product.model.js';
import moment from 'moment'

const productsRoutes = express.Router();

const productManager = new ProductService()

productsRoutes.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        let filter = {};
        let sortOption = {};

        if (query) {
            if (query.includes('category:')) {
                const category = query.split(':')[1];
                filter = { category };
            } else if (query.includes('stock:')) {
                const stock = query.split(':')[1];
                filter = { stock };
            } else {
                console.log('parametro de busqueda no coinciden')                         
            }
        }

        if (sort === 'asc' || sort === 'desc') {
            sortOption = { price: sort === 'asc' ? 1 : -1 };
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOption,
            lean: true
        };

        const products = await productModel.paginate(filter, options);

        const totalPages = products.totalPages;

        const hasNextPage = products.hasNextPage;
        const hasPrevPage = products.hasPrevPage;

        const prevPage = hasPrevPage ? parseInt(page) - 1 : null;
        const nextPage = hasNextPage ? parseInt(page) + 1 : null;

        const prevLink = hasPrevPage ? `/?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null;
        const nextLink = hasNextPage ? `/?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null;

        const result = {
            status: 'success',
            payload: products.docs,
            totalPages,
            prevPage,
            nextPage,
            page: parseInt(page),
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        };

        return ApiResponse.success(res, result);
    } catch (error) {
        return ApiResponse.error(res, error);
    }
});
productsRoutes.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError(`El id debe ser un ObjectId válido`)
        }
        const product = await productManager.getProductById(id);
        if (!product) {
            throw new BadRequestError("El producto no existe")
        }
        return ApiResponse.success(res, product)
    } catch (error) {
        return ApiResponse.error(res, error)
    }
})
productsRoutes.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) {
            throw new BadRequestError(`El id debe ser numerico`)
        }
        const product = await productManager.getProductById(id);
        if (!product) {
            throw new BadRequestError("El producto no existe")
        }
        return ApiResponse.success(res, product)
    } catch (error) {
        return ApiResponse.error(res, error)
    }
})

productsRoutes.post('/', async (req, res) => {

    try {
        const { title, shortdescription, description, stock, price, pcode, category, img1, img2 } = req.body
        const newProduct = new Product(title, shortdescription, description, stock, price, pcode, category, img1, img2)

        newProduct.fecharegistro = moment().format()
        const product = await productManager.addNewProduct(newProduct)
        return ApiResponse.success(res, product)
    } catch (error) {
        return ApiResponse.error(res, error)
    }
});

productsRoutes.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, shortdescription, stock, price, pcode, category } = req.body
        const newProduct = new Product(title, description, shortdescription, stock, price, pcode, category)
        const product = await productManager.updateProduct(id, newProduct)
        return ApiResponse.success(res, product)
    } catch (error) {
        return ApiResponse.error(res, error)
    }
})

productsRoutes.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await productManager.deleteProduct(id)
        return ApiResponse.success(res, 'Producto Borrado')
    } catch (error) {
        return ApiResponse.error(res, error)
    }
});

export { productsRoutes }