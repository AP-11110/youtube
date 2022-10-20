import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const updateUser = async (req, res, next) => {
    // comparing user id from the url with user id extracted from the jwt token via cookies
    if(req.params.id === req.user.id) {
        try {
            // using mongodb method findByIdAndUpdate & $set in order to update the user details
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });

            res.status(200).json(updateUser);
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, "You can only update your own account"));
    }
}

export const deleteUser = async (req, res, next) => {
    // comparing user id from the url with user id extracted from the jwt token via cookies
    if(req.params.id === req.user.id) {
        try {
            // using mongodb method findByIdAndUpdate & $set in order to update the user details
            await User.findByIdAndDelete(req.params.id);

            res.status(200).json("User has been deleted");
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, "You can only delete your own account"));
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { // subscribing to another channel
            $push: {subscribedUsers: req.params.id} // another channel is to the subscribedUsers array
        });

        await User.findByIdAndUpdate(req.params.id, { // increasing the subscribers count on the subscribed channel
            $inc: {subscribers: 1}
        });
        
        res.status(200).json("Subscription successful");
    } catch (err) {
        next(err);
    }
}

export const unsubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { 
            $pull: {subscribedUsers: req.params.id} // removing subscribed channel
        });

        await User.findByIdAndUpdate(req.params.id, { // decreasing the subscribers count on the subscribed channel
            $inc: {subscribers: -1}
        });
        
        res.status(200).json("Unsubscribed");
    } catch (err) {
        next(err);
    }
}

export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id }, // prevents duplicates, if the like button is clicked again, it won't be added
            $pull: { dislikes: id } // removes dislike if already exist 
        })
        res.status(200).json("Video liked")
    } catch (err) {
        next(err);
    }
}

export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id } 
        })
        res.status(200).json("Video disliked")
    } catch (err) {
        next(err);
    }
}