import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signUp = async(req,res,next) => {
    const session = await mongoose.startSession(); // Session of a mongoose transaction 
    session.startTransaction();

    try{
        const {name, email, password} = req.body;
         
        // Check if a user already exists
        const existingUser = await User.findOne({email}); 

        if(existingUser){
            const error = new Error('User already exist');
            error.status = 409;
            throw error; 
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);   

        // Create new user
        const newUsers = await User.create([{name, email, password: hashedPassword}], {session}); 

        const token = jwt.sign({userId: newUsers[0]._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN}); 
         
        await session.commitTransaction();
        session.endSession();
        
        res.status(201).json({
            status: true,
            message: 'User created successfully', 
            data: {
                token,
                user: newUsers[0]
            }
        });
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error); 
    }
};

export const signIn = async(req,res,next) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user || email !== user.email){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid){
            const error = new Error('Invalid Password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN}); 

        res.status(200).json({
            status: true,
            message: 'User signed in successfully', 
            data: {
                token,
                user
            }
        });
    }catch(error){
        next(error);
    }
};
 
export const signOut = async (req, res, next) => {
    try {
        // Clear the authentication token stored in cookies
        res.cookie('token', '', {
            httpOnly: true, // Prevent client-side access
            expires: new Date(0) // Expire the cookie immediately
        });

        res.status(200).json({
            status: true,
            message: 'User signed out successfully'
        });
    } catch (error) {
        next(error); // Forward errors to error middleware
    }
};
