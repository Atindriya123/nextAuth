import { connect } from "@/db.config/dbConfig";
import User from "@/app/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"




connect();


export async function POST(request) {
    try {

        const reqBody = await request.json()
        const { username, email } = reqBody
        console.log(reqBody)

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ error: "user doesnot exist" }, { status: 400 });
            console.log('user exist');
        }

        const validPassword = bcryptjs.compare(password, user.password)

        if (!validPassword) {
            return NextResponse.json({ error: "check your credentials" }, { status: 500 });
        }

        const tokenPayload = {
            user: user._id,
            username: user.username,
            email: user.email
        }

        const token = await jwt.sign(tokenPayload, process.env.TOKEN_SECRET, { expiresIn: '1d' })

        const response = NextRequest.json({
            message: "Logged in successfully",
            success: true
        })

        response.cookies.set({
            httpOnly: true
        })

        return response

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}