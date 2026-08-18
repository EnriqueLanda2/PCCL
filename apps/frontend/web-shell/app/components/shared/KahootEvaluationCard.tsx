/* ───────────────────────────────────────────
   KahootEvaluationCard — quiz interactivo estilo Kahoot.
   Compartido entre CourseContentView (pestaña "Exámenes") y CoursePathView
   (el camino secuencial, donde un quiz no se puede saltar).
   ─────────────────────────────────────────── */

'use client';

import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { Badge } from '@/app/components/ui/Badge';
import { api, getErrorMessage } from '@/lib/api';
import { APP_ICONS } from '@/lib/icons';
import type { Evaluation } from '@/lib/types';

/** Mismo patrón que el botón "Volver" de CoursePathView: chevron + texto azul. */
function BackButton({ onClick, label = 'Volver' }: Readonly<{ onClick: () => void; label?: string }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mb-3 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[var(--blue-600)] transition-colors hover:text-[var(--blue-700)]"
    >
      <Icon
        icon={APP_ICONS.chevronLeft}
        width={16}
        height={16}
        className="transition-transform duration-200 ease-out group-hover:-translate-x-1"
      />
      {label}
    </button>
  );
}

const softButtonSx = {
  borderRadius: '999px',
  borderColor: 'var(--neutral-200)',
  bgcolor: 'rgba(255,255,255,0.82)',
  color: 'var(--ink-soft)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: '0 10px 22px rgba(23,50,77,0.08)',
  '&:hover': { bgcolor: 'var(--blue-50)', borderColor: 'var(--blue-300)' },
};

