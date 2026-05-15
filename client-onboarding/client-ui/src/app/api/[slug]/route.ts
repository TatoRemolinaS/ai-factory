import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

function briefPath(slug: string): string {
  const base = process.env.WORKSPACE_PATH
    ?? path.join(process.cwd(), "..", "..", "workspace", "projects");
  return path.join(base, slug, "onboarding-output.json");
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const raw = await readFile(briefPath(params.slug), "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Brief no encontrado." }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const partial = await req.json();
    const raw = await readFile(briefPath(params.slug), "utf-8");
    const data = JSON.parse(raw);

    // approval fields
    if (partial.approval) {
      Object.assign(data.approval, partial.approval);
    }

    // individual question answers
    if (Array.isArray(partial.pending_questions)) {
      for (const patch of partial.pending_questions) {
        const q = data.pending_questions.find((q: { id: string }) => q.id === patch.id);
        if (q) Object.assign(q, { answered: patch.answered, answer: patch.answer });
      }
    }

    // feature toggles
    if (partial.features && typeof partial.features === "object") {
      for (const [fid, confirmed] of Object.entries(partial.features)) {
        const f = [...data.features.mvp, ...data.features.nice_to_have].find((f: { id: string }) => f.id === fid);
        if (f) f.confirmed = confirmed;
      }
    }

    // extra users
    if (Array.isArray(partial.users_added)) {
      data.users.push(...partial.users_added);
    }

    // feeling additions
    if (typeof partial.feeling_added === "string") {
      data.design.feeling.push(partial.feeling_added);
    }

    await writeFile(briefPath(params.slug), JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
