import { connect } from "@/db.config/dbConfig";
import User from "@/app/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helper/mailer";



connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        console.log(reqBody);

        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ error: "user already exist" }, { status: 400 })
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()
        console.log(savedUser);
        //send verification email

       await sendEmail({email,emailType: "VERIFY",userID:savedUser._id})


        return NextResponse.json({ 
            message: "user registerd successfully",
            success: true,
            savedUser
         });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
