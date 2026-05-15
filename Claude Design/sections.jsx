/* Section components — all rendered inside the App scope.
   Components publish themselves to window at end of file. */

const { useState, useMemo, useEffect, useRef } = React;

/* ---------- Tiny icon helpers ---------- */
const Icon = {
  check: (p = {}) =>
  <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,

  x: (p = {}) =>
  <svg width={p.size || 12} height={p.size || 12} viewBox="0 0 12 12" fill="none">
      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>,

  plus: (p = {}) =>
  <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill="none">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>,

  arrow: (p = {}) =>
  <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,

  clock: (p = {}) =>
  <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 4v3.2L9 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>

};

/* ---------- HERO ---------- */
function Hero({ data }) {
  const typeLabel = { app: "Aplicación web", landing: "Landing page", both: "Landing + App" }[data.project.type] || data.project.type;
  return (
    <header className="hero">
      <div className="hero__kicker">Bienvenido</div>
      <div>
        <h1 className="hero__title">
          Revisemos juntos <em>{data.project.name}</em>, tal como vamos a fabricarlo.
        </h1>
        <p className="hero__lede">
          Vamos a recorrer seis pasos breves. Confirmas la dirección visual, respondes unas preguntas abiertas y apruebas el alcance. Cuando termines, el brief pasa a producción.
        </p>
        <div className="hero__meta">
          <span><b>{data.project.name.toUpperCase()}</b> · {data.project.slug}</span>
          <span>TIPO · <b>{typeLabel}</b></span>
          <span>TIMELINE · <b>{data.project.timeline}</b></span>
          <span>GENERADO · <b>{new Date(data.project.generated_at).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</b></span>
        </div>
      </div>
    </header>);

}

/* ---------- SECTION 1 · PROJECT SUMMARY ---------- */
function ProjectSummary({ data, extraUsers, onAddUser, onRemoveUser, extraFeelings, onAddFeeling, onRemoveFeeling }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);

  const [addingFeeling, setAddingFeeling] = useState(false);
  const [feelingDraft, setFeelingDraft] = useState("");
  const feelingInputRef = useRef(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);
  useEffect(() => {
    if (addingFeeling) feelingInputRef.current?.focus();
  }, [addingFeeling]);

  const commit = () => {
    const v = draft.trim();
    if (v.length > 0) onAddUser(v);
    setDraft("");
    setAdding(false);
  };
  const commitFeeling = () => {
    const v = feelingDraft.trim().toLowerCase();
    if (v.length > 0) onAddFeeling(v);
    setFeelingDraft("");
    setAddingFeeling(false);
  };

  return (
    <section className="section" id="section-resumen">
      <div className="section__head">
        <div className="section__num">§ 01 · Resumen</div>
        <div>
          <h2 className="section__title">Lo que estamos construyendo.</h2>
          <p className="section__sub">El equipo de research consolidó tu brief en este resumen. Si los usuarios objetivo no encajan al 100%, añade los tuyos abajo — todo lo demás lo capturamos en la sección de preguntas.</p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-cell summary-cell--wide">
          <div className="summary-cell__label">Descripción</div>
          <div className="summary-cell__value" style={{ fontSize: 18, lineHeight: 1.5 }}>{data.project.description}</div>
        </div>
        <div className="summary-cell">
          <div className="summary-cell__label">Sector</div>
          <div className="summary-cell__value">{data.market_context.sector}</div>
        </div>
        <div className="summary-cell">
          <div className="summary-cell__label">Stack sugerido</div>
          <div className="summary-cell__value" style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
            {data.tech.stack_suggestion.frontend} · {data.tech.stack_suggestion.database} · {data.tech.stack_suggestion.hosting}
          </div>
        </div>
        <div className="summary-cell summary-cell--wide">
          <div className="summary-cell__label">
            Usuarios objetivo
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--ink-4)", textTransform: "none", letterSpacing: 0, marginLeft: 8, fontWeight: 400 }}>
              · ¿Falta alguno? Añádelo →
            </span>
          </div>
          <div className="users-row" style={{ marginTop: 6 }}>
            {data.users.map((u, i) => {
              const initials = u.role.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={i} className={`user-chip ${u.primary ? "user-chip--primary" : ""}`}>
                  <div className="user-chip__avatar">{initials}</div>
                  <div>
                    <div className="user-chip__role">{u.role}{u.primary && " · primario"}</div>
                    <div className="user-chip__lvl">Nivel técnico · {u.technical_level}</div>
                  </div>
                </div>);

            })}

            {extraUsers && extraUsers.map((u, i) => {
              const initials = u.role.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={`extra-${i}`} className="user-chip user-chip--custom">
                  <div className="user-chip__avatar">{initials || "+"}</div>
                  <div>
                    <div className="user-chip__role">{u.role}</div>
                    <div className="user-chip__lvl">Añadido por ti</div>
                  </div>
                  <button
                    className="user-chip__remove"
                    onClick={() => onRemoveUser(i)}
                    title="Quitar"
                    aria-label="Quitar usuario">
                    {Icon.x({ size: 10 })}</button>
                </div>);

            })}

            {adding ?
            <div className="user-chip user-chip--input">
                <div className="user-chip__avatar" style={{ background: "var(--accent-soft)", color: "var(--accent-ink)" }}>{Icon.plus({ size: 11 })}</div>
                <input
                ref={inputRef}
                className="user-chip__input"
                type="text"
                placeholder="Ej: Administrador del centro"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") {setDraft("");setAdding(false);}
                }}
                onBlur={commit} />
              
              </div> :

            <button
              className="user-chip user-chip--add"
              onClick={() => setAdding(true)}
              type="button">
              
                <div className="user-chip__avatar" style={{ background: "transparent", border: "1px dashed var(--ink-4)", color: "var(--ink-3)" }}>
                  {Icon.plus({ size: 11 })}
                </div>
                <span className="user-chip__role" style={{ color: "var(--ink-2)" }}>Añadir otro</span>
              </button>
            }
          </div>
        </div>
      </div>

      <div className="callout">
        <div className="callout__mark">“</div>
        <div className="callout__label">Problem statement</div>
        <div className="callout__quote">{data.market_context.problem_statement}</div>
      </div>

      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "80px 1fr", gap: 24 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.05em", paddingTop: 4 }}>FEELING</div>
        <div className="feeling-row">
          {data.design.feeling.map((f, i) => <div key={i} className="chip">{f}</div>)}
          {extraFeelings && extraFeelings.map((f, i) => (
            <div key={`extra-feel-${i}`} className="chip chip--custom">
              <span>{f}</span>
              <button
                className="chip__remove"
                onClick={() => onRemoveFeeling(i)}
                title="Quitar"
                aria-label="Quitar feeling"
              >{Icon.x({ size: 9 })}</button>
            </div>
          ))}
          {addingFeeling ? (
            <div className="chip chip--input">
              <input
                ref={feelingInputRef}
                className="chip__input"
                type="text"
                placeholder="palabra clave…"
                value={feelingDraft}
                onChange={(e) => setFeelingDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitFeeling();
                  if (e.key === "Escape") { setFeelingDraft(""); setAddingFeeling(false); }
                }}
                onBlur={commitFeeling}
              />
            </div>
          ) : (
            <button
              className="chip chip--add"
              onClick={() => setAddingFeeling(true)}
              type="button"
            >
              {Icon.plus({ size: 11 })}
              <span>Añadir otro</span>
            </button>
          )}
        </div>
      </div>
    </section>);

}

