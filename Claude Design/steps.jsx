/* Step navigation + approval step content for the wizard flow.
   Depends on Icon (from sections.jsx). Publishes to window. */

const { useState: useStateStep } = React;

/* ---------- ESTILISTA PANEL (shared by ColorPicker + FontPicker) ---------- */
function EstilistaPanel({
  kind,                  // "palette" | "typo"
  selectedId,
  currentItems,
  history,
  historyIdx,
  onNavHistory,
  regenAttempts,
  isRegenerating,
  onRegenerate,
}) {
  const reference = currentItems.find((p) => p.id === selectedId);
  const used = 3 - regenAttempts;
  const canRegen = !!selectedId && regenAttempts > 0 && !isRegenerating;

  const isAtOldest = historyIdx === 0;
  const isAtNewest = historyIdx === history.length - 1;
  const currentSnap = history[historyIdx] || { label: "Originales", referenceName: null };

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
            {regenAttempts > 0
              ? `${regenAttempts} de 3 intentos disponibles`
              : "Sin más intentos · 0 de 3"}
          </span>

          {history.length > 1 && (
            <div className="history-nav" role="group" aria-label="Navegar generaciones">
              <button
                className="history-nav__arrow"
                onClick={() => onNavHistory(-1)}
                disabled={isAtOldest || isRegenerating}
                title="Generación anterior"
                aria-label="Anterior"
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
                aria-label="Siguiente"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 2.5L8.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="estilista-panel__title">
          {isRegenerating
            ? <>El estilista está trabajando<span className="dots-loading"><span></span><span></span><span></span></span></>
            : regenAttempts === 0
              ? `Has agotado los intentos del estilista.`
              : !isAtNewest
                ? `Viendo "${currentSnap.label}"`
                : `¿Ninguna ${kindLabelSingular} te convence al 100%?`}
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
          !isAtNewest ? `Regenerar desde "${reference?.name}" descartará las generaciones futuras` :
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
                <path d="M7 1.5L8.2 4.8L11.5 6L8.2 7.2L7 10.5L5.8 7.2L2.5 6L5.8 4.8L7 1.5Z" fill="currentColor"/>
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

/* ---------- STEPPER ---------- */
function Stepper({ steps, currentIdx, stepDone, onJump }) {
  // The fill bar visualizes overall progress through completed steps.
  const lastDoneIdx = (() => {
    let lastDone = -1;
    for (let i = 0; i < steps.length; i++) {
      if (stepDone[steps[i].id]) lastDone = i;
      else break;
    }
    return lastDone;
  })();
  // Fill should connect step circle centers proportionally.
  const railSegments = steps.length - 1;
  const filledSegments = Math.max(0, Math.min(railSegments, Math.max(currentIdx, lastDoneIdx + 1)));
  const fillPct = railSegments === 0 ? 0 : (filledSegments / railSegments) * 100;

  return (
    <div className="stepper">
      <div className="stepper__inner">
        <div className="stepper__rail">
          <div className="stepper__rail-fill" style={{ width: `${fillPct}%` }}></div>
        </div>
        <div className="stepper__items">
          {steps.map((s, i) => {
            const isCurrent = i === currentIdx;
            const isDone = stepDone[s.id] && !isCurrent;
            const isPast = i < currentIdx;
            // Allow jumping to any visited step or any step that's already done.
            const canJump = isPast || isDone || isCurrent;
            return (
              <button
                key={s.id}
                className={`step-item ${isCurrent ? "is-current" : ""} ${isDone ? "is-done" : ""} ${!canJump ? "is-locked" : ""}`}
                onClick={() => canJump && onJump(i)}
                style={{ background: "transparent", border: "none" }}
                aria-current={isCurrent ? "step" : undefined}
              >
                <div className="step-item__num">
                  {isDone ? Icon.check({ size: 12 }) : s.num}
                </div>
                <div className="step-item__label">{s.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- STEP ACTIONS BAR ---------- */
function StepActions({ currentIdx, steps, stepDone, onPrev, onNext, onApprove, allReady, isSubmitting }) {
  const isLast = currentIdx === steps.length - 1;
  const currentStep = steps[currentIdx];
  const canAdvance = stepDone[currentStep.id];

  return (
    <div className="step-actions">
      <div className="step-actions__inner">
        <button
          className="btn-step btn-step--ghost"
          onClick={onPrev}
          disabled={currentIdx === 0}
        >
          <span style={{ display: "inline-flex", transform: "scaleX(-1)" }}>{Icon.arrow({ size: 14 })}</span>
          <span>Anterior</span>
        </button>

        <div className="step-actions__center">
          <span>Paso {currentIdx + 1} de {steps.length}</span>
          <div className="step-dots">
            {steps.map((s, i) => (
              <span
                key={s.id}
                className={`step-dots__dot ${i === currentIdx ? "is-current" : ""} ${stepDone[s.id] && i !== currentIdx ? "is-done" : ""}`}
              ></span>
            ))}
          </div>
          <span style={{ color: "var(--ink)" }}>{currentStep.label}</span>
        </div>

        {isLast ? (
          <button
            className="btn-step btn-step--approve"
            onClick={onApprove}
            disabled={!allReady || isSubmitting}
            title={allReady ? "Aprobar y enviar a fábrica" : "Completa todos los pasos antes de aprobar"}
          >
            {isSubmitting ? "Enviando…" : "Aprobar Brief Final"}
            {Icon.arrow({ size: 14 })}
          </button>
        ) : (
          <button
            className="btn-step btn-step--next"
            onClick={onNext}
            disabled={!canAdvance}
            title={canAdvance ? "Continuar al siguiente paso" : "Completa este paso antes de continuar"}
          >
            <span>Siguiente</span>
            <span className="arrow-circle">{Icon.arrow({ size: 12 })}</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- APPROVAL STEP CONTENT ---------- */
function ApprovalStep({ data, palettes, typography, selectedPalette, selectedTypo, features, checklist, allReady, notes, setNotes }) {
  const allPalettes = palettes || data.design.palettes;
  const allTypos = typography || data.design.typography;
  const palette = allPalettes.find((p) => p.id === selectedPalette);
  const typo = allTypos.find((t) => t.id === selectedTypo);
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
          <h2 className="section__title">¿Listo para <em style={{ fontStyle: "normal", color: "var(--accent)" }}>fabricar</em>?</h2>
          <p className="section__sub">Este es el último paso. Cuando apruebes, el brief queda firmado y la fábrica entra en producción. El equipo arranca con CTO y Research en cuanto cierres esta sesión.</p>
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
                      {["primary", "secondary", "accent", "background", "text_primary"].map((k) => (
                        <span key={k} className="mini-palette__dot" style={{ background: palette.colors[k], minWidth: 12 }}></span>
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
                  <div className="approval-check__icon">{c.done ? Icon.check({ size: 12 }) : null}</div>
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
              ></textarea>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(245,242,236,.45)", letterSpacing: "0.06em", lineHeight: 1.6 }}>
              Al pulsar <b style={{ color: "var(--paper)" }}>Aprobar Brief Final</b> abajo, este documento queda firmado y entra en la cola de producción. El operador ejecutará <code style={{ color: "rgba(245,242,236,.85)", background: "rgba(255,255,255,.08)", padding: "2px 6px", borderRadius: 4 }}>./scripts/new-project.sh {data.project.slug}</code> en su terminal.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- STEP HEADER (eyebrow shown at top of each step) ---------- */
function StepEyebrow({ idx, total, label }) {
  return (
    <div className="step-eyebrow">
      <span className="step-eyebrow__dot"></span>
      <span>Paso {String(idx + 1).padStart(2, "0")} de {String(total).padStart(2, "0")} · {label}</span>
    </div>
  );
}

/* ---------- export ---------- */
Object.assign(window, { Stepper, StepActions, ApprovalStep, StepEyebrow, EstilistaPanel });
