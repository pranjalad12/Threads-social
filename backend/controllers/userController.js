import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import generateTokensAndSetCookies from "../utils/helpers/generateTokensAndSetCookies.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const signup = async (req, res) => {
    try{
            const { name, username,email, password } = req.body;
            const user=await User.findOne({$or:[{email},{username}]});
 
            if(user){
               return  res.status(400).json({message:"User already exists"});
            }
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password,salt);

            const newUser=new User({name,username,email,password:hashedPassword});
            await newUser.save();
            if(newUser){
                generateTokensAndSetCookies(newUser._id,res);
              return res.status(201).json({_id:newUser._id,name:newUser.name,username:newUser.username,email:newUser.email});

            }
            else{
              return   res.status(400).json({err:"Invalid user data"});
            
            }

    }
    catch(err){
       return  res.status(500).json({err:err.message});
        console.log("error: " + err.message);
    }
};
const login = async (req,res)=>{
    try{
        const {username,password}=req.body;
    const user=await User.findOne({username});
    console.log({ user })
    const isPasswordCorrect=await bcrypt.compare(password,user?.password||"");
    if(!user || !isPasswordCorrect){
       return res.status(400).json({err:"Invalid username or password"});
    }
    else{
        generateTokensAndSetCookies(user._id,res);
       return res.status(200).json({_id:user._id,name:user.name,username:user.username,email:user.email});
    }
    }
    catch(err){
        return res.status(500).json({err:err.message});
        console.log("error: " + err.message);
    }
    
}
const logout =async (req,res)=>{
    try{
        res.cookie("token", "", { maxAge: 1 });
        res.status(200).json({message:"Logged out successfully"});
    }
    catch(err){
      res.status(500).json({err:err.message});
        console.log("error: " + err.message);
    }
}
const followUnfollowUser=async (req,res)=>{
    try{
        const {id} =req.params;
        const userToModifyId=await User.findById(id);
        const currentUser=await User.findById(req.user._id);
        console.log(userToModifyId);
        console.log(currentUser);
        if(!userToModifyId || !currentUser){
            return res.status(404).json({message:"User not found"});
        }
        else if(id===req.user._id.toString()){
           return  res.status(400).json({message:"You cannot follow yourself"});
            
        }
        const ifFollowing=currentUser.following.includes(id);
        console.log(ifFollowing);
        if (ifFollowing) {
            // Unfollow user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            return res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            return res.status(200).json({ message: "User followed successfully" });
        }
        // if(ifFollowing){
        //     await User.updateOne({$pull:{following:userToModifyId.toString()}});
        //     await userToModifyId.updateOne({$pull:{followers:currentUser._id.toString()}});
        //     res.status(200).json({message:"Unfollowed successfully"});

        // }
        // else{
        //     await currentUser.updateOne({$push:{following:userToModifyId.toString()}});
        //     await userToModifyId.updateOne({$push:{followers:currentUser._id.toString()}});
        //     res.status(200).json({message:"Followed successfully"});
        // }
    }   
    catch(err){
        return res.status(500).json({err:err.message});
        console.log("error: " + err.message);
    }
}

const updateProfile=async (req,res)=>{
    const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

		// Find all posts that this user replied and update username and userProfilePic fields
		// await Post.updateMany(
		// 	{ "replies.userId": userId },
		// 	{
		// 		$set: {
		// 			"replies.$[reply].username": user.username,
		// 			"replies.$[reply].userProfilePic": user.profilePic,
		// 		},
		// 	},
		// 	{ arrayFilters: [{ "reply.userId": userId }] }
		// );

		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
}
const getProfile=async (req,res)=>{
    // const username=req.params.id;
    const { query } = req.params;

	try {
		let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

		if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}  

}


export {signup,login,logout,followUnfollowUser,updateProfile,getProfile};