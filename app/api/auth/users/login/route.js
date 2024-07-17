import { connect } from "@/db.config/dbConfig";
import User from "@/app/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    if (!email || !password) {
      return new NextResponse(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User does not exist');
      return new NextResponse(JSON.stringify({ error: "User does not exist" }), { status: 400 });
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return new NextResponse(JSON.stringify({ error: "Check your credentials" }), { status: 400 });
    }

    const tokenPayload = {
      user: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET, { expiresIn: '1d' });

    const response = new NextResponse(JSON.stringify({
      message: "Logged in successfully",
      success: true,
    }), { status: 200 });

    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}` // 1 day
    );

    return response;

  } catch (error) {
    console.error("Error during login process:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