export function KahootEvaluationCard({ evaluation, onSubmitted, onBack }: Readonly<{ evaluation: Evaluation; onSubmitted: (score: number, passed: boolean) => void; onBack?: () => void }>) {
  const questions = evaluation.questions ?? [];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* `busy` (async) llega tarde para bloquear un segundo clic rápido en
     "Enviar examen" antes de que el botón se vea disabled — por eso mandaba
     el mismo intento duplicado. Un ref se lee/escribe al toque. */
  const submittingRef = useRef(false);
  const question = questions[current];
  const passed = score !== null && score >= evaluation.passingScore;

  const choose = (index: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = index;
      return next;
    });
  };

  const submit = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setBusy(true);
    setError(null);
    try {
      await api.submitEvaluationAttempt(evaluation.id, answers);
      const correct = questions.reduce((sum, item, index) => sum + (answers[index] === item.correctIndex ? 1 : 0), 0);
      const finalScore = questions.length ? Math.round((correct / questions.length) * 100) : 0;
      setScore(finalScore);
      onSubmitted(finalScore, finalScore >= evaluation.passingScore);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      submittingRef.current = false;
      setBusy(false);
    }
  };

  /** Reintentar tras reprobar: limpia respuestas y puntaje, vuelve a la primera pregunta. */
  const retry = () => {
    setScore(null);
    setAnswers([]);
    setCurrent(0);
  };

  return (
    <article className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_8px_24px_rgba(23,50,77,0.05)]">
      {onBack && <BackButton onClick={onBack} />}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[0.75rem] font-extrabold uppercase tracking-[0.18em] text-[var(--green-600)]">Examen </p>
          <h3 className="text-[1rem] font-extrabold text-[var(--ink)]">{evaluation.title}</h3>
          <p className="text-[0.8125rem] text-[var(--ink-muted)]">
            {evaluation.topic ?? 'Tema del curso'} · mínimo {evaluation.passingScore}% para aprobar
          </p>
        </div>
        <Badge variant={score !== null && score >= evaluation.passingScore ? 'green' : 'blue'}>
          {score === null ? `${questions.length} preguntas` : `${score}%`}
        </Badge>
      </div>

      {questions.length === 0 || !question ? (
        <p className="text-[0.875rem] text-[var(--ink-muted)]">Este examen aún no tiene preguntas configuradas.</p>
      ) : score !== null ? (
        <div className="flex flex-col gap-3">
          <div
            className="rounded-2xl p-4 text-[0.9063rem] font-semibold"
            style={{
              background: passed ? 'var(--green-50)' : '#FFF1F0',
              color: passed ? 'var(--green-700)' : '#E5484D',
            }}
          >
            Resultado: {score}% · {passed ? 'Aprobado' : `Necesitas al menos ${evaluation.passingScore}% para avanzar`}
          </div>
          {!passed && (
            <Button
              variant="contained"
              onClick={retry}
              sx={{ alignSelf: 'flex-start', borderRadius: '999px', bgcolor: 'var(--green-600)', fontFamily: 'var(--font-sans)', fontWeight: 800, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: 'var(--green-700)', boxShadow: 'none' } }}
            >
              Reintentar examen
            </Button>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between text-[0.8125rem] font-semibold text-[var(--ink-muted)]">
            <span>Pregunta {current + 1} de {questions.length}</span>
            <span>{question.timeLimitSeconds ?? 30}s</span>
          </div>
          <h4 className="mb-4 text-[1rem] font-extrabold text-[var(--ink)]">{question.prompt}</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => choose(index)}
                className="rounded-2xl border px-4 py-3 text-left text-[0.9063rem] font-semibold transition"
                style={{
                  borderColor: answers[current] === index ? 'var(--green-500)' : 'var(--neutral-100)',
                  background: answers[current] === index ? 'var(--green-50)' : '#fff',
                  color: 'var(--ink)',
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-4 rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{error}</p>
          )}
          <div className="mt-5 flex justify-between gap-3">
            <Button
              variant="outlined"
              disabled={current === 0}
              onClick={() => setCurrent((value) => Math.max(0, value - 1))}
              sx={softButtonSx}
            >
              Anterior
            </Button>
            {current < questions.length - 1 ? (
              <Button
                variant="contained"
                disabled={answers[current] === undefined}
                onClick={() => setCurrent((value) => Math.min(questions.length - 1, value + 1))}
                sx={{ borderRadius: '999px', bgcolor: 'var(--green-600)', fontFamily: 'var(--font-sans)', fontWeight: 800, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: 'var(--green-700)', boxShadow: 'none' } }}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                variant="contained"
                disabled={busy || answers.length < questions.length || answers.some((answer) => answer === undefined)}
                onClick={() => void submit()}
                sx={{ borderRadius: '999px', bgcolor: 'var(--green-600)', fontFamily: 'var(--font-sans)', fontWeight: 800, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: 'var(--green-700)', boxShadow: 'none' } }}
              >
                {busy ? 'Enviando…' : 'Enviar examen'}
              </Button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

/** Repaso de solo lectura: qué contestó el usuario la última vez, sin
    dejarlo volver a responder. */
export function KahootAttemptReview({ evaluation, attempt, onBack }: Readonly<{
  evaluation: Evaluation;
  attempt: { answers: number[]; score: number | null };
  onBack?: () => void;
}>) {
  const questions = evaluation.questions ?? [];
  return (
    <article className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_8px_24px_rgba(23,50,77,0.05)]">
      {onBack && <BackButton onClick={onBack} />}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[0.75rem] font-extrabold uppercase tracking-[0.18em] text-[var(--green-600)]">Examen · repaso</p>
          <h3 className="text-[1rem] font-extrabold text-[var(--ink)]">{evaluation.title}</h3>
        </div>
        <Badge variant={(attempt.score ?? 0) >= evaluation.passingScore ? 'green' : 'blue'}>
          {attempt.score ?? 0}%
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((question, index) => {
          const chosen = attempt.answers[index];
          return (
            <div key={index} className="rounded-2xl border border-[var(--neutral-100)] p-4">
              <p className="mb-3 text-[0.9063rem] font-bold text-[var(--ink)]">{index + 1}. {question.prompt}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option, optIndex) => {
                  const isCorrect = optIndex === question.correctIndex;
                  const isChosen = optIndex === chosen;
                  return (
                    <div
                      key={optIndex}
                      className="rounded-xl border px-3 py-2 text-[0.875rem] font-semibold"
                      style={{
                        borderColor: isCorrect ? 'var(--green-500)' : isChosen ? '#E5484D' : 'var(--neutral-100)',
                        background: isCorrect ? 'var(--green-50)' : isChosen ? '#FFF1F0' : '#fff',
                        color: 'var(--ink)',
                      }}
                    >
                      {option}
                      {isCorrect && ' ✓'}
                      {isChosen && !isCorrect && ' (tu respuesta)'}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
