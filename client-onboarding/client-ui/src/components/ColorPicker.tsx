"use client";

import type { Palette, HistorySnapshot } from "@/lib/types";
import { Icon } from "./icons";
import { EstilistaPanel } from "./EstilistaPanel";

interface Props {
  palettes: Palette[];
  selected: string | null;
  onSelect: (id: string) => void;
  regenAttempts: number;
  isRegenerating: boolean;
  onRegenerate: () => void;
  history: HistorySnapshot<Palette>[];
  historyIdx: number;
  onNavHistory: (delta: number) => void;
}

const COLOR_ORDER = ["primary", "secondary", "accent", "background", "surface", "text_primary", "text_secondary"] as const;

export function ColorPicker({ palettes, selected, onSelect, regenAttempts, isRegenerating, onRegenerate, history, historyIdx, onNavHistory }: Props) {
  return (
    <section className="section" id="section-colores">
      <div className="section__head">
        <div className="section__num">§ 02 · Paleta</div>
        <div>
          <h2 className="section__title">Elige una <span style={{ fontStyle: "normal", color: "var(--accent)" }}>dirección</span> de color.</h2>
          <p className="section__sub">
            Cuatro paletas pensadas para el proyecto. La recomendada equilibra calidez con claridad; las otras son alternativas legítimas. Si ninguna te convence del todo, el estilista puede generar más usando una como referencia.
          </p>
        </div>
      </div>

      <div className={`cards-grid ${isRegenerating ? "is-regenerating" : ""}`}>
        {palettes.map((p) => (
          <PaletteCard key={p.id} palette={p} isSelected={selected === p.id} onClick={() => !isRegenerating && onSelect(p.id)} />
        ))}
      </div>

      <EstilistaPanel
        kind="palette"
        selectedId={selected}
        currentItems={palettes}
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

function PaletteCard({ palette, isSelected, onClick }: { palette: Palette; isSelected: boolean; onClick: () => void }) {
  return (
    <div className={`palette-card ${isSelected ? "is-selected" : ""}`} onClick={onClick}>
      <div className="palette-card__head">
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", minWidth: 0, flex: 1 }}>
          <div className="palette-card__name">{palette.name}</div>
          {palette.recommended && <span className="pill pill--accent">Recomendada</span>}
        </div>
        <div className="palette-card__check"><Icon.check size={14} /></div>
      </div>
      <div className="swatch-bar">
        {COLOR_ORDER.map((k) => (
          <div key={k} className="swatch" style={{ background: palette.colors[k] }}>
            <span className="swatch__label">{palette.colors[k].toUpperCase()} · {k}</span>
          </div>
        ))}
      </div>
      <div className="palette-rationale">{palette.rationale}</div>
    </div>
  );
}
