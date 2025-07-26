import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';

export const activeCheck = async (req, res) => {
    return res.status(200).json({message: "active check"});
}

export const createPost = async (req, res) => {
    const { token } = req.body;
    try{
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
        const post = new Profile({
            userId: user._id,
            content: req.body.content,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split('/') : "",
        })

        await post.save();
        return res.status(201).json({ message: "Post created successfully", post });

    }  catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const getAllPosts = async (req, res) => {
    try{
        const posts = await Profile.find().populate('user', 'name email username profilePicture');
        return res.json({ posts });
    }catch(error){
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deletePost = async (req, res) => {
    const { token, post_id } = req.body;

    try{
        const user = await User
        .findOne({ token: token })
        .select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const post = await Profile.findOne({ _id: post_id });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Authorized" });
        }

        await Profile.deleteOne({ _id: post_id });
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const get_comments_by_post = async (req, res) => {
    const { post_id } = req.params;
    try {
        const post = await Post.findOne(post_id);

        if (!post) {
            return res.status(404).json({ message: "No comments found for this post" });
        }

        return res.json({ comments: post.comments });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}


export default delete_comment_of_user = async (req, res) => {
    const { token, comment_id } = req.body;

    try{
        const user = await User.findOne({ token: token }).select('_id');

        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        const comment = await Comment.findOne({ _id: comment_id });
        if(!comment){
            return res.status(400).json({ message: "Comment not found" });
        }
        if(comment.user.toString() !== user._id.toString()){
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }
        await Comment.deleteOne({ "_id" : comment_id });
        return res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const increment_Likes = async (req, res) => {
    const { post_id } = req.body;

    try {
        const post = await Profile.findOne({ _id: post_id });
        if(!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.likes = post.likes ? post.likes + 1 : 1;
        await post.save();
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


