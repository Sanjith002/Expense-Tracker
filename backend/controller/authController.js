import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js";

const signUpController = async (req,res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !username.trim()){
            return res.status(400).json({message:"Username is empty"});
        };
        if(!email || !email.trim()){
            return res.status(400).json({message:"Email is empty"});
        };
        if(!password || !password.trim()){
            return res.status(400).json({message:"Password is empty"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        };
        const emailCheck = await User.findOne({email});
        const usernameCheck = await User.findOne({username});
        if(emailCheck){
            return res.status(400).json({message:"Email already in Database"});
        };
        if(usernameCheck){
            return res.status(400).json({message:"Username already exisits"});
        };
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password)){
            return res.status(400).json({message:"Password should contain atleast one uppercase,lowercase,number,special character and minimum 8 characters"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            username,
            email,
            password:hashedPassword
        });
        await newUser.save();
        const token = generateToken(newUser._id);
        res.status(201).json({
            token,
            user:{
                _id:newUser._id,
                username:newUser.username,
                email:newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const loginController = async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !email.trim()){
            return res.status(400).json({message:"Email is empty"})
        }
        if(!password || !password.trim()){
            return res.status(400).json({message:"Password is empty"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"User not found"})
        }
        const checkPassword = await bcrypt.compare(password,user.password);
        if(!checkPassword){
            return res.status(401).json({message:"User not found"})
        }
        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user:{
                _id:user._id,
                username:user.username,
                email:user.email
            }
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const logoutController = (req,res) => {
    try {
        res.status(200).json({message:"Logout successful!"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const getCurrentUser = async (req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export {signUpController,loginController,logoutController,getCurrentUser}