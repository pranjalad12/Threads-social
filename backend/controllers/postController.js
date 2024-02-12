import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import { v2 as cloudinary } from "cloudinary";


const createPosts=async (req,res)=>{
    try{
       const {postedBy, text}=req.body;
       let { img } = req.body;
       if(!postedBy || !text){
           return res.status(400).json({message:'Please fill all fields'});
       }
       const user = await User.findOne({_id:postedBy });
         if(!user){
             return  res.status(400).json({message:'User does not exist'});
         }
         if(user._id.toString() !== req.user._id.toString()){
            return  res.status(401).json({message:'Unauthorized'});
         }
            const maxLen=500;
            if(text.length > maxLen){
                return res.status(400).json({message:'Text length should be less than 500'});
            }
            if (img) {
                const uploadedResponse = await cloudinary.uploader.upload(img);
                img = uploadedResponse.secure_url;
            }
         const post = new Post({
                postedBy,
                text,
                img
            });
            await post.save();
            res.status(201).json({message:'Post created successfully'});

    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}
const getPosts=async (req,res)=>{
    try{
        const id=req.params.id;
        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json({message:'Post not found'});
        }
        return res.status(200).json({post});
    }   
    catch(err){
        return res.status(500).json({err:err.message});
    }
}
const delPosts=async (req,res)=>{
    try{
        const PostId=req.params.id;
        const post = await Post.findById(PostId);
        if(!post){
            return res.status(404).json({message:'Post not found'});
        }
        if(PostId === req.user._id) {
            return res.status(404).json({message});
        }
        await Post.findByIdAndDelete(PostId);
        return res.status(200).json({message:'Post deleted successfully'});
    }
    catch{
        return  res.status(500).json({err:err.message});
    }
}
const likeUnlikePosts=async (req,res)=>{
   try{
    const postId=req.params.id;
    const userId=req.user._id;
    const post = await Post.findById(postId);
    if(!post){
        return res.status(404).json({message:'Post not found'});
    }
    const liked=post.likes.includes(userId);
    if(liked){
        await post.updateOne({$pull:{likes:userId}});
        return res.status(200).json({message:'Post unliked successfully'});
    }
    else{
        post.likes.push(userId);
        await post.save();
        return res.status(200).json({message:'Post liked successfully'});
    }

   }
    catch(err){
        return res.status(500).json({err:err.message});
    }
}
const reply=async(req,res)=>{
    try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		return res.status(200).json(reply);
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
}
const getFeedPosts=async(req,res)=>{
    try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        return	res.status(200).json(feedPosts);
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
}
const getUserPosts=async(req,res)=>{
    const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
export {createPosts,getPosts,delPosts,likeUnlikePosts,reply,getFeedPosts,getUserPosts};