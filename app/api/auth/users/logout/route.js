
import { connect } from "@/db.config/dbConfig";
import User from "@/app/models/userModels";
import { NextRequest, NextResponse } from "next/server";


connect()

export async function GET(request) {
    try {
        
   const response = NextResponse.json({
       message: "Loged out successfully",
       sucess: true

    })
console.log(response);
    response.cookies.set('token','',{
        httpOnly: true,
        expires: new Date(0),
        path:"/"
    },)

   return response

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}