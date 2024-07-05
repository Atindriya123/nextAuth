import { connect } from "@/db.config/dbConfig";
import User from "@/app/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helper/mailer";



connect();

export async function POST(request){
    try {
        const reqBody = await request.json()
        const {token} = reqBody
        console.log("token");

      const user = await User.findOne({verifyToken:token,
        verifyTokenExpairy:({$gt:Date.now()})
      })

      if(!user){
        return NextResponse.json({error:"Invalid token"},{status:400})
      }

      console.log(user)

      user.isVeryfied = true
      user. verifyToken= undefined
      user. verifyTokenExpairy= undefined

      await user.save()
      return NextResponse.json({
        message: "Email Veryfied successfully",
        success: true
      },{status:500})


    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}