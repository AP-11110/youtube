import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const connect = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to DB");
    }).catch((err) => {
        throw err;
    });
};

app.listen(8800, () => {
    connect();
    console.log("Connected to server")
});