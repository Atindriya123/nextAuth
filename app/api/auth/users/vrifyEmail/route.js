import { connect } from "@/db.config/dbConfig";
import User from "@/app/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log("Received token:", token);

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired token");
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    console.log("Found user:", user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        message: "Email Verified successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during verification process:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
