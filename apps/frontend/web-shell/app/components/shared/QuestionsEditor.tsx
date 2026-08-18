/* ───────────────────────────────────────────
   QuestionsEditor — armar las preguntas de un
   examen Kahoot: pregunta + incisos + cuál es
   la correcta. Pensado para que un profesor sin
   nada de técnica lo complete solo.
   ─────────────────────────────────────────── */

'use client';

import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { fieldSx, softButtonSx } from '@/lib/muiFieldStyles';
import { APP_ICONS } from '@/lib/icons';

export interface QuestionDraft {
  prompt: string;
  options: string[];
  correctIndex: number;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

export function emptyQuestion(): QuestionDraft {
  return { prompt: '', options: ['', ''], correctIndex: 0 };
}

interface QuestionsEditorProps {
  questions: QuestionDraft[];
  onChange: (questions: QuestionDraft[]) => void;
  disabled?: boolean;
}

export function QuestionsEditor({ questions, onChange, disabled }: Readonly<QuestionsEditorProps>) {
  const updateQuestion = (index: number, patch: Partial<QuestionDraft>) => {
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  };

  const addQuestion = () => onChange([...questions, emptyQuestion()]);
  const removeQuestion = (index: number) => onChange(questions.filter((_, i) => i !== index));

  const addOption = (qIndex: number) => {
    const q = questions[qIndex];
    if (q.options.length >= MAX_OPTIONS) return;
    updateQuestion(qIndex, { options: [...q.options, ''] });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const q = questions[qIndex];
    if (q.options.length <= MIN_OPTIONS) return;
    const options = q.options.filter((_, i) => i !== oIndex);
    /* Si borrás la que estaba marcada como correcta (o una de antes, que
       corre el índice), la correcta cae en la primera opción — nunca queda
       apuntando a un inciso que ya no existe. */
    const correctIndex = oIndex === q.correctIndex ? 0 : oIndex < q.correctIndex ? q.correctIndex - 1 : q.correctIndex;
    updateQuestion(qIndex, { options, correctIndex });
  };

  /* Enter en cualquiera de estos campos (pregunta o inciso) no debe mandar
     el formulario completo — este editor vive dentro del <form> de "Nueva
     lección", y sin esto, tipear una respuesta y apretar Enter por costumbre
     crea el examen a medio llenar (o lo duplica, si después también se
     hace clic en "Asignar examen"). */
  const blockEnterSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-3" onKeyDown={blockEnterSubmit}>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="rounded-2xl border border-[#DDE7D7] bg-[#F8FBF5] p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.08em] text-[var(--green-700)]">
              Pregunta {qIndex + 1}
            </p>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                disabled={disabled}
                aria-label={`Eliminar pregunta ${qIndex + 1}`}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--ink-muted)] transition-colors hover:bg-white hover:text-[#BF2600]"
              >
                <Icon icon={APP_ICONS.trash} width={15} height={15} />
              </button>
            )}
          </div>

          <TextField
            value={question.prompt}
            onChange={(e) => updateQuestion(qIndex, { prompt: e.target.value })}
            placeholder="Ej. ¿Qué método HTTP se usa para crear un recurso?"
            disabled={disabled}
            fullWidth
            size="small"
            sx={{ ...fieldSx, mb: 2 }}
          />

          <p className="mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-muted)]">
            Opciones — marca la correcta
          </p>
          <div className="flex flex-col gap-2">
            {question.options.map((option, oIndex) => {
              const isCorrect = question.correctIndex === oIndex;
              return (
                <div key={oIndex} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuestion(qIndex, { correctIndex: oIndex })}
                    disabled={disabled}
                    aria-label={`Marcar inciso ${OPTION_LETTERS[oIndex]} como correcta`}
                    title="Marcar como correcta"
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[0.75rem] font-extrabold transition-colors ${
                      isCorrect
                        ? 'border-[var(--green-600)] bg-[var(--green-600)] text-white'
                        : 'border-[#DDE7D7] bg-white text-[var(--ink-muted)] hover:border-[var(--green-300)]'
                    }`}
                  >
                    {isCorrect ? <Icon icon={APP_ICONS.check} width={14} height={14} /> : OPTION_LETTERS[oIndex]}
                  </button>
                  <TextField
                    value={option}
                    onChange={(e) => {
                      const options = question.options.map((o, i) => (i === oIndex ? e.target.value : o));
                      updateQuestion(qIndex, { options });
                    }}
                    placeholder={`Inciso ${OPTION_LETTERS[oIndex]}`}
                    disabled={disabled}
                    fullWidth
                    size="small"
                    sx={fieldSx}
                  />
                  {question.options.length > MIN_OPTIONS && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, oIndex)}
                      disabled={disabled}
                      aria-label={`Eliminar inciso ${OPTION_LETTERS[oIndex]}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--ink-muted)] transition-colors hover:bg-white hover:text-[#BF2600]"
                    >
                      <Icon icon={APP_ICONS.close} width={16} height={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {question.options.length < MAX_OPTIONS && (
            <button
              type="button"
              onClick={() => addOption(qIndex)}
              disabled={disabled}
              className="mt-2 text-[0.8125rem] font-bold text-[var(--blue-600)] hover:text-[var(--blue-700)]"
            >
              + Agregar inciso
            </button>
          )}
        </div>
      ))}

      <Button
        type="button"
        onClick={addQuestion}
        disabled={disabled}
        fullWidth
        sx={{ ...softButtonSx, borderStyle: 'dashed', borderWidth: '2px' }}
        variant="outlined"
      >
        + Agregar pregunta
      </Button>
    </div>
  );
}
