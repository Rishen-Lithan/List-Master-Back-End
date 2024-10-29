import dotenv from 'dotenv'
dotenv.config();

// Import Packages
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import express from 'express'

const PORT = process.env.PORT || 3500;
import connectDB from './Config/dbConn.js';

import RegisterRoute from './Routes/registerRoute.js';
import LoginRoute from './Routes/loginRoute.js';
import LogoutRoute from './Routes/logoutRoute.js'

const app = express();

connectDB();

// Use In-Built Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/register', RegisterRoute);
app.use('/login', LoginRoute);
app.use('/logout', LogoutRoute);

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
