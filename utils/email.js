import { SMTP_USER, SMTP_PASS, SMTP_PORT } from "../config/env.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"MPos <${SMTP_USER}>"`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    const error = new Error(`Email failed: ${err}`);
    error.statusCode = 404;
    throw error;
  }
};
