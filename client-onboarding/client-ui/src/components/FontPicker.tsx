"use client";

import { useEffect } from "react";
import type { Typography, HistorySnapshot } from "@/lib/types";
import { Icon } from "./icons";
import { EstilistaPanel } from "./EstilistaPanel";

interface Props {
  typography: Typography[];
  selected: string | null;
  onSelect: (id: string) => void;
  regenAttempts: number;
  isRegenerating: boolean;
  onRegenerate: () => void;
  history: HistorySnapshot<Typography>[];
  historyIdx: number;
  onNavHistory: (delta: number) => void;
}

export function FontPicker({ typography, selected, onSelect, regenAttempts, isRegenerating, onRegenerate, history, historyIdx, onNavHistory }: Props) {
  useEffect(() => {
    const allOptions = history.flatMap((h) => h.items);
    allOptions.forEach((t) => {
      [t.heading?.google_fonts_url, t.body?.google_fonts_url].forEach((url) => {
        if (url && !document.querySelector(`link[href="${url}"]`)) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = url;
          document.head.appendChild(link);
        }
      });
    });
  }, [history]);

  return (
    <section className="section" id="section-tipografia">
      <div className="section__head">
        <div className="section__num">§ 03 · Tipografía</div>
        <div>
          <h2 className="section__title">¿Cómo lee tu producto?</h2>
          <p className="section__sub">
            Cada opción combina un titular y un cuerpo. Pasa la mirada por el preview — eso es lo que el usuario verá en pantalla. Si quieres explorar más direcciones, el estilista puede generar nuevas combinaciones.
          </p>
        </div>
      </div>

      <div className={`font-cards ${isRegenerating ? "is-regenerating" : ""}`}>
        {typography.map((t) => (
          <FontCard key={t.id} typo={t} isSelected={selected === t.id} onClick={() => !isRegenerating && onSelect(t.id)} />
        ))}
      </div>

      <EstilistaPanel
        kind="typo"
        selectedId={selected}
        currentItems={typography}
        history={history}
        historyIdx={historyIdx}
        onNavHistory={onNavHistory}
        regenAttempts={regenAttempts}
        isRegenerating={isRegenerating}
        onRegenerate={onRegenerate}
      />
    </section>
  );
}

function FontCard({ typo, isSelected, onClick }: { typo: Typography; isSelected: boolean; onClick: () => void }) {
  const headStyle = { fontFamily: `"${typo.heading.family}", serif`, fontWeight: typo.heading.weight };
  const bodyStyle = { fontFamily: `"${typo.body.family}", sans-serif`, fontWeight: typo.body.weight };
  return (
    <div className={`font-card ${isSelected ? "is-selected" : ""}`} onClick={onClick}>
      <div className="font-card__head">
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", minWidth: 0, flex: 1 }}>
          <div className="font-card__name">{typo.name}</div>
          {typo.recommended && <span className="pill pill--accent">Recomendada</span>}
        </div>
        <div className="palette-card__check"><Icon.check size={14} /></div>
      </div>
      <div className="font-card__families">
        Titular <b style={{ color: "var(--ink)" }}>{typo.heading.family}</b> · Cuerpo <b style={{ color: "var(--ink)" }}>{typo.body.family}</b>
      </div>
      <div className="font-card__heading-preview" style={headStyle}>Tu proyecto, tu visión</div>
      <div className="font-card__body-preview" style={bodyStyle}>
        El texto de tu aplicación se verá así. Claro, legible y profesional. Cada palabra encuentra su ritmo, cada párrafo respira.
      </div>
      <div className="font-card__rationale">{typo.rationale}</div>
    </div>
  );
}
