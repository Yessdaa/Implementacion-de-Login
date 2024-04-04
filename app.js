import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { productsRoutes } from './src/routers/products.router.js';
import { userRoutes } from './src/routers/users.router.js';
import { cartRoutes } from './src/routers/cartRouter.js';
import { viewsProductsRouter } from './src/routers/productsViews.router.js';
import { viewsCartRouter } from './src/routers/cartViewsRouter.js'
import { sessionRouterView } from './src/routers/sessionsRouter.js'
import { userViewRouter } from './src/routers/userViewRouter.js';
import handlebars from "express-handlebars";
import { __dirname } from './src/dirname.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './src/config/passport.config.js';
import githubLoginViewRouter from './src/routers/github.login.views.router.js'
const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + "/public"));
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/ecommerce?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 10 * 60
    }),
    secret: "Bigote",
    resave: false,
    saveUninitialized: true,
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/products', viewsProductsRouter);
app.use('/cart', viewsCartRouter);
app.use('/users', userViewRouter)
app.use("/api/sessions", sessionRouterView);
app.use("/github", githubLoginViewRouter);




app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
});
const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://bernardodieta:Mexico926+@ecommerce.7wbxdym.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce');
        console.log("Conectado con exito a MongoDB usando Moongose.");


    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();