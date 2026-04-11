import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";

const RESUME_LIMIT = 3;

function createServerPb(): PocketBase {
  return new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
}

// ─── POST /api/resumes ────────────────────────────────────────────────────────
// Creates or updates a resume. Enforces a limit of RESUME_LIMIT resumes per user.
//
// Body (JSON):
//   name, headline, email, phone, location, title, summary,
//   skills, languages, socialLinks, experiences, educations
//   existingResumeId?  — update this resume (no limit check)
//   overwriteResumeId? — replace this resume's data (no limit check, used when at limit)
//
// Responses:
//   200 { resumeId }
//   409 { code: "RESUME_LIMIT_REACHED", message, resumes: [{id,title,updated}] } (oldest first)
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Extract auth token from the client's PocketBase session
  const token = request.headers.get("Authorization")?.replace("Bearer ", "").trim();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Verify token and get user identity via PocketBase
  const pb = createServerPb();
  pb.authStore.save(token, null);

  let userId: string;
  try {
    const { record } = await pb.collection("users").authRefresh();
    if (record.role !== "candidate") {
      return NextResponse.json({ error: "Forbidden: only candidates can save resumes" }, { status: 403 });
    }
    userId = record.id;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. Parse request body
  let body: {
    name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    skills: unknown[];
    languages: unknown[];
    socialLinks: unknown[];
    experiences: unknown[];
    educations: unknown[];
    existingResumeId?: string;
    overwriteResumeId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { existingResumeId, overwriteResumeId, ...data } = body;
  const targetResumeId = existingResumeId || overwriteResumeId;

  // 4. Enforce limit — only when creating a new resume (no targetResumeId)
  if (!targetResumeId) {
    const existing = await pb.collection("resumes").getFullList({
      filter: `user="${userId}"`,
      fields: "id,title,updated",
      sort: "+updated", // oldest first — the client uses [0] as the overwrite candidate
    });

    if (existing.length >= RESUME_LIMIT) {
      return NextResponse.json(
        {
          code: "RESUME_LIMIT_REACHED",
          message: `Você já atingiu o limite de ${RESUME_LIMIT} currículos.`,
          resumes: existing,
        },
        { status: 409 }
      );
    }
  }

  // 5. Save: create or update the resume record
  try {
    let resumeId: string;

    if (targetResumeId) {
      // Update — PocketBase rules ensure the user owns this resume
      await pb.collection("resumes").update(targetResumeId, {
        name: data.name,
        headline: data.headline,
        email: data.email,
        phone: data.phone,
        location: data.location,
        title: data.title,
        summary: data.summary,
        skills: data.skills,
        languages: data.languages,
        socialLinks: data.socialLinks,
      });
      resumeId = targetResumeId;
    } else {
      // Create new
      const resume = await pb.collection("resumes").create({
        user: userId,
        name: data.name,
        headline: data.headline,
        email: data.email,
        phone: data.phone,
        location: data.location,
        title: data.title,
        summary: data.summary,
        layout: { template: "classic", color: "#2f5fa3", font: "--font-roboto", size: "medium" },
        skills: data.skills,
        languages: data.languages,
        socialLinks: data.socialLinks,
        isDefault: true,
        isPublic: true,
      });
      resumeId = resume.id;
    }

    // Upsert experience record
    try {
      const exp = await pb.collection("resume_experience").getFirstListItem(`resume="${resumeId}"`);
      await pb.collection("resume_experience").update(exp.id, { experiences: data.experiences });
    } catch {
      await pb.collection("resume_experience").create({ resume: resumeId, experiences: data.experiences });
    }

    // Upsert education record
    try {
      const edu = await pb.collection("resume_education").getFirstListItem(`resume="${resumeId}"`);
      await pb.collection("resume_education").update(edu.id, { educations: data.educations });
    } catch {
      await pb.collection("resume_education").create({ resume: resumeId, educations: data.educations });
    }

    return NextResponse.json({ resumeId }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/resumes] Failed to save resume:", error);
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }
}
