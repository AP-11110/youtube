import Comment from "../models/Comments.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

export const addComment = async (req, res, next) => {
    const newComment = new Comment({ ...req.body, userId: req.user.id });
    try {
        const savedComment = await newComment.save();
        res.status(200).send(savedComment);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    console.log(req.user)
    try {
        const comment = await Comment.findById(req.params.id);
        const video = await Video.findById(comment.videoId);

        if(req.user.id === comment.userId || req.user.id === video.userId) { // can delete comment if video or comment owner
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json("The comment has been deleted");
        } else {
            return next(createError(403, "You can only delete your own comments"));
        }
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}