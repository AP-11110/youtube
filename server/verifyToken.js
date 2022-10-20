import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {

    // retrieving token from the cookies
    const token = req.cookies.access_token;

    if(!token) return next(createError(401, "You are not authenticated!"));

    // validating the token
    // verify function will return either an error or the info stored in the cookie such as the user
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        // if error then token isn't matching, return error
        if(err) return next(createError(403, "Token is not valid"));
        // if valid, store the user info in the request, which then can be extracted from other controllers
        req.user = user;
        next();
    })
}