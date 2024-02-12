import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connecttodb from './db/connecttodb.js';
import router from './routes/userRoutes.js';
import router2 from './routes/postRoutes.js';
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
//Routes

app.use('/api/users', router);
app.use('/api/posts', router2);


app.get('/', (req, res) => {
    res.send('Hello, World! make some changes');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
connecttodb();