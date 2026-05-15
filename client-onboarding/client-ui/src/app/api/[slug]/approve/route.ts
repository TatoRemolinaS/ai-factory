import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

function briefPath(slug: string): string {
  const base = process.env.WORKSPACE_PATH
    ?? path.join(process.cwd(), "..", "..", "workspace", "projects");
  return path.join(base, slug, "onboarding-output.json");
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json();
    const { selected_palette, selected_typography, all_answered, notes } = body;

    if (!selected_palette) return NextResponse.json({ ok: false, error: "Falta seleccionar una paleta de color." });
    if (!selected_typography) return NextResponse.json({ ok: false, error: "Falta seleccionar una combinación tipográfica." });
    if (!all_answered) return NextResponse.json({ ok: false, error: "Aún hay preguntas pendientes sin responder." });

    const raw = await readFile(briefPath(params.slug), "utf-8");
    const data = JSON.parse(raw);

    data.approval = {
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: "client",
      selected_palette,
      selected_typography,
      notes: notes ?? null,
    };

    await writeFile(briefPath(params.slug), JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
