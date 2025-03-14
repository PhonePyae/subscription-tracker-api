import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 5,
        maxLength: 255,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    password:{
         type: String, 
         require: [true, 'Password is required'],
         minLength: 6 
    }
},
{
    timestamps: true  
}
);   

const User = mongoose.model('User', userSchema);

export default User;