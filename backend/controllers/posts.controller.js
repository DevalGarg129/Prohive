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