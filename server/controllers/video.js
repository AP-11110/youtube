import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({userId: req.user.id, ...req.body});
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    } catch (err) {
        next(err);
    }
}

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if(!video) return next(createError(404, "Video not found"));
        if(req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
        } else {
            return next(createError(403, "Can only update your own videos"));
        }

        res.status(200).json(updateVideo);

    } catch (err) {
        next(err);
    }
}

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if(!video) return next(createError(404, "Video not found"));
        if(req.user.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id);
        } else {
            return next(createError(403, "Can only delete your own videos"));
        }

        res.status(200).json("The video has been deleted");

    } catch (err) {
        next(err);
    }
}

export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
    } catch (err) {
        next(err);
    }
}

export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, { // increasing the view count
            $inc: {views: 1}
        });
        res.status(200).json("View increased");
    } catch (err) {
        next(err);
    }
}

export const random = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 }}]) // aggregate sample returns a random sample from the db
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}

export const trend = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 }); // mongodb sort method, sorting by view count. -1 for dec & 1 for inc
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}

export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id); // req.user holds user data (from token)
        const subscribedChannels = user.subscribedUsers; // getting subscribedChannels array

        // using promise.all due to doing a Video.find on every array item
        const list = await Promise.all(
            subscribedChannels.map(channelId => Video.find({ userId: channelId }))
        );

        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
        next(err);
    }
}

export const getByTag = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20); // $in is a mongodb method to check for values in arrays
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}

export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        // $regex provides regular expression capabilities for pattern matching strings in queries
        // $option: "i" to account for both uppercase and lowercase
        const videos = await Video.find({ title: { $regex: query, $options: "i" } }).limit(40);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}