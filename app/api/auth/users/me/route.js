

import { NextRequest, NextResponse } from "next/server";


import { tokenData } from "@/helper/tokenData";
import User from "@/app/models/userModels";
import { connect } from "@/db.config/dbConfig";

connect()

export async function GET(request){

    try {
        const userId = await tokenData(request)
        const user = await User.findOne({id:userId}).select("-password")
        return NextResponse.json({
            mesaaage: "User found",
            data: user
        })
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}