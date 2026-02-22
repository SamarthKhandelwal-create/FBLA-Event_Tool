/**
 * POST /api/email
 *
 * Sends a formatted HTML email with the competitor's full schedule using
 * the Resend transactional email service. Expects { email, person } in the
 * request body.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface EventInfo {
  competition: string;
  type: string;
  date: string;
  checkInTime: string;
  startTime: string;
  endTime: string;
  category: string;
  rubricUrl: string;
  bizybearUrl: string | null;
  isObjectiveTest: boolean;
  competitorCount: number;
}

interface PersonPayload {
  name: string;
  school: string;
  events: EventInfo[];
}

export async function POST(request: NextRequest) {
  try {
    const { email, person } = (await request.json()) as {
      email: string;
      person: PersonPayload;
    };

    // Validate inputs
    if (!email || !person) {
      return NextResponse.json(
        { error: "Email and person data are required." },
        { status: 400 }
      );
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Ensure the Resend API key is configured
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // Build inline-styled HTML email (no external CSS for email client compat)
    const eventCards = person.events
      .map(
        (e) => `
      <div style="background:#f8f9ff;border-radius:12px;padding:20px;margin-bottom:16px;border-left:4px solid ${e.isObjectiveTest ? "#F2A900" : "#0A2E7F"};">
        <h3 style="margin:0 0 8px;color:#0A2E7F;font-size:16px;">${e.competition}</h3>
        <p style="margin:0 0 4px;color:#4A5568;font-size:14px;"><strong>Type:</strong> ${e.type}</p>
        ${
          e.isObjectiveTest
            ? `<p style="margin:0 0 4px;color:#F2A900;font-size:14px;font-weight:600;">Objective Test — go to credentialing station within your testing window</p>`
            : `
          <p style="margin:0 0 4px;color:#4A5568;font-size:14px;"><strong>Date:</strong> ${e.date}</p>
          <p style="margin:0 0 4px;color:#4A5568;font-size:14px;"><strong>Check-in:</strong> ${e.checkInTime} | <strong>Start:</strong> ${e.startTime}${e.endTime ? ` | <strong>End:</strong> ${e.endTime}` : ""}</p>
        `
        }
        <p style="margin:8px 0 4px;color:#4A5568;font-size:13px;">${e.competitorCount} other competitor${e.competitorCount !== 1 ? "s" : ""}</p>
        <div style="margin-top:12px;">
          <a href="${e.rubricUrl}" style="color:#226ADD;font-size:13px;text-decoration:underline;margin-right:16px;">View Rubric / Guidelines</a>
          ${e.bizybearUrl ? `<a href="${e.bizybearUrl}" style="color:#F2A900;font-size:13px;text-decoration:underline;">Practice Questions</a>` : ""}
        </div>
      </div>
    `
      )
      .join("");

    const htmlBody = `
    <div style="max-width:600px;margin:0 auto;font-family:'Montserrat',Arial,sans-serif;color:#2D2B2B;">
      <div style="background:#0A2E7F;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:#FFFFFF;margin:0;font-size:22px;">Ohio FBLA SLC 2026</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Your Competition Schedule</p>
      </div>
      <div style="padding:24px;background:#FFFFFF;">
        <p style="font-size:16px;color:#0A2E7F;font-weight:700;margin:0 0 4px;">${person.name}</p>
        <p style="font-size:14px;color:#4A5568;margin:0 0 20px;">${person.school} • ${person.events.length} event${person.events.length !== 1 ? "s" : ""}</p>
        ${eventCards}
      </div>
      <div style="background:#f0f2f5;padding:16px;border-radius:0 0 12px 12px;text-align:center;">
        <p style="margin:0;color:#4A5568;font-size:12px;">Good luck! — Ohio FBLA • ohfbla.org</p>
      </div>
    </div>
    `;

    const { error } = await resend.emails.send({
      from: "Ohio FBLA Events <onboarding@resend.dev>",
      to: email,
      subject: `Your SLC 2026 Schedule — ${person.name}`,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: `Email failed: ${error.message}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: `Schedule sent to ${email}!`,
    });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
