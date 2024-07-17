import User from "@/app/models/userModels";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async function ({ email, userID, emailType }) {
  try {
    const hashedToken = await bcryptjs.hash(userID.toString(), 10);
    console.log("Generated hashed token:", hashedToken);

    if (emailType === "VERIFY") {
      const updatedUser = await User.findByIdAndUpdate(userID, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
        },
      });
      console.log("Updated user for verification:", updatedUser);
    } else if (emailType === "RESET") {
      const updatedUser = await User.findByIdAndUpdate(userID, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiry
        },
      });
      console.log("Updated user for password reset:", updatedUser);
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "04a076caf97c79",
        pass: "b5c61800ce8aa7",
      },
    });

    const mailOptions = {
      from: "atindriyamondal1@gmail.com",
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: `<p>Click <a href='${process.env.DOMAIN}/verifyemail?token=${hashedToken}'>here</a> to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'} or copy and paste the link below into your browser:<br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Mail response:", mailResponse);
    return mailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};
