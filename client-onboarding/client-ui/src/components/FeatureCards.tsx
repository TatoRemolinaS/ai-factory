"use client";

import { useState } from "react";
import type { OnboardingData, Feature } from "@/lib/types";
import { Icon } from "./icons";

interface Props {
  data: OnboardingData;
  features: Record<string, boolean>;
  onToggle: (fid: string, confirmed: boolean) => void;
}

export function FeatureCards({ data, features, onToggle }: Props) {
  const [niceOpen, setNiceOpen] = useState(false);
  const mvpConfirmed = data.features.mvp.filter((f) => features[f.id] !== false).length;
  const niceAdded = data.features.nice_to_have.filter((f) => features[f.id] === true).length;

  return (
    <section className="section" id="section-features">
      <div className="section__head">
        <div className="section__num">§ 05 · Alcance</div>
        <div>
          <h2 className="section__title">El MVP, feature por feature.</h2>
          <p className="section__sub">
            Confirma o descarta cada una. Si una feature se descarta aquí, ya no entra en la línea de producción — pasarla a "más tarde" es una decisión legítima.
          </p>
        </div>
      </div>

      <div className="subsection__head" style={{ marginTop: 0 }}>
        <div className="subsection__title">Núcleo del MVP</div>
        <div className="subsection__count">{mvpConfirmed} de {data.features.mvp.length} confirmadas</div>
      </div>
      <div className="features-grid">
        {data.features.mvp.map((f) => (
          <FeatureCard key={f.id} feature={f} state={features[f.id]} defaultState={f.confirmed} onToggle={onToggle} />
        ))}
      </div>

      <div className="subsection">
        <div className={`accordion ${niceOpen ? "is-open" : ""}`}>
          <div className="accordion__head" onClick={() => setNiceOpen((v) => !v)}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <div className="accordion__title">Nice to have</div>
              <span className="accordion__sub">{niceAdded} añadidas · {data.features.nice_to_have.length} disponibles</span>
            </div>
            <div className="accordion__icon"><Icon.plus size={14} /></div>
          </div>
          <div className="accordion__body">
            <p style={{ color: "var(--ink-3)", fontSize: 14, marginBottom: 18, marginTop: 6 }}>
              Estas no están en el plan, pero podemos agregarlas si las marcas. Cada una alarga el timeline.
            </p>
            <div className="features-grid">
              {data.features.nice_to_have.map((f) => (
                <FeatureCard key={f.id} feature={f} state={features[f.id]} defaultState={false} onToggle={onToggle} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="oos-list">
        <div className="oos-list__head">Fuera de scope · solo informativo</div>
        {data.features.out_of_scope.map((s, i) => (
          <div key={i} className="oos-item">
            <div className="oos-item__x"><Icon.x size={10} /></div>
            <div>{s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature, state, defaultState, onToggle }: {
  feature: Feature;
  state: boolean | undefined;
  defaultState: boolean;
  onToggle: (fid: string, confirmed: boolean) => void;
}) {
  const isConfirmed = state === true || (state === undefined && defaultState === true);
  const isRejected = state === false || (state === undefined && defaultState === false);
  return (
    <div className={`feature-card ${isConfirmed ? "is-confirmed" : ""} ${isRejected ? "is-rejected" : ""}`}>
      <div className="feature-card__name">{feature.name}</div>
      <div className="feature-card__desc">{feature.description}</div>
      <div className="feature-card__toggle">
        <button className={`toggle-btn toggle-btn--yes ${isConfirmed ? "is-active" : ""}`} title="Confirmar" onClick={() => onToggle(feature.id, true)}>
          <Icon.check size={12} />
        </button>
        <button className={`toggle-btn toggle-btn--no ${isRejected ? "is-active" : ""}`} title="Rechazar" onClick={() => onToggle(feature.id, false)}>
          <Icon.x size={10} />
        </button>
      </div>
    </div>
  );
}
