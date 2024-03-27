import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { productsRoutes } from './src/routes/products.router.js';
import { userRoutes } from './src/routes/users.router.js';
import { cartRoutes } from './src/routes/cart.router.js';
import { viewsProductsRouter } from './src/routes/productsViews.router.js';
import { viewsCartRouter } from './src/routes/cartViewsRouter.js'
import handlebars from "express-handlebars";
import { __dirname } from './src/dirname.js';

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/products', viewsProductsRouter);
app.use('/cart', viewsCartRouter);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + "/public"));

app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
});
const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/ecommerce?retryWrites=true&w=majority');
        console.log("Conectado con exito a MongoDB usando Moongose.");
    

    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();