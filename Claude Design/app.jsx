/* App root — orchestrates state, simulates the GET/PATCH/POST API,
   renders sections + footer + modal + success screen. */

const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Simulated API (mirrors the /api/[slug] routes) ---------- */
const fakeLatency = (min = 180, max = 420) =>
new Promise((r) => setTimeout(r, min + Math.random() * (max - min)));

async function apiGet() {
  await fakeLatency();
  // Deep clone so we don't accidentally mutate the source-of-truth mock.
  return JSON.parse(JSON.stringify(window.ONBOARDING_DATA));
}
async function apiPatch(_partial) {await fakeLatency(120, 280);return { ok: true };}
async function apiApprove(payload) {
  await fakeLatency(420, 700);
  if (!payload.selected_palette) return { ok: false, error: "Falta seleccionar una paleta de color." };
  if (!payload.selected_typography) return { ok: false, error: "Falta seleccionar una combinación tipográfica." };
  if (!payload.all_answered) return { ok: false, error: "Aún hay preguntas pendientes sin responder." };
  return { ok: true };
}

/* ---------- Toast manager ---------- */
function useToast() {
  const [toast, setToast] = useState(null);
  const ref = useRef();
  const show = (message, kind = "default", ms = 1600) => {
    clearTimeout(ref.current);
    setToast({ message, kind, id: Date.now() });
    ref.current = setTimeout(() => setToast(null), ms);
  };
  return [toast, show];
}

/* ---------- Save indicator state ---------- */
function useSaveIndicator() {
  const [state, setState] = useState("idle"); // idle | saving | saved
  const ref = useRef();
  const trigger = async (fn) => {
    setState("saving");
    try {
      await fn();
      setState("saved");
      clearTimeout(ref.current);
      ref.current = setTimeout(() => setState("idle"), 1400);
    } catch (e) {
      setState("idle");
      throw e;
    }
  };
  return [state, trigger];
}

/* ---------- Confetti ---------- */
function Confetti({ active, count = 80 }) {
  const pieces = useMemo(() => {
    if (!active) return [];
    const colors = ["#1F3CFF", "#E8A87C", "#3A6E8F", "#16793C", "#D9A441", "#C8553D", "#14130F"];
    return Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      dur: 2.4 + Math.random() * 2.0,
      bg: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 10
    }));
  }, [active]);
  if (!active) return null;
  return (
    <>
      {pieces.map((p, i) =>
      <span
        key={i}
        className="confetti-piece"
        style={{
          left: `${p.left}vw`,
          background: p.bg,
          width: p.w, height: p.h,
          transform: `rotate(${p.rot}deg)`,
          ["--delay"]: `${p.delay}s`,
          ["--dur"]: `${p.dur}s`
        }}>
      </span>
      )}
    </>);

}

/* The old fixed-position ApprovalFooter has been replaced by the
   wizard's ApprovalStep + StepActions bar (see steps.jsx). */

