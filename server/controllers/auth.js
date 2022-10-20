import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({...req.body, password: hash}); // storing everything the way it came from the req.body except for the password
        await newUser.save();
        res.status(200).send("User has been created");
    } catch (err) {
        next(err);
    }
}

export const signin = async (req, res, next) => {
    try{
        const user = await User.findOne({ name: req.body.name });
        if(!user) return next(createError(404, "User not found"));

        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isCorrect) return next(createError(400, "Wrong credentials"));
        const {password, ...others} = user._doc; // seperating user details from the password so it's not passed through via json. User details are stored under _doc property in the db.
        // creating token
        // any user information can be passed through {} which will be stored in the token, 
        // this will be unpacked later in order to varify the user. In this case, user._id is being passed which was received from the db.
        // secret key generated using require('crypto' ).randomBytes (64). toString('hex')
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        
        // sending token via cookies, httpOnly: true makes it more secure, prevents 3rd party scripts
        // npm i cookieParser and add app.use(cookieParser()); above routes
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(others);

    } catch (err) {
        next(err);
    }
}