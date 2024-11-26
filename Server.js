import dotenv from 'dotenv'
dotenv.config();

// Import Packages & Middlewares
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import verifyJWT from './Middlewares/verifyJWT.js';

const PORT = process.env.PORT || 3500;
import connectDB from './Config/dbConn.js';

// Auth Routes
import RegisterRoute from './Routes/registerRoute.js';
import LoginRoute from './Routes/loginRoute.js';
import LogoutRoute from './Routes/logoutRoute.js';

// Other Routes
import CategoryRoutes from './Routes/categoryRoutes.js';
import UserRoutes from './Routes/userRoutes.js';
import VendorRoutes from './Routes/vendorRoutes.js';
import ProductRoutes from './Routes/productRoutes.js';
import OrderRoutes from './Routes/orderRoutes.js';

const app = express();

connectDB();

// Use In-Built Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Auth-Routes
app.use('/register', RegisterRoute);
app.use('/login', LoginRoute);
app.use('/logout', LogoutRoute);
app.use('/users', UserRoutes);

app.use(verifyJWT);

// Other-Routes
app.use('/category', CategoryRoutes);
app.use('/vendor', VendorRoutes);
app.use('/products', ProductRoutes);
app.use('/orders', OrderRoutes);

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
