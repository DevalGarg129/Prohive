import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';
import ConnectionRequest from '../models/connectionRequest.model.js'; // Added import
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const ConvertUserDataToPDF = (userData) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(16).toString('hex') + '.pdf';
    const stream = fs.createWriteStream("/uploads/" + outputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.user.profilePicture}`, { align: 'center', width: 200 });
    doc.fontSize(20).text(`Name: ${userData.user.name}`);
    doc.fontSize(16).text(`Username: ${userData.user.username}`);
    doc.fontSize(16).text(`Email: ${userData.user.email}`);
    doc.fontSize(16).text(`Bio: ${userData.bio}`);
    doc.fontSize(16).text(`Location: ${userData.currentPost}`);

    doc.fontSize(16).text("Past Work : ")
    userData.pastWork.forEach(work => {
        doc.fontSize(14).text(`Company: ${work.companyName}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`years: ${work.years}`);
    });

    doc.end();
    return outputPath;
}

// Register Controller
export const register = async (req, res) => {
    console.log(req.body);
    try {
        const { name, email, password, username } = req.body;
        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });
        await newUser.save();
        const profile = new Profile({ user: newUser._id });
        await profile.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist " });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = crypto.randomBytes(32).toString('hex');
        await User.updateOne({ _id: user._id }, { token });
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Upload profile picture controller
export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        user.profilePicture = req.file.filename;
        await user.save();
        return res.json({ message: "Profile picture updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Update profile picture controller
export const updateUserPicture = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const { username, email } = newUserData;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            if (existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: "Username or email already exists" });
            }
        }
        Object.assign(user, newUserData);
        await user.save();
        return res.json({ message: "Profile update successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const userProfile = await Profile.findOne({ user: user._id })
            .populate('user', 'name email username profilePicture');

        return res.json({ user, profile: userProfile });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const UpdateUserData = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;
        const userProfile = await User.findOne({ token: token });

        if (!userProfile) {
            return res.status(400).json({ message: "User not found" });
        }

        const profile_to_update = await Profile.findOne({ user: userProfile._id });
        Object.assign(profile_to_update, newProfileData);
        await profile_to_update.save();

        return res.json({ message: "Profile updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllUserProfile = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', "name email username profilePicture");
        if (!profiles || profiles.length === 0) {
            return res.status(404).json({ message: "No Profiles found" });
        }
        return res.json({ profiles });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const downloadProfile = async (req, res) => {
    const user_id = req.params.id;

    const userProfile = await Profile.findOne({ user: user_id })
        .populate('user', 'name email username profilePicture');

    let outputPath = ConvertUserDataToPDF(userProfile);
    return res.json({ "message": outputPath });
}

export const sendConnectionRequest = async (req, res) => {
    const { token, connectionId } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const connectionUser = await User.findById(connectionId);
        if (!connectionUser) {
            return res.status(400).json({ message: "Connection user not found" });
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already sent" });
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id,
        });
        
        await request.save();

        return res.status(201).json({ message: "Connection request sent successfully" });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyConnectionRequests = async (req, res) => {
    const { token } = req.body;
    try{
        const user = await User.findOne({ token });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ userId: user._id })
            .populate('connectionId', 'name email username profilePicture');

        return res.json({ connections });
    }catch(error){
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const whatAreMyConnections = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await User.findOne({ token });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const connections = await ConnectionRequest.find({ connectionId: user._id })
            .populate('userId', 'name email username profilePicture');
        
        return res.json(connections);
    }catch (error){
        return res.status(500).json({ message: error.message });
    }
}

export const acceptConnectionRequest = async (req, res) => {
    const { token, requestId, action_type } = req.body;
    try {
        const user = await User.findOne({ token });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const connection = await ConnectionRequest.findOne({ _id: requestId });

        if(!connection){
            return res.status(400).json({ message: "connection request not found" });
        }

        if(action_type === "accept"){
            connection.status_accepted = true;
        }else{
            connection.status_accepted = false;
        }

        await connection.save();
        return res.json({ message: "Connection request updated successfully" });
    }catch(error){
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const commentPost = async (req, res) => {
    const { token, post_id, commentBody } = req.body;
    try {
        const user = await User.findOne({ token: token }).select('_id');
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        const post = await Post.findOne({ 
            _id: post_id 
        });

        if(!post){
            return res.status(400).json({ message: "Post not found" });
        }

        const comment = new Comment({
            user: user._id,
            post: post._id,
            content: commentBody
        });
        await comment.save();

        return res.status(200).json({ message: "Comment added successfully" });
    }catch(error){
        return res.status(500).json({ message: "Internal server error" });
    }
}
