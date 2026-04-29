import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "Bink City <noreply@binkcity.com>";

export async function sendOrderConfirmation(email, order) {
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: "Order Confirmed - Bink City",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
          <h1 style="color: #c41230; font-size: 24px;">Order Confirmed</h1>
          <p>Your token order has been authorized and is being processed.</p>
          <div style="background: #111; border: 1px solid #1f1f1f; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>Club ID:</strong> ${order.clubGgClubId}</p>
            <p><strong>Player ID:</strong> ${order.clubGgPlayerId}</p>
            <p><strong>Tokens:</strong> ${order.tokenAmount.toLocaleString()}</p>
            <p><strong>Amount:</strong> $${(order.priceUsd / 100).toFixed(2)}</p>
          </div>
          <p style="color: #b5b5b5; font-size: 13px;">Your card will only be charged once tokens are successfully delivered. If the club or player ID is invalid, the hold will be released.</p>
          <p style="color: #b5b5b5; font-size: 12px; margin-top: 30px;">&copy; 2026 Bink City</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}

export async function sendOrderCompleted(email, order) {
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: "Tokens Delivered - Bink City",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
          <h1 style="color: #22c55e; font-size: 24px;">Tokens Delivered!</h1>
          <p>Your tokens have been successfully delivered to your ClubGG account.</p>
          <div style="background: #111; border: 1px solid #1f1f1f; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>Club ID:</strong> ${order.clubGgClubId}</p>
            <p><strong>Player ID:</strong> ${order.clubGgPlayerId}</p>
            <p><strong>Tokens Delivered:</strong> ${order.tokenAmount.toLocaleString()}</p>
            <p><strong>Charged:</strong> $${(order.priceUsd / 100).toFixed(2)}</p>
          </div>
          <p style="color: #b5b5b5; font-size: 12px; margin-top: 30px;">&copy; 2026 Bink City</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send completion email:", error);
  }
}

export async function sendOrderFailed(email, order) {
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: "Order Failed - Bink City",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
          <h1 style="color: #f87171; font-size: 24px;">Order Failed</h1>
          <p>We were unable to deliver your tokens. Your payment hold has been released and you will not be charged.</p>
          <div style="background: #111; border: 1px solid #1f1f1f; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>Club ID:</strong> ${order.clubGgClubId}</p>
            <p><strong>Player ID:</strong> ${order.clubGgPlayerId}</p>
            <p><strong>Reason:</strong> ${order.failureReason || "Unknown error"}</p>
          </div>
          <p style="color: #b5b5b5; font-size: 13px;">Please double-check your Club ID and Player ID, then try again.</p>
          <p style="color: #b5b5b5; font-size: 12px; margin-top: 30px;">&copy; 2026 Bink City</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send failure email:", error);
  }
}