/* ---------- SECTION 2 · COLOR PICKER ---------- */
function ColorPicker({ palettes, selected, onSelect, regenAttempts, isRegenerating, onRegenerate, history, historyIdx, onNavHistory }) {
  return (
    <section className="section" id="section-colores">
      <div className="section__head">
        <div className="section__num">§ 02 · Paleta</div>
        <div>
          <h2 className="section__title">Elige una <em style={{ fontStyle: "normal", color: "var(--accent)" }}>dirección</em> de color.</h2>
          <p className="section__sub">Cuatro paletas pensadas para Sereno. La recomendada equilibra calidez clínica con claridad para pacientes; las otras son alternativas legítimas. Si ninguna te convence, puedes pedirle al estilista que genere más usando una como referencia.</p>
        </div>
      </div>

      <div className={`cards-grid ${isRegenerating ? "is-regenerating" : ""}`}>
        {palettes.map((p) =>
          <PaletteCard key={p.id} palette={p} isSelected={selected === p.id} onClick={() => !isRegenerating && onSelect(p.id)} />
        )}
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
    </section>);

}

function PaletteCard({ palette, isSelected, onClick }) {
  const order = ["primary", "secondary", "accent", "background", "surface", "text_primary", "text_secondary"];
  return (
    <div className={`palette-card ${isSelected ? "is-selected" : ""}`} onClick={onClick}>
      <div className="palette-card__head">
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", minWidth: 0, flex: 1 }}>
          <div className="palette-card__name">{palette.name}</div>
          {palette.recommended && <span className="pill pill--accent">Recomendada</span>}
        </div>
        <div className="palette-card__check">{Icon.check({ size: 14 })}</div>
      </div>
      <div className="swatch-bar">
        {order.map((k) =>
        <div key={k} className="swatch" style={{ background: palette.colors[k] }}>
            <span className="swatch__label">{palette.colors[k].toUpperCase()} · {k}</span>
          </div>
        )}
      </div>
      <div className="palette-rationale">{palette.rationale}</div>
    </div>);

}

