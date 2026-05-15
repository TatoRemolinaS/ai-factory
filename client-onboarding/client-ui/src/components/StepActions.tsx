"use client";

import { Icon } from "./icons";

interface Step { id: string; num: string; label: string; }

interface Props {
  currentIdx: number;
  steps: Step[];
  stepDone: Record<string, boolean>;
  onPrev: () => void;
  onNext: () => void;
  onApprove: () => void;
  allReady: boolean;
  isSubmitting: boolean;
}

export function StepActions({ currentIdx, steps, stepDone, onPrev, onNext, onApprove, allReady, isSubmitting }: Props) {
  const isLast = currentIdx === steps.length - 1;
  const currentStep = steps[currentIdx];
  const canAdvance = stepDone[currentStep.id];

  return (
    <div className="step-actions">
      <div className="step-actions__inner">
        <button className="btn-step btn-step--ghost" onClick={onPrev} disabled={currentIdx === 0}>
          <span style={{ display: "inline-flex", transform: "scaleX(-1)" }}><Icon.arrow size={14} /></span>
          <span>Anterior</span>
        </button>

        <div className="step-actions__center">
          <span>Paso {currentIdx + 1} de {steps.length}</span>
          <div className="step-dots">
            {steps.map((s, i) => (
              <span
                key={s.id}
                className={`step-dots__dot ${i === currentIdx ? "is-current" : ""} ${stepDone[s.id] && i !== currentIdx ? "is-done" : ""}`}
              />
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
            <Icon.arrow size={14} />
          </button>
        ) : (
          <button
            className="btn-step btn-step--next"
            onClick={onNext}
            disabled={!canAdvance}
            title={canAdvance ? "Continuar al siguiente paso" : "Completa este paso antes de continuar"}
          >
            <span>Siguiente</span>
            <span className="arrow-circle"><Icon.arrow size={12} /></span>
          </button>
        )}
      </div>
    </div>
  );
}
