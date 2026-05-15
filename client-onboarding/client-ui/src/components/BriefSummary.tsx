"use client";

import type { OnboardingData, Palette, Typography, AnswerState } from "@/lib/types";
import { Icon } from "./icons";

interface Props {
  data: OnboardingData;
  palettes: Palette[];
  typography: Typography[];
  selectedPalette: string | null;
  selectedTypo: string | null;
  answers: Record<string, AnswerState>;
  features: Record<string, boolean>;
}

export function BriefSummary({ data, palettes, typography, selectedPalette, selectedTypo, answers, features }: Props) {
  const palette = palettes.find((p) => p.id === selectedPalette);
  const typo = typography.find((t) => t.id === selectedTypo);
  const total = data.pending_questions.length;
  const done = data.pending_questions.filter((q) => answers[q.id]?.answered).length;
  const mvpKept = data.features.mvp.filter((f) => features[f.id] !== false).length;
  const niceAdded = data.features.nice_to_have.filter((f) => features[f.id] === true).length;

  const progressItems = [
    { done: !!selectedPalette, label: "Paleta elegida" },
    { done: !!selectedTypo, label: "Tipografía elegida" },
    { done: done === total, label: "Preguntas respondidas" },
    { done: mvpKept > 0, label: "Features revisadas" },
  ];

  return (
    <aside className="sidebar-col" style={{ height: "450px" }}>
      <div className="brief-summary">
        <div className="brief-summary__head">
          <div className="brief-summary__eyebrow">Tu brief · en vivo</div>
          <div className="brief-summary__title">{data.project.name}</div>
        </div>

        <div className="brief-row">
          <div className="brief-row__label">Paleta</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {palette ? (
              <>
                <div className="mini-palette">
                  {(["primary", "secondary", "accent", "background", "text_primary"] as const).map((k) => (
                    <div key={k} className="mini-palette__dot" style={{ background: palette.colors[k], minWidth: 14 }} />
                  ))}
                </div>
                <span className="brief-row__value" style={{ maxWidth: 110 }}>{palette.name}</span>
              </>
            ) : (
              <span className="brief-row__value is-pending">pendiente</span>
            )}
          </div>
        </div>

        <div className="brief-row">
          <div className="brief-row__label">Tipografía</div>
          <div className={`brief-row__value ${typo ? "" : "is-pending"}`} style={{ textAlign: "right" }}>
            {typo ? typo.name : "pendiente"}
          </div>
        </div>

        <div className="brief-row">
          <div className="brief-row__label">Preguntas</div>
          <div className={`brief-row__value ${done === total ? "" : "is-pending"}`}>{done} / {total}</div>
        </div>

        <div className="brief-row">
          <div className="brief-row__label">MVP</div>
          <div className="brief-row__value">{mvpKept} <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>confirmadas</span></div>
        </div>

        {niceAdded > 0 && (
          <div className="brief-row">
            <div className="brief-row__label">Extras</div>
            <div className="brief-row__value">+{niceAdded} <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>añadidas</span></div>
          </div>
        )}

        <div className="brief-progress">
          {progressItems.map((item, i) => (
            <div key={i} className={`progress-line ${item.done ? "is-done" : ""}`}>
              <div className="progress-line__icon">{item.done ? <Icon.check size={10} /> : null}</div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", textAlign: "center", letterSpacing: "0.05em" }}>
        Cada cambio se guarda automáticamente.
      </div>
    </aside>
  );
}
