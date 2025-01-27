import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function generateOTP(): string {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

export default async function sendMail(
  recieverEmail: string,
  recieverName: string
): Promise<string | null> {
  const otpValue = generateOTP();

  const info = await transporter.sendMail({
    from: '"LostLink.com " <afsalrahmanm25@gmail.com>',
    to: recieverEmail,
    subject: "Your LostLink 6-digit OTP",
    html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center; background-color: #f0f8ff; padding: 20px;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; border-radius: 100px">
                <img src="https://i.ibb.co/PzBDdhb/Logo-rounded.png" alt="LostLink Logo" style="max-width: 150px; margin-bottom: 20px;">
              </div>
              <h2 style="color: #007BFF;">Welcome to LostLink!</h2>
              <p style="font-size: 16px; color: #333;">Hi <strong>${recieverName}</strong>,</p>
              <p style="font-size: 16px; color: #555;">Your one-time password (OTP) for accessing LostLink is:</p>
              <div style="text-align: center; margin: 20px 0;">
                <span style="
                  font-size: 24px;
                  font-weight: bold;
                  color: #007BFF;
                  padding: 10px 20px;
                  border: 2px dashed #007BFF;
                  border-radius: 8px;
                  background-color: #e6f2ff;
                  display: inline-block;
                ">${otpValue}</span>
              </div>
              <p style="font-size: 16px; color: #555;">Please use this code within the next 10 minutes. If you didn’t request this OTP, please ignore this email.</p>
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Thank you for choosing LostLink!<br>
                <strong>LostLink Team</strong>
              </p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #aaa;">
                This email was sent to ${recieverEmail}. If you have any questions, please contact support at <a href="mailto:support@lostlink.com" style="color: #007BFF; text-decoration: none;">support@lostlink.com</a>.
              </p>
            </div>
          </div>
        `,
  });
  if (info) {
    return otpValue;
  } else {
    console.log(
      "Mail didn't send Correctly, An error occured in the sendMail.ts"
    );
    return null;
  }
}