/* ---------- SECTION 3 · FONT PICKER ---------- */
function FontPicker({ typography, selected, onSelect, regenAttempts, isRegenerating, onRegenerate, history, historyIdx, onNavHistory }) {
  // Dynamically inject google fonts for any typography option currently in
  // history (originals + any generated). Re-runs as history grows.
  useEffect(() => {
    const allOptions = (history || []).flatMap((h) => h.items);
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
          <p className="section__sub">Cada opción combina un titular y un cuerpo. Pasa la mirada por el preview — eso es lo que el usuario verá en pantalla. Si quieres explorar más direcciones, el estilista puede generar nuevas pairings.</p>
        </div>
      </div>

      <div className={`font-cards ${isRegenerating ? "is-regenerating" : ""}`}>
        {typography.map((t) =>
          <FontCard key={t.id} typo={t} isSelected={selected === t.id} onClick={() => !isRegenerating && onSelect(t.id)} />
        )}
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
    </section>);

}

function FontCard({ typo, isSelected, onClick }) {
  const headStyle = { fontFamily: `"${typo.heading.family}", serif`, fontWeight: typo.heading.weight };
  const bodyStyle = { fontFamily: `"${typo.body.family}", sans-serif`, fontWeight: typo.body.weight };
  return (
    <div className={`font-card ${isSelected ? "is-selected" : ""}`} onClick={onClick}>
      <div className="font-card__head">
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", minWidth: 0, flex: 1 }}>
          <div className="font-card__name">{typo.name}</div>
          {typo.recommended && <span className="pill pill--accent">Recomendada</span>}
        </div>
        <div className="palette-card__check">{Icon.check({ size: 14 })}</div>
      </div>
      <div className="font-card__families">
        Titular <b style={{ color: "var(--ink)" }}>{typo.heading.family}</b> · Cuerpo <b style={{ color: "var(--ink)" }}>{typo.body.family}</b>
      </div>
      <div className="font-card__heading-preview" style={headStyle}>Tu proyecto, tu visión</div>
      <div className="font-card__body-preview" style={bodyStyle}>
        El texto de tu aplicación se verá así. Claro, legible y profesional. Cada palabra encuentra su ritmo, cada párrafo respira.
      </div>
      <div className="font-card__rationale">{typo.rationale}</div>
    </div>);

}

/* ---------- SECTION 4 · PENDING QUESTIONS ---------- */
function PendingQuestions({ data, answers, onAnswer }) {
  if (!data.pending_questions.length) return null;
  const total = data.pending_questions.length;
  const done = data.pending_questions.filter((q) => answers[q.id]?.answered).length;

  return (
    <section className="section" id="section-preguntas">
      <div className="section__head">
        <div className="section__num">§ 04 · Pendientes</div>
        <div>
          <h2 className="section__title">Las preguntas que aún tenemos.</h2>
          <p className="section__sub">No podemos empezar a fabricar hasta que estas decisiones estén firmadas. Si no estás seguro, ve con la recomendada — el equipo la ha pensado contigo.</p>
        </div>
      </div>

      <div className="question-counter">
        <span>{done} / {total} respondidas</span>
        <div className="question-counter__bar"><div className="question-counter__fill" style={{ width: `${done / total * 100}%` }}></div></div>
      </div>

      {data.pending_questions.map((q, i) =>
      <QuestionCard key={q.id} q={q} index={i} state={answers[q.id]} onAnswer={onAnswer} />
      )}
    </section>);

}

function QuestionCard({ q, index, state, onAnswer }) {
  const answered = state?.answered;
  const [draft, setDraft] = useState(state?.answer ?? "");

  return (
    <div className={`question ${answered ? "is-answered" : ""}`}>
      <div className="question__head">
        <div className="question__num">Q{(index + 1).toString().padStart(2, "0")}</div>
        <div className="question__text">{q.question}</div>
      </div>
      <div className="question__context">{q.context}</div>

      {q.options.length > 0 ?
      <div className="question__options">
          {q.options.map((opt) =>
        <div
          key={opt.value}
          className={`option-row ${state?.answer === opt.value ? "is-selected" : ""}`}
          onClick={() => onAnswer(q.id, opt.value)}>
          
              <div className="option-row__radio"></div>
              <div className="option-row__label">{opt.label}</div>
              {opt.recommended && <span className="option-row__rec">recomendada</span>}
            </div>
        )}
        </div> :

      <textarea
        className="question__textarea"
        placeholder="Escribe aquí — todo lo que pienses cuenta…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => onAnswer(q.id, draft)}>
      </textarea>
      }
    </div>);

}

/* ---------- SECTION 5 · FEATURES ---------- */
function FeatureCards({ data, features, onToggle }) {
  const [niceOpen, setNiceOpen] = useState(false);

  const mvpConfirmed = data.features.mvp.filter((f) => features[f.id] !== false).length;
  const niceAdded = data.features.nice_to_have.filter((f) => features[f.id] === true).length;

  return (
    <section className="section" id="section-features">
      <div className="section__head">
        <div className="section__num">§ 05 · Alcance</div>
        <div>
          <h2 className="section__title">El MVP, feature por feature.</h2>
          <p className="section__sub">Confirma o descarta cada una. Si una feature se descarta aquí, ya no entra en la línea de producción — pasarla a “más tarde” es una decisión legítima.</p>
        </div>
      </div>

      <div className="subsection__head" style={{ marginTop: 0 }}>
        <div className="subsection__title">Núcleo del MVP</div>
        <div className="subsection__count">{mvpConfirmed} de {data.features.mvp.length} confirmadas</div>
      </div>
      <div className="features-grid">
        {data.features.mvp.map((f) =>
        <FeatureCard key={f.id} feature={f} state={features[f.id]} defaultState={f.confirmed} onToggle={onToggle} />
        )}
      </div>

      <div className="subsection">
        <div className={`accordion ${niceOpen ? "is-open" : ""}`}>
          <div className="accordion__head" onClick={() => setNiceOpen((v) => !v)}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <div className="accordion__title">Nice to have</div>
              <span className="accordion__sub">{niceAdded} añadidas · {data.features.nice_to_have.length} disponibles</span>
            </div>
            <div className="accordion__icon">{Icon.plus({ size: 14 })}</div>
          </div>
          <div className="accordion__body">
            <p style={{ color: "var(--ink-3)", fontSize: 14, marginBottom: 18, marginTop: 6 }}>
              Estas no están en el plan, pero podemos agregarlas si las marcas. Cada una alarga el timeline.
            </p>
            <div className="features-grid">
              {data.features.nice_to_have.map((f) =>
              <FeatureCard key={f.id} feature={f} state={features[f.id]} defaultState={false} onToggle={onToggle} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="oos-list">
        <div className="oos-list__head">Fuera de scope · solo informativo</div>
        {data.features.out_of_scope.map((s, i) =>
        <div key={i} className="oos-item">
            <div className="oos-item__x">{Icon.x({ size: 10 })}</div>
            <div>{s}</div>
          </div>
        )}
      </div>
    </section>);

}

function FeatureCard({ feature, state, defaultState, onToggle }) {
  const isConfirmed = state === true || state === undefined && defaultState === true;
  const isRejected = state === false || state === undefined && defaultState === false;
  return (
    <div className={`feature-card ${isConfirmed ? "is-confirmed" : ""} ${isRejected ? "is-rejected" : ""}`}>
      <div className="feature-card__name">{feature.name}</div>
      <div className="feature-card__desc">{feature.description}</div>
      <div className="feature-card__toggle">
        <button
          className={`toggle-btn toggle-btn--yes ${isConfirmed ? "is-active" : ""}`}
          title="Confirmar"
          onClick={() => onToggle(feature.id, true)}>
          {Icon.check({ size: 12 })}</button>
        <button
          className={`toggle-btn toggle-btn--no ${isRejected ? "is-active" : ""}`}
          title="Rechazar"
          onClick={() => onToggle(feature.id, false)}>
          {Icon.x({ size: 10 })}</button>
      </div>
    </div>);

}

/* ---------- BRIEF SUMMARY SIDEBAR ---------- */
function BriefSummary({ data, palettes, typography, selectedPalette, selectedTypo, answers, features }) {
  const allPalettes = palettes || data.design.palettes;
  const allTypos = typography || data.design.typography;
  const palette = allPalettes.find((p) => p.id === selectedPalette);
  const typo = allTypos.find((t) => t.id === selectedTypo);
  const total = data.pending_questions.length;
  const done = data.pending_questions.filter((q) => answers[q.id]?.answered).length;
  const mvpKept = data.features.mvp.filter((f) => features[f.id] !== false).length;
  const niceAdded = data.features.nice_to_have.filter((f) => features[f.id] === true).length;

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
            {palette ?
            <>
                <div className="mini-palette">
                  {["primary", "secondary", "accent", "background", "text_primary"].map((k) =>
                <div key={k} className="mini-palette__dot" style={{ background: palette.colors[k], minWidth: 14 }}></div>
                )}
                </div>
                <span className="brief-row__value" style={{ maxWidth: 110 }}>{palette.name}</span>
              </> :

            <span className="brief-row__value is-pending">pendiente</span>
            }
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

        {niceAdded > 0 &&
        <div className="brief-row">
            <div className="brief-row__label">Extras</div>
            <div className="brief-row__value">+{niceAdded} <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>añadidas</span></div>
          </div>
        }

        <div className="brief-progress">
          {[
          { done: !!selectedPalette, label: "Paleta elegida" },
          { done: !!selectedTypo, label: "Tipografía elegida" },
          { done: done === total, label: "Preguntas respondidas" },
          { done: mvpKept > 0, label: "Features revisadas" }].
          map((item, i) =>
          <div key={i} className={`progress-line ${item.done ? "is-done" : ""}`}>
              <div className="progress-line__icon">{item.done ? Icon.check({ size: 10 }) : null}</div>
              <span>{item.label}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", textAlign: "center", letterSpacing: "0.05em" }}>
        Cada cambio se guarda automáticamente.
      </div>
    </aside>);

}

/* ---------- export to window ---------- */
Object.assign(window, {
  Hero, ProjectSummary, ColorPicker, FontPicker, PendingQuestions, FeatureCards, BriefSummary, Icon
});