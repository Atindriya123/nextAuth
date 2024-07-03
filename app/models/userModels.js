import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true,"Plese provide username"]

    },
    email: {
        type: String,
        required: true,
        unique: [true,"Plese provide email"]

    },
    password: {
        type: String,
        required: true,
        unique: [true,"Plese provide password"]

    },
    isVeryfied:{
        type: Boolian,
        default: false,
    },
    isAdmin:{
        type: Boolian,
        default: false,
    },
    isVeryfiedToken:{
        type: Boolian,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpairy: Date,
    verifyToken: String,
    verifyTokenExpairy: Date,
})
   

const User = mongoose.model("users",userSchema);


 export default User;