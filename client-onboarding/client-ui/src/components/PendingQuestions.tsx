"use client";

import { useState } from "react";
import type { OnboardingData, PendingQuestion, AnswerState } from "@/lib/types";

interface Props {
  data: OnboardingData;
  answers: Record<string, AnswerState>;
  onAnswer: (qid: string, value: string) => void;
}

export function PendingQuestions({ data, answers, onAnswer }: Props) {
  if (!data.pending_questions.length) return null;
  const total = data.pending_questions.length;
  const done = data.pending_questions.filter((q) => answers[q.id]?.answered).length;

  return (
    <section className="section" id="section-preguntas">
      <div className="section__head">
        <div className="section__num">§ 04 · Pendientes</div>
        <div>
          <h2 className="section__title">Las preguntas que aún tenemos.</h2>
          <p className="section__sub">
            No podemos empezar a fabricar hasta que estas decisiones estén firmadas. Si no estás seguro, ve con la recomendada — el equipo la ha pensado contigo.
          </p>
        </div>
      </div>

      <div className="question-counter">
        <span>{done} / {total} respondidas</span>
        <div className="question-counter__bar">
          <div className="question-counter__fill" style={{ width: `${(done / total) * 100}%` }}></div>
        </div>
      </div>

      {data.pending_questions.map((q, i) => (
        <QuestionCard key={q.id} q={q} index={i} state={answers[q.id]} onAnswer={onAnswer} />
      ))}
    </section>
  );
}

function QuestionCard({ q, index, state, onAnswer }: {
  q: PendingQuestion;
  index: number;
  state: AnswerState | undefined;
  onAnswer: (qid: string, value: string) => void;
}) {
  const answered = state?.answered;
  const [draft, setDraft] = useState(state?.answer ?? "");

  return (
    <div className={`question ${answered ? "is-answered" : ""}`}>
      <div className="question__head">
        <div className="question__num">Q{String(index + 1).padStart(2, "0")}</div>
        <div className="question__text">{q.question}</div>
      </div>
      <div className="question__context">{q.context}</div>

      {q.options.length > 0 ? (
        <div className="question__options">
          {q.options.map((opt) => (
            <div
              key={opt.value}
              className={`option-row ${state?.answer === opt.value ? "is-selected" : ""}`}
              onClick={() => onAnswer(q.id, opt.value)}
            >
              <div className="option-row__radio"></div>
              <div className="option-row__label">{opt.label}</div>
              {opt.recommended && <span className="option-row__rec">recomendada</span>}
            </div>
          ))}
        </div>
      ) : (
        <textarea
          className="question__textarea"
          placeholder="Escribe aquí — todo lo que pienses cuenta…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => onAnswer(q.id, draft)}
        />
      )}
    </div>
  );
}
