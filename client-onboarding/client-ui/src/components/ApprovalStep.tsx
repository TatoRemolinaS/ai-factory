"use client";

import type { OnboardingData, Palette, Typography, AnswerState } from "@/lib/types";
import { Icon } from "./icons";

interface ChecklistItem { label: string; done: boolean; }

interface Props {
  data: OnboardingData;
  palettes: Palette[];
  typography: Typography[];
  selectedPalette: string | null;
  selectedTypo: string | null;
  features: Record<string, boolean>;
  checklist: ChecklistItem[];
  allReady: boolean;
  notes: string;
  setNotes: (v: string) => void;
}

export function ApprovalStep({
  data, palettes, typography, selectedPalette, selectedTypo, features, checklist, allReady, notes, setNotes,
}: Props) {
  const palette = palettes.find((p) => p.id === selectedPalette);
  const typo = typography.find((t) => t.id === selectedTypo);
  const mvpKept = data.features.mvp.filter((f) => features[f.id] !== false).length;
  const niceAdded = data.features.nice_to_have.filter((f) => features[f.id] === true).length;

  return (
    <section className="section">
      <div className="step-eyebrow">
        <span className="step-eyebrow__dot"></span>
        <span>Paso 06 de 06 · Aprobación final</span>
      </div>
      <div className="section__head">
        <div className="section__num">§ 06 · Aprobar</div>
        <div>
          <h2 className="section__title">¿Listo para <span style={{ fontStyle: "normal", color: "var(--accent)" }}>fabricar</span>?</h2>
          <p className="section__sub">
            Este es el último paso. Cuando apruebes, el brief queda firmado y la fábrica entra en producción. El equipo arranca con CTO y Research en cuanto cierres esta sesión.
          </p>
        </div>
      </div>

      <div className="approval-card">
        <div className="approval-card__grid">
          <div>
            <div className="approval-card__kicker">Recap · tus decisiones</div>
            <h2 className="approval-card__title" style={{ fontSize: 48 }}>{data.project.name}</h2>
            <div style={{ display: "grid", gap: 16, marginBottom: 28, maxWidth: 420 }}>
              {palette && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,242,236,.5)", letterSpacing: "0.06em" }}>PALETA</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="mini-palette" style={{ width: 64 }}>
                      {(["primary", "secondary", "accent", "background", "text_primary"] as const).map((k) => (
                        <span key={k} className="mini-palette__dot" style={{ background: palette.colors[k], minWidth: 12 }} />
                      ))}
                    </span>
                    <span style={{ color: "var(--paper)", fontSize: 14, fontWeight: 500 }}>{palette.name}</span>
                  </span>
                </div>
              )}
              {typo && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,242,236,.5)", letterSpacing: "0.06em" }}>TIPOGRAFÍA</span>
                  <span style={{ color: "var(--paper)", fontSize: 14, fontWeight: 500 }}>{typo.name}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,242,236,.5)", letterSpacing: "0.06em" }}>MVP CONFIRMADAS</span>
                <span style={{ color: "var(--paper)", fontSize: 14, fontWeight: 500 }}>{mvpKept} de {data.features.mvp.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,242,236,.5)", letterSpacing: "0.06em" }}>EXTRAS AÑADIDAS</span>
                <span style={{ color: "var(--paper)", fontSize: 14, fontWeight: 500 }}>{niceAdded > 0 ? `+${niceAdded}` : "ninguna"}</span>
              </div>
            </div>
            <div className="approval-checks">
              {checklist.map((c, i) => (
                <div key={i} className={`approval-check ${c.done ? "is-done" : ""}`}>
                  <div className="approval-check__icon">{c.done ? <Icon.check size={12} /> : null}</div>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="approval-side">
            <div>
              <div className="notes-label">Notas opcionales · solo para tu fábrica</div>
              <textarea
                className="notes-field"
                placeholder="¿Algo que quieras que el equipo tenga presente al empezar?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ minHeight: 140 }}
              />
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(245,242,236,.45)", letterSpacing: "0.06em", lineHeight: 1.6 }}>
              Al pulsar <b style={{ color: "var(--paper)" }}>Aprobar Brief Final</b> abajo, este documento queda firmado y entra en la cola de producción. El operador ejecutará{" "}
              <code style={{ color: "rgba(245,242,236,.85)", background: "rgba(255,255,255,.08)", padding: "2px 6px", borderRadius: 4 }}>
                ./scripts/new-project.sh {data.project.slug}
              </code>{" "}
              en su terminal.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
