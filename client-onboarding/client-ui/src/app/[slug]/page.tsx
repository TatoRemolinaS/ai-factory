"use client";

import { useMemo, useState } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Hero } from "@/components/Hero";
import { ProjectSummary } from "@/components/ProjectSummary";
import { ColorPicker } from "@/components/ColorPicker";
import { FontPicker } from "@/components/FontPicker";
import { PendingQuestions } from "@/components/PendingQuestions";
import { FeatureCards } from "@/components/FeatureCards";
import { BriefSummary } from "@/components/BriefSummary";
import { ApprovalStep } from "@/components/ApprovalStep";
import { Stepper } from "@/components/Stepper";
import { StepActions } from "@/components/StepActions";
import { Icon, Spinner } from "@/components/icons";

const STEPS = [
  { id: "summary",   num: "01", label: "Resumen" },
  { id: "palette",   num: "02", label: "Color" },
  { id: "typo",      num: "03", label: "Tipografía" },
  { id: "questions", num: "04", label: "Preguntas" },
  { id: "features",  num: "05", label: "Alcance" },
  { id: "approve",   num: "06", label: "Aprobar" },
];

export default function OnboardingPage({ params }: { params: { slug: string } }) {
  const h = useOnboarding(params.slug);

  if (h.loadError) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 48, marginBottom: 8 }}>No pudimos cargar.</div>
          <div style={{ color: "var(--ink-2)", marginBottom: 18 }}>{h.loadError}</div>
          <button className="btn btn--primary" onClick={() => location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  if (!h.data) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.1em" }}>
          CARGANDO BRIEF · {params.slug}
        </div>
      </div>
    );
  }

  if (h.approved) {
    return (
      <SuccessScreen
        data={h.data}
        palettes={h.allPalettes}
        typography={h.allTypos}
        selectedPalette={h.selectedPalette}
        selectedTypo={h.selectedTypo}
        features={h.features}
        approvedAt={h.approvedAt}
      />
    );
  }

  const step = STEPS[h.stepIdx];

  const renderStepContent = () => {
    switch (step.id) {
      case "summary":
        return (
          <>
            <StepEyebrow idx={h.stepIdx} total={STEPS.length} label={step.label} />
            <Hero data={h.data!} />
            <div style={{ height: 64 }} />
            <ProjectSummary
              data={h.data!}
              extraUsers={h.extraUsers}
              onAddUser={h.onAddUser}
              onRemoveUser={h.onRemoveUser}
              extraFeelings={h.extraFeelings}
              onAddFeeling={h.onAddFeeling}
              onRemoveFeeling={h.onRemoveFeeling}
            />
          </>
        );
      case "palette":
        return (
          <>
            <StepEyebrow idx={h.stepIdx} total={STEPS.length} label={step.label} />
            <ColorPicker
              palettes={h.currentPalettes}
              selected={h.selectedPalette}
              onSelect={h.onSelectPalette}
              regenAttempts={h.paletteRegenAttempts}
              isRegenerating={h.isRegeneratingPalette}
              onRegenerate={h.handleRegeneratePalette}
              history={h.paletteHistory}
              historyIdx={h.paletteHistoryIdx}
              onNavHistory={h.navPaletteHistory}
            />
          </>
        );
      case "typo":
        return (
          <>
            <StepEyebrow idx={h.stepIdx} total={STEPS.length} label={step.label} />
            <FontPicker
              typography={h.currentTypos}
              selected={h.selectedTypo}
              onSelect={h.onSelectTypo}
              regenAttempts={h.typoRegenAttempts}
              isRegenerating={h.isRegeneratingTypo}
              onRegenerate={h.handleRegenerateTypo}
              history={h.typoHistory}
              historyIdx={h.typoHistoryIdx}
              onNavHistory={h.navTypoHistory}
            />
          </>
        );
      case "questions":
        return (
          <>
            <StepEyebrow idx={h.stepIdx} total={STEPS.length} label={step.label} />
            <PendingQuestions data={h.data!} answers={h.answers} onAnswer={h.onAnswer} />
          </>
        );
      case "features":
        return (
          <>
            <StepEyebrow idx={h.stepIdx} total={STEPS.length} label={step.label} />
            <FeatureCards data={h.data!} features={h.features} onToggle={h.onToggleFeature} />
          </>
        );
      case "approve":
        return (
          <ApprovalStep
            data={h.data!}
            palettes={h.allPalettes}
            typography={h.allTypos}
            selectedPalette={h.selectedPalette}
            selectedTypo={h.selectedTypo}
            features={h.features}
            checklist={h.checklist}
            allReady={h.allReady}
            notes={h.notes}
            setNotes={h.setNotes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar__inner">
          <div className="brand">
            <div className="brand__mark" />
            <span className="brand__name">AI Factory</span>
            <span className="brand__dot" />
            <span className="brand__meta">CLIENT ONBOARDING · /{h.data.project.slug}</span>
          </div>
          <div className="topbar__right">
            <span className={`save-state ${h.saveState === "saving" ? "is-saving" : ""} ${h.saveState === "saved" ? "is-saved" : ""}`}>
              {h.saveState === "saving" && <><Spinner /> Guardando…</>}
              {h.saveState === "saved" && <><Icon.check size={11} /> Guardado</>}
              {h.saveState === "idle" && <>· Cambios en vivo</>}
            </span>
            <span className="session-pill">
              <span className="session-pill__dot" /> Sesión activa
            </span>
          </div>
        </div>
      </div>

      <Stepper steps={STEPS} currentIdx={h.stepIdx} stepDone={h.stepDone} onJump={h.jumpTo} />

      <div className="main-grid">
        <div className="content-col">
          <div className="step-content" key={h.stepIdx}>
            {renderStepContent()}
          </div>
        </div>
        <BriefSummary
          data={h.data}
          palettes={h.allPalettes}
          typography={h.allTypos}
          selectedPalette={h.selectedPalette}
          selectedTypo={h.selectedTypo}
          answers={h.answers}
          features={h.features}
        />
      </div>

      <StepActions
        currentIdx={h.stepIdx}
        steps={STEPS}
        stepDone={h.stepDone}
        onPrev={h.goPrev}
        onNext={h.goNext}
        onApprove={h.handleApproveClick}
        allReady={h.allReady}
        isSubmitting={h.submitting}
      />

      {h.modalOpen && (
        <div className="modal-backdrop" onClick={() => h.setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">¿Confirmas aprobar este brief?</h2>
            <p className="modal__body">
              Una vez aprobado, <b>{h.data.project.name}</b> entra en la cola de producción de la fábrica. Cualquier cambio posterior tendría que pasar por una nueva sesión.
            </p>
            {h.modalError && (
              <div style={{ background: "var(--warn-soft)", color: "var(--warn)", padding: "12px 14px", borderRadius: "var(--r-md)", fontSize: 13, marginBottom: 18 }}>
                {h.modalError}
              </div>
            )}
            <div className="modal__actions">
              <button className="btn btn--ghost" onClick={() => h.setModalOpen(false)}>Aún no</button>
              <button className="btn btn--primary" onClick={h.handleConfirmApprove} disabled={h.submitting}>
                {h.submitting ? "Aprobando…" : "Sí, aprobar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {h.toast && (
        <div className={`toast toast--${h.toast.kind}`}>
          {h.toast.kind === "error" ? <Icon.x size={12} /> : <Icon.check size={12} />}
          {h.toast.message}
        </div>
      )}
    </div>
  );
}

function StepEyebrow({ idx, total, label }: { idx: number; total: number; label: string }) {
  return (
    <div className="step-eyebrow">
      <span className="step-eyebrow__dot" />
      <span>Paso {String(idx + 1).padStart(2, "0")} de {String(total).padStart(2, "0")} · {label}</span>
    </div>
  );
}

function SuccessScreen({ data, palettes, typography, selectedPalette, selectedTypo, features, approvedAt }: {
  data: import("@/lib/types").OnboardingData;
  palettes: import("@/lib/types").Palette[];
  typography: import("@/lib/types").Typography[];
  selectedPalette: string | null;
  selectedTypo: string | null;
  features: Record<string, boolean>;
  approvedAt: string | null;
}) {
  const palette = palettes.find((p) => p.id === selectedPalette);
  const typo = typography.find((t) => t.id === selectedTypo);
  const mvpKept = data.features.mvp.filter((f) => features[f.id] !== false).length;
  const niceAdded = data.features.nice_to_have.filter((f) => features[f.id] === true).length;
  const [copied, setCopied] = useState(false);
  const cmd = `./scripts/new-project.sh ${data.project.slug}`;

  const confettiPieces = useMemo(() => {
    const colors = ["#1F3CFF", "#E8A87C", "#3A6E8F", "#16793C", "#D9A441", "#C8553D", "#14130F"];
    return Array.from({ length: 90 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      dur: 2.4 + Math.random() * 2.0,
      bg: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 10,
    }));
  }, []);

  return (
    <div className="success-screen">
      {confettiPieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            background: p.bg,
            width: p.w,
            height: p.h,
            transform: `rotate(${p.rot}deg)`,
            ["--delay" as string]: `${p.delay}s`,
            ["--dur" as string]: `${p.dur}s`,
          }}
        />
      ))}
      <div className="success-inner">
        <div className="success-check">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M10 21l7 7 14-16" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="success-title">Brief aprobado.<br /><em>{data.project.name}</em> entra en producción.</h1>
        <p className="success-lede">
          La fábrica ya tiene todo lo que necesita. El equipo arranca en cuanto ejecutes el siguiente comando — CEO, Research y CTO se sincronizan en paralelo.
        </p>
        <div className="success-recap">
          <div className="success-recap__row">
            <div className="success-recap__label">Paleta</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {palette && (
                <div className="mini-palette" style={{ width: 80 }}>
                  {(["primary", "secondary", "accent", "background", "text_primary"] as const).map((k) => (
                    <div key={k} className="mini-palette__dot" style={{ background: palette.colors[k], minWidth: 14 }} />
                  ))}
                </div>
              )}
              <span className="success-recap__value">{palette?.name ?? "—"}</span>
            </div>
          </div>
          <div className="success-recap__row">
            <div className="success-recap__label">Tipografía</div>
            <div className="success-recap__value">
              {typo?.name ?? "—"}
              {typo && <span style={{ color: "var(--ink-3)", fontWeight: 400, marginLeft: 6 }}>· {typo.heading.family} / {typo.body.family}</span>}
            </div>
          </div>
          <div className="success-recap__row">
            <div className="success-recap__label">MVP confirmadas</div>
            <div className="success-recap__value">{mvpKept} <span style={{ color: "var(--ink-3)", fontWeight: 400, marginLeft: 6 }}>features</span></div>
          </div>
          <div className="success-recap__row">
            <div className="success-recap__label">Extras añadidas</div>
            <div className="success-recap__value">{niceAdded} <span style={{ color: "var(--ink-3)", fontWeight: 400, marginLeft: 6 }}>de nice-to-have</span></div>
          </div>
        </div>
        <div style={{ marginBottom: 16, fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-3)", textAlign: "left" }}>
          Siguiente paso · ejecutalo en tu terminal
        </div>
        <div className="success-command">
          <span className="success-command__prompt">$</span>
          <span className="success-command__cmd">{cmd}</span>
          <button
            className="success-command__copy"
            onClick={() => { navigator.clipboard?.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
          >
            {copied ? "Copiado ✓" : "Copiar"}
          </button>
        </div>
        {approvedAt && (
          <div className="success-meta">
            Aprobado ·{" "}
            {new Date(approvedAt).toLocaleString("es-ES", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}{" "}
            · {data.project.slug}
          </div>
        )}
      </div>
    </div>
  );
}
