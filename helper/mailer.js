import User from "@/app/models/userModels";
import nodemailer from "nodemailer";

export const sendEmail = async function ({ email, userID, emailType }) {
    try {
        const hashedToken = await bcryptjs.hash(userID.toString(), 10)


        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userID,
                { verifyToken: hashedToken, verifyTokenExpairy: Date.now() + 3600000 })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userID,
                { forgotPasswordToken: hashedToken, forgotPasswordTokenExpairy: Date.now() + 3600000 })
        }




        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "04a076caf97c79",
                pass: "b5c61800ce8aa7"
            }
        });

        const mailOption = {
            from: "atindriyamondal1@gmail.com",
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
            html: ` <p>Click<a href='${process.env.DOMAIN}/verifyemail?token=${hashedToken}'>Here</a>to ${emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password'}or copy and paste the link below the browser<br>${process.env.DOMAIN}/verifyemail?token${hashedToken}   </p>`, // HTML body
        };

        const mailResponse = await transporter.sendMail(mailOption);
        return mailResponse;

    } catch (error) {
        console.error("Error sending email:", error);
    }
};