/* ---------- Success screen ---------- */
function SuccessScreen({ data, palettes, typography, selectedPalette, selectedTypo, features, approvedAt }) {
  const allPalettes = palettes || data.design.palettes;
  const allTypos = typography || data.design.typography;
  const palette = allPalettes.find((p) => p.id === selectedPalette);
  const typo = allTypos.find((t) => t.id === selectedTypo);
  const mvpKept = data.features.mvp.filter((f) => features[f.id] !== false).length;
  const niceAdded = data.features.nice_to_have.filter((f) => features[f.id] === true).length;
  const [copied, setCopied] = useState(false);
  const cmd = `./scripts/new-project.sh ${data.project.slug}`;

  return (
    <div className="success-screen">
      <Confetti active={true} count={90} />
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
              <div className="mini-palette" style={{ width: 80 }}>
                {["primary", "secondary", "accent", "background", "text_primary"].map((k) =>
                <div key={k} className="mini-palette__dot" style={{ background: palette.colors[k], minWidth: 14 }}></div>
                )}
              </div>
              <span className="success-recap__value">{palette.name}</span>
            </div>
          </div>
          <div className="success-recap__row">
            <div className="success-recap__label">Tipografía</div>
            <div className="success-recap__value">{typo.name} <span style={{ color: "var(--ink-3)", fontWeight: 400, marginLeft: 6 }}>· {typo.heading.family} / {typo.body.family}</span></div>
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
            onClick={() => {
              navigator.clipboard?.writeText(cmd);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}>
            {copied ? "Copiado ✓" : "Copiar"}</button>
        </div>
        <div className="success-meta">
          Aprobado · {new Date(approvedAt).toLocaleString("es-ES", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} · {data.project.slug}
        </div>
      </div>
    </div>);

}

/* ---------- Modal ---------- */
function ConfirmModal({ data, onCancel, onConfirm, isSubmitting, error }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">¿Confirmas aprobar este brief?</h2>
        <p className="modal__body">
          Una vez aprobado, <b>{data.project.name}</b> entra en la cola de producción de la fábrica. Cualquier cambio posterior tendría que pasar por una nueva sesión.
        </p>
        {error &&
        <div style={{ background: "var(--warn-soft)", color: "var(--warn)", padding: "12px 14px", borderRadius: "var(--r-md)", fontSize: 13, marginBottom: 18 }}>
            {error}
          </div>
        }
        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>Aún no</button>
          <button className="btn btn--primary" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Aprobando…" : "Sí, aprobar"}
          </button>
        </div>
      </div>
    </div>);

}

/* Build a regenerated palette / typography record from a pool entry +
   the reference the user chose. Same shape as the original schema so
   downstream components don't need to special-case it. */
function buildAlternate(kind, alt, i, reference) {
  const idPrefix = kind === "palette" ? "gen_p" : "gen_t";
  const id = `${idPrefix}_${Date.now()}_${i}`;
  const rationale = `Inspirada en "${reference.name}". ${alt.rationale}`;
  if (kind === "palette") {
    return { id, name: alt.name, recommended: i === 0, colors: alt.colors, rationale };
  }
  return { id, name: alt.name, recommended: i === 0, heading: alt.heading, body: alt.body, rationale };
}

/* ---------- Steps definition (wizard) ---------- */
const STEPS = [
  { id: "summary",   num: "01", label: "Resumen" },
  { id: "palette",   num: "02", label: "Color" },
  { id: "typo",      num: "03", label: "Tipografía" },
  { id: "questions", num: "04", label: "Preguntas" },
  { id: "features",  num: "05", label: "Alcance" },
  { id: "approve",   num: "06", label: "Aprobar" },
];

/* ---------- Main App ---------- */
function App() {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [selectedPalette, setSelectedPalette] = useState(null);
  const [selectedTypo, setSelectedTypo] = useState(null);
  const [answers, setAnswers] = useState({});
  const [features, setFeatures] = useState({});
  const [notes, setNotes] = useState("");
  const [extraUsers, setExtraUsers] = useState([]);
  const [extraFeelings, setExtraFeelings] = useState([]);

  /* Estilista regeneration state — full history snapshots per category so
     the user can navigate back to any past generation. */
  const [paletteHistory, setPaletteHistory] = useState([]);
  const [paletteHistoryIdx, setPaletteHistoryIdx] = useState(0);
  const [paletteRegenAttempts, setPaletteRegenAttempts] = useState(3);
  const [isRegeneratingPalette, setIsRegeneratingPalette] = useState(false);

  const [typoHistory, setTypoHistory] = useState([]);
  const [typoHistoryIdx, setTypoHistoryIdx] = useState(0);
  const [typoRegenAttempts, setTypoRegenAttempts] = useState(3);
  const [isRegeneratingTypo, setIsRegeneratingTypo] = useState(false);

  const [stepIdx, setStepIdx] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [approved, setApproved] = useState(false);
  const [approvedAt, setApprovedAt] = useState(null);

  const [saveState, runSave] = useSaveIndicator();
  const [toast, showToast] = useToast();

  /* Initial hydration */
  useEffect(() => {
    apiGet().
    then((d) => {
      setData(d);
      setSelectedPalette(d.approval.selected_palette);
      setSelectedTypo(d.approval.selected_typography);
      setPaletteHistory([{ items: d.design.palettes, label: "Originales", referenceName: null }]);
      setTypoHistory([{ items: d.design.typography, label: "Originales", referenceName: null }]);
      // Seed answers from saved state
      const a = {};
      d.pending_questions.forEach((q) => {a[q.id] = { answered: q.answered, answer: q.answer };});
      setAnswers(a);
      // Seed feature overrides
      const f = {};
      [...d.features.mvp, ...d.features.nice_to_have].forEach((feat) => {f[feat.id] = feat.confirmed;});
      setFeatures(f);
    }).
    catch((e) => setLoadError(e.message || "No se pudo cargar el brief."));
  }, []);

  /* ---------- Handlers — each PATCHes and shows save indicator ---------- */
  const onSelectPalette = async (id) => {
    setSelectedPalette(id);
    try {await runSave(() => apiPatch({ approval: { selected_palette: id } }));}
    catch {showToast("No se pudo guardar la paleta — revertido.", "error");setSelectedPalette((p) => p);}
  };
  const onSelectTypo = async (id) => {
    setSelectedTypo(id);
    try {await runSave(() => apiPatch({ approval: { selected_typography: id } }));}
    catch {showToast("No se pudo guardar la tipografía.", "error");}
  };
  const onAnswer = async (qid, value) => {
    const isText = !data.pending_questions.find((q) => q.id === qid).options.length;
    const answered = isText ? value.trim().length > 0 : true;
    setAnswers((prev) => ({ ...prev, [qid]: { answered, answer: value } }));
    try {await runSave(() => apiPatch({ pending_questions: [{ id: qid, answered, answer: value }] }));}
    catch {showToast("No se pudo guardar la respuesta.", "error");}
  };
  const onToggleFeature = async (fid, confirmed) => {
    setFeatures((prev) => ({ ...prev, [fid]: confirmed }));
    try {await runSave(() => apiPatch({ features: { [fid]: confirmed } }));}
    catch {showToast("No se pudo guardar la feature.", "error");}
  };
  const onAddUser = async (role) => {
    const newUser = { role, technical_level: "medium", primary: false };
    setExtraUsers((prev) => [...prev, newUser]);
    try {await runSave(() => apiPatch({ users_added: [newUser] }));}
    catch {showToast("No se pudo guardar el usuario.", "error");}
  };
  const onRemoveUser = async (i) => {
    setExtraUsers((prev) => prev.filter((_, idx) => idx !== i));
    try {await runSave(() => apiPatch({ users_removed: i }));}
    catch {showToast("No se pudo quitar el usuario.", "error");}
  };
  const onAddFeeling = async (word) => {
    // Avoid duplicates against original + extra list
    const all = [...data.design.feeling, ...extraFeelings].map((f) => f.toLowerCase());
    if (all.includes(word)) { showToast("Esa palabra ya está en la lista.", "error"); return; }
    setExtraFeelings((prev) => [...prev, word]);
    try {await runSave(() => apiPatch({ feeling_added: word }));}
    catch {showToast("No se pudo guardar la palabra.", "error");}
  };
  const onRemoveFeeling = async (i) => {
    setExtraFeelings((prev) => prev.filter((_, idx) => idx !== i));
    try {await runSave(() => apiPatch({ feeling_removed: i }));}
    catch {showToast("No se pudo quitar la palabra.", "error");}
  };

  /* Estilista regeneration — generic helper. Operates on history snapshots
     so the user can later navigate back to any past generation. */
  const generateRegeneration = async ({
    history, historyIdx, attemptsLeft, pool, referenceId, refLookup,
    setHistory, setHistoryIdx, setAttempts, setIsBusy, kind,
  }) => {
    if (!referenceId || attemptsLeft === 0) return;
    const reference = refLookup(history[historyIdx].items, referenceId);
    if (!reference) return;

    setIsBusy(true);
    await fakeLatency(1800, 2600);

    const attemptIdx = 3 - attemptsLeft; // 0..2
    const sliceStart = attemptIdx * 3;
    const newAlternates = pool.slice(sliceStart, sliceStart + 3).map((alt, i) =>
      buildAlternate(kind, alt, i, reference)
    );

    const newSnapshot = {
      items: [{ ...reference, recommended: false }, ...newAlternates],
      label: `Gen ${attemptIdx + 1} · ${reference.name}`,
      referenceName: reference.name,
    };

    // Truncate any "future" history if we regenerated from a past snapshot
    const truncated = history.slice(0, historyIdx + 1);
    setHistory([...truncated, newSnapshot]);
    setHistoryIdx(truncated.length);
    setAttempts((prev) => prev - 1);
    setIsBusy(false);
    showToast(`3 ${kind === "palette" ? "paletas" : "tipografías"} nuevas · inspiradas en "${reference.name}"`, "success", 2400);
  };

  const handleRegeneratePalette = () => generateRegeneration({
    history: paletteHistory,
    historyIdx: paletteHistoryIdx,
    attemptsLeft: paletteRegenAttempts,
    pool: window.PALETTE_ALTERNATES || [],
    referenceId: selectedPalette,
    refLookup: (list, id) => list.find((p) => p.id === id),
    setHistory: setPaletteHistory,
    setHistoryIdx: setPaletteHistoryIdx,
    setAttempts: setPaletteRegenAttempts,
    setIsBusy: setIsRegeneratingPalette,
    kind: "palette",
  });

  const handleRegenerateTypo = () => generateRegeneration({
    history: typoHistory,
    historyIdx: typoHistoryIdx,
    attemptsLeft: typoRegenAttempts,
    pool: window.TYPOGRAPHY_ALTERNATES || [],
    referenceId: selectedTypo,
    refLookup: (list, id) => list.find((t) => t.id === id),
    setHistory: setTypoHistory,
    setHistoryIdx: setTypoHistoryIdx,
    setAttempts: setTypoRegenAttempts,
    setIsBusy: setIsRegeneratingTypo,
    kind: "typo",
  });

  /* Navigate history (back/forward through past generations) */
  const navPaletteHistory = (delta) => {
    setPaletteHistoryIdx((i) => Math.max(0, Math.min(paletteHistory.length - 1, i + delta)));
  };
  const navTypoHistory = (delta) => {
    setTypoHistoryIdx((i) => Math.max(0, Math.min(typoHistory.length - 1, i + delta)));
  };

  /* ---------- Derived state ---------- */
  const totalQs = data?.pending_questions.length || 0;
  const doneQs = data ? data.pending_questions.filter((q) => answers[q.id]?.answered).length : 0;
  const mvpKept = data ? data.features.mvp.filter((f) => features[f.id] !== false).length : 0;
  const allAnswered = totalQs > 0 && doneQs === totalQs;

  const checklist = [
  { label: "Paleta de color seleccionada", done: !!selectedPalette },
  { label: "Combinación tipográfica seleccionada", done: !!selectedTypo },
  { label: `Preguntas respondidas (${doneQs}/${totalQs})`, done: allAnswered },
  { label: `Features del MVP revisadas (${mvpKept} confirmadas)`, done: mvpKept > 0 }];

  const allReady = checklist.every((c) => c.done);

  /* ---------- Per-step completion flags (drives stepper + advance gate) ---------- */
  const stepDone = {
    summary: true, // read-only — always "done" once the user has viewed it
    palette: !!selectedPalette,
    typo: !!selectedTypo,
    questions: allAnswered,
    features: mvpKept > 0,
    approve: false,
  };

  /* ---------- Step navigation handlers ---------- */
  const goNext = () => {
    setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };
  const goPrev = () => {
    setStepIdx((i) => Math.max(0, i - 1));
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };
  const jumpTo = (i) => {
    setStepIdx(i);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  /* ---------- Approve flow ---------- */
  const handleApproveClick = () => {
    if (!allReady) return;
    setModalError(null);
    setModalOpen(true);
  };
  const handleConfirmApprove = async () => {
    setSubmitting(true);
    setModalError(null);
    const res = await apiApprove({
      selected_palette: selectedPalette,
      selected_typography: selectedTypo,
      all_answered: allAnswered
    });
    setSubmitting(false);
    if (!res.ok) {setModalError(res.error);return;}
    const ts = new Date().toISOString();
    setApprovedAt(ts);
    setApproved(true);
    setModalOpen(false);
  };

  /* ---------- Renders ---------- */
  if (loadError) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 48, marginBottom: 8 }}>No pudimos cargar.</div>
          <div style={{ color: "var(--ink-2)", marginBottom: 18 }}>{loadError}</div>
          <button className="btn btn--primary" onClick={() => location.reload()}>Reintentar</button>
        </div>
      </div>);

  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.1em" }}>
          CARGANDO BRIEF · {/* slug */}sereno
        </div>
      </div>);

  }

  if (approved) {
    return <SuccessScreen data={data} palettes={paletteHistory.flatMap((h) => h.items)} typography={typoHistory.flatMap((h) => h.items)} selectedPalette={selectedPalette} selectedTypo={selectedTypo} features={features} approvedAt={approvedAt} />;
  }

  /* ---------- Step content router ---------- */
  const renderStepContent = () => {
    const step = STEPS[stepIdx];
    switch (step.id) {
      case "summary":
        return (
          <>
            <StepEyebrow idx={stepIdx} total={STEPS.length} label={step.label} />
            <Hero data={data} />
            <div style={{ height: 64 }}></div>
            <ProjectSummary data={data} extraUsers={extraUsers} onAddUser={onAddUser} onRemoveUser={onRemoveUser} extraFeelings={extraFeelings} onAddFeeling={onAddFeeling} onRemoveFeeling={onRemoveFeeling} />
          </>
        );
      case "palette": {
        const snap = paletteHistory[paletteHistoryIdx];
        return (
          <>
            <StepEyebrow idx={stepIdx} total={STEPS.length} label={step.label} />
            <ColorPicker
              palettes={snap ? snap.items : data.design.palettes}
              selected={selectedPalette}
              onSelect={onSelectPalette}
              regenAttempts={paletteRegenAttempts}
              isRegenerating={isRegeneratingPalette}
              onRegenerate={handleRegeneratePalette}
              history={paletteHistory}
              historyIdx={paletteHistoryIdx}
              onNavHistory={navPaletteHistory}
            />
          </>
        );
      }
      case "typo": {
        const snap = typoHistory[typoHistoryIdx];
        return (
          <>
            <StepEyebrow idx={stepIdx} total={STEPS.length} label={step.label} />
            <FontPicker
              typography={snap ? snap.items : data.design.typography}
              selected={selectedTypo}
              onSelect={onSelectTypo}
              regenAttempts={typoRegenAttempts}
              isRegenerating={isRegeneratingTypo}
              onRegenerate={handleRegenerateTypo}
              history={typoHistory}
              historyIdx={typoHistoryIdx}
              onNavHistory={navTypoHistory}
            />
          </>
        );
      }
      case "questions":
        return (
          <>
            <StepEyebrow idx={stepIdx} total={STEPS.length} label={step.label} />
            <PendingQuestions data={data} answers={answers} onAnswer={onAnswer} />
          </>
        );
      case "features":
        return (
          <>
            <StepEyebrow idx={stepIdx} total={STEPS.length} label={step.label} />
            <FeatureCards data={data} features={features} onToggle={onToggleFeature} />
          </>
        );
      case "approve":
        return (
          <ApprovalStep
            data={data}
            palettes={paletteHistory.flatMap((h) => h.items)}
            typography={typoHistory.flatMap((h) => h.items)}
            selectedPalette={selectedPalette}
            selectedTypo={selectedTypo}
            features={features}
            checklist={checklist}
            allReady={allReady}
            notes={notes}
            setNotes={setNotes}
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
            <div className="brand__mark"></div>
            <span className="brand__name">AI Factory</span>
            <span className="brand__dot"></span>
            <span className="brand__meta">CLIENT ONBOARDING · /{data.project.slug}</span>
          </div>
          <div className="topbar__right">
            <span className={`save-state ${saveState === "saving" ? "is-saving" : ""} ${saveState === "saved" ? "is-saved" : ""}`}>
              {saveState === "saving" && <><Spinner /> Guardando…</>}
              {saveState === "saved" && <>{Icon.check({ size: 11 })} Guardado</>}
              {saveState === "idle" && <>· Cambios en vivo</>}
            </span>
            <span className="session-pill">
              <span className="session-pill__dot"></span> Sesión activa
            </span>
          </div>
        </div>
      </div>

      <Stepper steps={STEPS} currentIdx={stepIdx} stepDone={stepDone} onJump={jumpTo} />

      <div className="main-grid">
        <div className="content-col">
          <div className="step-content" key={stepIdx}>
            {renderStepContent()}
          </div>
        </div>
        <BriefSummary data={data} palettes={paletteHistory.flatMap((h) => h.items)} typography={typoHistory.flatMap((h) => h.items)} selectedPalette={selectedPalette} selectedTypo={selectedTypo} answers={answers} features={features} />
      </div>

      <StepActions
        currentIdx={stepIdx}
        steps={STEPS}
        stepDone={stepDone}
        onPrev={goPrev}
        onNext={goNext}
        onApprove={handleApproveClick}
        allReady={allReady}
        isSubmitting={submitting}
      />

      {modalOpen &&
      <ConfirmModal
        data={data}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleConfirmApprove}
        isSubmitting={submitting}
        error={modalError} />

      }

      {toast &&
      <div className={`toast toast--${toast.kind}`}>
          {toast.kind === "error" ? Icon.x({ size: 12 }) : Icon.check({ size: 12 })}
          {toast.message}
        </div>
      }
    </div>);

}

function Spinner() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" style={{ animation: "spin 0.9s linear infinite" }}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>);

}

/* Inject keyframe for spinner */
if (!document.getElementById("__spinner-keyframes")) {
  const s = document.createElement("style");
  s.id = "__spinner-keyframes";
  s.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);