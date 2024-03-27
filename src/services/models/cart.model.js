import mongoose from "mongoose";

const collectionName = 'carts';

const cartSchema = new mongoose.Schema({
    products: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
            },
            quantity: { type: Number, default: 1 },
        },
    ]
});

const cartModel = mongoose.model(collectionName, cartSchema);
export { cartSchema, cartModel };