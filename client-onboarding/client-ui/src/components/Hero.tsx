"use client";

import type { OnboardingData } from "@/lib/types";

const TYPE_LABELS: Record<string, string> = {
  app: "Aplicación web",
  landing: "Landing page",
  both: "Landing + App",
};

export function Hero({ data }: { data: OnboardingData }) {
  const typeLabel = TYPE_LABELS[data.project.type] ?? data.project.type;
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
          <span>
            GENERADO ·{" "}
            <b>
              {new Date(data.project.generated_at).toLocaleString("es-ES", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </b>
          </span>
        </div>
      </div>
    </header>
  );
}
