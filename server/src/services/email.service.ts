import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string, name: string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"SmartX Finance" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your SmartX Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#0f0a28;font-family:'Segoe UI',sans-serif;">
        <div style="max-width:520px;margin:40px auto;background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.1));border:1px solid rgba(124,58,237,0.3);border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#7c3aed,#3b82f6);padding:32px;text-align:center;">
            <div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;color:white;line-height:48px;">$</div>
            <h1 style="color:white;margin:0;font-size:24px;font-weight:700;">SmartX Finance</h1>
          </div>
          <div style="padding:40px 32px;">
            <h2 style="color:white;margin:0 0 8px;font-size:20px;">Hi ${name}! 👋</h2>
            <p style="color:rgba(255,255,255,0.7);margin:0 0 24px;line-height:1.6;">
              We received a request to reset your SmartX password. Click the button below to create a new password. This link expires in <strong style="color:white;">15 minutes</strong>.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:white;text-decoration:none;border-radius:10px;font-weight:600;font-size:16px;">
                Reset My Password
              </a>
            </div>
            <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin:0;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
            <div style="margin-top:24px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);">
              <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">
                Or copy this link: <span style="color:rgba(124,58,237,0.8);word-break:break-all;">${resetUrl}</span>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
