import express from 'express';
import CartService from '../services/cart/cartServices.js';
import { BadRequestError, ApiResponse } from '../utils/index.js';

const cartRoutes = express.Router();
const cartService = new CartService();

cartRoutes.get('/', async (req, res) => {
    try {
        const carts = await cartService.getAllCart();
        return ApiResponse.success(res, carts);
    } catch (error) {
        return ApiResponse.error(res, error);
    }
});

cartRoutes.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        return ApiResponse.success(res, cart);
    } catch (error) {
        return ApiResponse.error(res, error);
    }
});

cartRoutes.post('/', async (req, res) => {
    try {
        const carts = await cartService.createNewCart();
        return ApiResponse.success(res, carts);
    } catch (error) {
        return ApiResponse.error(res, error);
    }
});
cartRoutes.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const result = await cartService.updateCart(cid, products);
        return ApiResponse.success(res, result);
    } catch (error) {
        return ApiResponse.error(res, error);
    }
});

cartRoutes.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const result = await cartService.updateProductQuantity(cid, pid, quantity);
        return ApiResponse.success(res, result);
    } catch (error) {
        return ApiResponse.error(res, error);
    }
});

cartRoutes.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await cartService.deleteCart(cid);
        return ApiResponse.success(res, result);
    } catch (error) {
        return ApiResponse.error(res, error);
    }
});

cartRoutes.delete("/:cid/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;        
        const result = await cartService.deleteProductFromCart(cid, pid);        
        return ApiResponse.success(res, result);
    } catch (error) {
        return ApiResponse.error(res, error);
    }
});
export { cartRoutes };