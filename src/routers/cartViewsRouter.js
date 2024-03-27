import express from 'express';
import { BadRequestError } from '../utils/index.js';
import { cartModel } from "../services/models/cart.model.js";
import { productModel } from "../services/models/product.model.js"; 

const viewsCartRouter = express.Router();

viewsCartRouter.get('/:id', async (req, res) => {
    const cartId = req.params.id;

    try {
        const cart = await cartModel.findById(cartId).lean();

        if (!cart) {
            throw new BadRequestError('Carrito no encontrado');
        }
        for (const productItem of cart.products) {
            const product = await productModel.findById(productItem.item._id).lean();
            productItem.itemDetails = product;        }

        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export { viewsCartRouter };