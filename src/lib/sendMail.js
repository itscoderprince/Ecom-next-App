import nodemailer from "nodemailer";
import { catchError } from "./helperFunction";

export const sendMail = async (options) => {
  try {
    // 1️⃣ Create a transporter (SMTP configuration)
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 2️⃣ Dynamic mail options
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || "Panda Bee"}" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || "",
      html: options.html || "",
    };

    // 3️⃣ Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.log(error);
    return catchError(error)
  }
};
