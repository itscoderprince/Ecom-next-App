import nodemailer from "nodemailer";

/* ---------------------------------
   1️⃣ Validate ENV (fail fast)
---------------------------------- */
const { SMTP_SERVICE, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_NAME } =
  process.env;

if (!SMTP_USER || !SMTP_PASSWORD) {
  throw new Error("SMTP configuration missing in environment variables");
}

/* ---------------------------------
   2️⃣ Create transporter ONCE
---------------------------------- */
const transporter = nodemailer.createTransport({
  service: SMTP_SERVICE,
  port: Number(SMTP_PORT) || 587,
  secure: Number(SMTP_PORT) === 465, // ✅ correct
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
});

/* ---------------------------------
   3️⃣ Send Mail Helper
---------------------------------- */
export const sendMail = async ({ to, subject, text = "", html = "" }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${SMTP_FROM_NAME || "Panda Bee"}" <${SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("📧 Email sent:", info.messageId);
    }

    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);

    // ❗ THROW, don't return response
    throw new Error("Email service unavailable");
  }
};
