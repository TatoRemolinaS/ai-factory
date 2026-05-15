"use client";

import { Icon } from "./icons";

interface Step { id: string; num: string; label: string; }

interface Props {
  steps: Step[];
  currentIdx: number;
  stepDone: Record<string, boolean>;
  onJump: (i: number) => void;
}

export function Stepper({ steps, currentIdx, stepDone, onJump }: Props) {
  const lastDoneIdx = (() => {
    let lastDone = -1;
    for (let i = 0; i < steps.length; i++) {
      if (stepDone[steps[i].id]) lastDone = i;
      else break;
    }
    return lastDone;
  })();

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
                  {isDone ? <Icon.check size={12} /> : s.num}
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
