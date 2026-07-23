import nodemailer from "nodemailer";
import { User } from "../models/User.js";
import { StudySession } from "../models/StudySession.js";

// Send daily digest email to user
export async function sendDailyDigest(userEmail: string, userName: string) {
  try {
    // 1. Generate test SMTP service account from ethereal.email if no SMTP config is in env
    let transporter;
    const isMock = !process.env.SMTP_HOST;
    
    if (isMock) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    // 2. Fetch today's study stats
    const user = await User.findOne({ email: userEmail });
    const userId = user?.firebaseUid || "";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sessions = await StudySession.find({
      userId,
      startTime: { $gte: today },
    });

    const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const avgFocus = sessions.length > 0 
      ? Math.round(sessions.reduce((acc, s) => acc + (s.focusScoreSelfRated || 0), 0) / sessions.length)
      : 0;

    const hourText = (totalMinutes / 60).toFixed(1);

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4F46E5;">📈 Your VediQ Daily Study Digest</h2>
        <p>Hi ${userName},</p>
        <p>Here is your active study recap for today:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr style="background: #F3F4F6;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #E5E7EB;">Metric</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #E5E7EB;">Value</th>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">Total Study Time</td>
            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #E5E7EB; font-weight: bold;">${hourText} hours</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">Completed Sessions</td>
            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #E5E7EB; font-weight: bold;">${sessions.length} sessions</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">Average Focus Score</td>
            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #10B981;">${avgFocus}/100</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">Current Streak</td>
            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #F59E0B;">${user?.streak || 0} days</td>
          </tr>
        </table>
        <p style="margin-top: 20px; font-size: 13px; color: #6B7280; text-align: center;">Keep up the deep focus! VediQ smart alarm will pick your lightest sleep window tomorrow.</p>
      </div>
    `;

    // 3. Send Mail
    const info = await transporter.sendMail({
      from: '"VediQ AI Advisor" <advisor@VediQ.edu>',
      to: userEmail,
      subject: `📚 Daily Study Recap - ${new Date().toLocaleDateString()}`,
      html: emailHtml,
    });

    console.log(`✉️ Daily Digest email sent successfully to ${userEmail}`);
    if (isMock) {
      console.log(`🔗 Preview Sent Email: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error("❌ Failed to send daily digest email:", error);
  }
}

// Start recurring cron digests (Runs simulated check every 6 hours)
export function startCron() {
  console.log("⏰ VediQ cron scheduler initialized for study digests...");
  setInterval(async () => {
    try {
      const users = await User.find();
      for (const user of users) {
        // Send recap for users with active study sessions
        await sendDailyDigest(user.email, user.name);
      }
    } catch (e) {
      console.error("❌ Cron interval failed:", e);
    }
  }, 6 * 3600 * 1000);
}
