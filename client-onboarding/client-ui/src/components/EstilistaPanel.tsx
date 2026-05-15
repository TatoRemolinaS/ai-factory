"use client";

import type { Palette, Typography, HistorySnapshot } from "@/lib/types";
import { Icon } from "./icons";

interface Props {
  kind: "palette" | "typo";
  selectedId: string | null;
  currentItems: (Palette | Typography)[];
  history: HistorySnapshot<Palette>[] | HistorySnapshot<Typography>[];
  historyIdx: number;
  onNavHistory: (delta: number) => void;
  regenAttempts: number;
  isRegenerating: boolean;
  onRegenerate: () => void;
}

export function EstilistaPanel({
  kind, selectedId, currentItems, history, historyIdx, onNavHistory,
  regenAttempts, isRegenerating, onRegenerate,
}: Props) {
  const reference = currentItems.find((p) => p.id === selectedId);
  const used = 3 - regenAttempts;
  const canRegen = !!selectedId && regenAttempts > 0 && !isRegenerating;
  const isAtOldest = historyIdx === 0;
  const isAtNewest = historyIdx === history.length - 1;
  const currentSnap = history[historyIdx] ?? { label: "Originales", referenceName: null };
  const kindLabel = kind === "palette" ? "paletas" : "tipografías";
  const kindLabelSingular = kind === "palette" ? "paleta" : "tipografía";

  return (
    <div className={`estilista-panel ${canRegen ? "is-active" : ""} ${regenAttempts === 0 ? "is-exhausted" : ""}`}>
      <div className="estilista-panel__left">
        <div className="estilista-panel__eyebrow">
          <span className="estilista-panel__avatar">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <circle cx="6" cy="6" r="2" fill="currentColor" />
            </svg>
          </span>
          <span>Agente · Estilista</span>
          <span className="estilista-panel__attempts">
            {regenAttempts > 0 ? `${regenAttempts} de 3 intentos disponibles` : "Sin más intentos · 0 de 3"}
          </span>

          {history.length > 1 && (
            <div className="history-nav" role="group" aria-label="Navegar generaciones">
              <button
                className="history-nav__arrow"
                onClick={() => onNavHistory(-1)}
                disabled={isAtOldest || isRegenerating}
                title="Generación anterior"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M7.5 2.5L3.5 6L7.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="history-nav__label">{currentSnap.label}</span>
              <span className="history-nav__counter">{historyIdx + 1}/{history.length}</span>
              <button
                className="history-nav__arrow"
                onClick={() => onNavHistory(1)}
                disabled={isAtNewest || isRegenerating}
                title="Generación siguiente"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 2.5L8.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="estilista-panel__title">
          {isRegenerating ? (
            <>El estilista está trabajando<span className="dots-loading"><span></span><span></span><span></span></span></>
          ) : regenAttempts === 0 ? (
            `Has agotado los intentos del estilista.`
          ) : !isAtNewest ? (
            `Viendo "${currentSnap.label}"`
          ) : (
            `¿Ninguna ${kindLabelSingular} te convence al 100%?`
          )}
        </div>

        <div className="estilista-panel__sub">
          {isRegenerating ? (
            <>Generando 3 variaciones inspiradas en <b>{reference?.name}</b>. Suele tardar unos segundos.</>
          ) : !isAtNewest ? (
            <>Estás viendo una generación pasada. Avanza con la flecha derecha para volver a la última, o selecciona una {kindLabelSingular} de esta vista para regenerar desde ella (eso descartará las posteriores).</>
          ) : selectedId ? (
            <>El estilista puede generar 3 {kindLabel} nuevas tomando <b>"{reference?.name}"</b> como referencia. Tu elección actual se mantiene en la lista.</>
          ) : (
            <>Primero selecciona una {kindLabelSingular} arriba como referencia. El estilista la usará de punto de partida.</>
          )}
        </div>

        {used > 0 && history.length > 1 && !isRegenerating && (
          <div className="estilista-panel__log">
            Historial · {used} {used === 1 ? "generación realizada" : "generaciones realizadas"} · puedes navegar entre ellas con las flechas
          </div>
        )}
      </div>

      <button
        className="btn-regen"
        disabled={!canRegen}
        onClick={onRegenerate}
        title={
          !selectedId ? `Selecciona una ${kindLabelSingular} primero` :
          regenAttempts === 0 ? "Has usado los 3 intentos disponibles" :
          isRegenerating ? "Generando…" :
          `Generar 3 ${kindLabel} inspiradas en "${reference?.name}"`
        }
      >
        {isRegenerating ? (
          <>
            <span className="btn-regen__spinner">
              <svg width="14" height="14" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" />
                <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            <span>Generando…</span>
          </>
        ) : (
          <>
            <span style={{ display: "inline-flex" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L8.2 4.8L11.5 6L8.2 7.2L7 10.5L5.8 7.2L2.5 6L5.8 4.8L7 1.5Z" fill="currentColor" />
              </svg>
            </span>
            <span>{regenAttempts === 0 ? "Sin intentos" : "Generar más"}</span>
            {regenAttempts > 0 && <span className="btn-regen__count">{regenAttempts}/3</span>}
          </>
        )}
      </button>
    </div>
  );
}
