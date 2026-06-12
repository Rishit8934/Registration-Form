import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

export async function sendWelcomeEmail(name: string, email: string) {
  try {
    console.log('Attempting to send email to:', email)
    console.log('Using Gmail account:', process.env.GMAIL_USER)

    const info = await transporter.sendMail({
      from: `"Christmas Bot" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Registration Form!',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Welcome, ${name}! </h1>
          <p>Thanks for registering on Registration Form.</p>
          <p>Your account has been created successfully.</p>
          <br/>
          <p style="color: #6b7280; font-size: 14px;">The Registration Form Team</p>
        </div>
      `,
    })

    console.log('Email sent successfully:', info.messageId)
  } catch (error) {
    console.error('Email sending failed:', error)
  }
}

export async function sendPasswordResetEmail(name: string, email: string, token: string) {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password/${token}`
    const info = await transporter.sendMail({
      from: `"Christmas Bot" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Password reset request',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Password reset request</h1>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <p style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #1d4ed8; color: white; border-radius: 8px; text-decoration: none;">Reset password</a>
          </p>
          <p>If you didn&apos;t request this, you can safely ignore this email.</p>
          <p style="color: #6b7280; font-size: 14px;">The Registration Form Team</p>
        </div>
      `,
    })

    console.log('Password reset email sent successfully:', info.messageId)
  } catch (error) {
    console.error('Password reset email failed:', error)
  }
}