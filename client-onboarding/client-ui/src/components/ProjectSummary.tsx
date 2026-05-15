"use client";

import { useState, useEffect, useRef } from "react";
import type { OnboardingData, User } from "@/lib/types";
import { Icon } from "./icons";

interface Props {
  data: OnboardingData;
  extraUsers: User[];
  onAddUser: (role: string) => void;
  onRemoveUser: (i: number) => void;
  extraFeelings: string[];
  onAddFeeling: (word: string) => void;
  onRemoveFeeling: (i: number) => void;
}

export function ProjectSummary({
  data, extraUsers, onAddUser, onRemoveUser, extraFeelings, onAddFeeling, onRemoveFeeling,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [addingFeeling, setAddingFeeling] = useState(false);
  const [feelingDraft, setFeelingDraft] = useState("");
  const feelingInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);
  useEffect(() => { if (addingFeeling) feelingInputRef.current?.focus(); }, [addingFeeling]);

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
          <p className="section__sub">
            El equipo de research consolidó tu brief en este resumen. Si los usuarios objetivo no encajan al 100%, añade los tuyos abajo — todo lo demás lo capturamos en la sección de preguntas.
          </p>
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
                </div>
              );
            })}

            {extraUsers.map((u, i) => {
              const initials = u.role.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={`extra-${i}`} className="user-chip user-chip--custom">
                  <div className="user-chip__avatar">{initials || "+"}</div>
                  <div>
                    <div className="user-chip__role">{u.role}</div>
                    <div className="user-chip__lvl">Añadido por ti</div>
                  </div>
                  <button className="user-chip__remove" onClick={() => onRemoveUser(i)} title="Quitar">
                    <Icon.x size={10} />
                  </button>
                </div>
              );
            })}

            {adding ? (
              <div className="user-chip user-chip--input">
                <div className="user-chip__avatar" style={{ background: "var(--accent-soft)", color: "var(--accent-ink)" }}>
                  <Icon.plus size={11} />
                </div>
                <input
                  ref={inputRef}
                  className="user-chip__input"
                  type="text"
                  placeholder="Ej: Administrador del centro"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commit();
                    if (e.key === "Escape") { setDraft(""); setAdding(false); }
                  }}
                  onBlur={commit}
                />
              </div>
            ) : (
              <button className="user-chip user-chip--add" onClick={() => setAdding(true)} type="button">
                <div className="user-chip__avatar" style={{ background: "transparent", border: "1px dashed var(--ink-4)", color: "var(--ink-3)" }}>
                  <Icon.plus size={11} />
                </div>
                <span className="user-chip__role" style={{ color: "var(--ink-2)" }}>Añadir otro</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="callout">
        <div className="callout__mark">"</div>
        <div className="callout__label">Problem statement</div>
        <div className="callout__quote">{data.market_context.problem_statement}</div>
      </div>

      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "80px 1fr", gap: 24 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.05em", paddingTop: 4 }}>FEELING</div>
        <div className="feeling-row">
          {data.design.feeling.map((f, i) => <div key={i} className="chip">{f}</div>)}
          {extraFeelings.map((f, i) => (
            <div key={`extra-feel-${i}`} className="chip chip--custom">
              <span>{f}</span>
              <button className="chip__remove" onClick={() => onRemoveFeeling(i)} title="Quitar">
                <Icon.x size={9} />
              </button>
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
            <button className="chip chip--add" onClick={() => setAddingFeeling(true)} type="button">
              <Icon.plus size={11} />
              <span>Añadir otro</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
