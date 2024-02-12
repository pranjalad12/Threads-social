import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectedRoutes =async (req, res, next) => {

    try{
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ message: "You are not authorized to access this route" });
            
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user=await User.findById(decoded.userId).select("-password");     ///taking out key from the cookie 
        
        req.user=user;
        next();
        
    }
    catch{
        res.status(401).json({ message: "You are not authorized to access this route" });
        console.log("error: " + err.message);
    }
    

}
export default protectedRoutes;