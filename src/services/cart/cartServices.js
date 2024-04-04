import { cartModel } from "../models/cart.model.js";
import { BadRequestError, NotFoundError } from "../../utils/index.js";
export default class CartService {
    constructor() { }

    async updateCart(_cid, products) {
        try {
            const cart = await cartModel.findById(_cid);
            if (!cart) {
                throw new NotFoundError('El carrito especificado no existe.');
            }
            cart.products = products;

            await cart.save();
            return cart;
        } catch (error) {
            throw new BadRequestError('No se pudo actualizar el carrito con el arreglo de productos.', error);
        }
    }

    async updateProductQuantity(_cid, _pid) {
        try {
            const cart = await cartModel.findById(_cid);
            if (!cart) {
                throw new NotFoundError('El carrito especificado no existe.');
            }
            if (!cart.products) {
                cart.products = [];
            }
            const existingProductIndex = cart.products.findIndex(item => item && item.item && item.item.toString() === _pid);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += 1;
            } else {
                cart.products.push({ item: _pid, quantity: 1 });
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new BadRequestError('No se pudo actualizar la cantidad del producto en el carrito.', error);
        }
    }
    async createNewCart() {
        try {
            const newEmptyCart = await cartModel.create({ products: [] });
            return newEmptyCart;
        } catch (error) {
            throw new BadRequestError('No se pudo crear un nuevo carrito.', error);
        }
    }
    async getAllCart() {
        try {
            let carts = await cartModel.find().populate('products.item');
            return carts;
        } catch (error) {
            throw new BadRequestError('No se pudieron obtener los carritos.', error);
        }
    }
    async getCartById(_cid) {
        try {
            const cart = await cartModel.findById(_cid).populate('products.item');
            if (!cart) {
                throw new NotFoundError('El carrito especificado no existe.');
            }
            return cart;
        } catch (error) {
            throw new BadRequestError('No se pudo obtener el carrito.', error);
        }
    }
    async deleteCart(_cid) {
        try {
            const cart = await cartModel.findById(_cid);
    
            if (!cart) {
                throw new NotFoundError('El carrito especificado no existe.');
            }
    
            await cartModel.findByIdAndDelete(_cid);
    
            return { message: 'Carrito eliminado correctamente.' };
        } catch (error) {
            throw new BadRequestError('No se pudo eliminar el carrito.', error);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);    
            if (!cart) {
                throw new Error("El carrito no se encontró");
            }    
            cart.products = cart.products.filter(product => product.item._id.toString() !== productId);    
            await cart.save();    
            return { message: "Producto eliminado del carrito correctamente" };
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito");
        }
    };

}