import { Resend } from "resend";
import { env } from "@/lib/env";

interface WelcomeEmailParams {
  userId: string;
  userEmail: string;
  userName: string;
  planName: string;
}

export async function sendWelcomeEmail({
  userId,
  userEmail,
  userName,
  planName,
}: WelcomeEmailParams) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    console.warn(
      "[email] RESEND_API_KEY or EMAIL_FROM not set; skipping welcome email",
    );
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send(
    {
      from: env.EMAIL_FROM,
      to: [userEmail],
      subject: `Welcome to ${planName}`,
      html: `
        <div style="font-family: 'IBM Plex Sans', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #171717;">
          <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 16px;">Welcome to ${planName}, ${userName}</h1>
          <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px; color: #404040;">
            Your subscription is active. Advanced analytics and your new project limits are already unlocked in the dashboard.
          </p>
          <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #171717; color: #fafafa; font-size: 14px; font-weight: 500; padding: 10px 20px; text-decoration: none;">
            Go to dashboard
          </a>
        </div>
      `,
    },
    { idempotencyKey: `welcome-email/${userId}` },
  );

  if (error) {
    console.error(`[email] Failed to send welcome email: ${error.message}`);
    return;
  }
  console.log(`[email] Welcome email sent to ${userEmail} (${data?.id})`);
}
