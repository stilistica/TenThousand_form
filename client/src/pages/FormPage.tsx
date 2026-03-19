import s from "./FormPage.module.scss";
import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  useGetFormByIdQuery,
  useSubmitResponseMutation,
} from "../features/forms/formsApi";
import type { GetFormByIdQueryVariables } from "../generated/graphql";
import clsx from "clsx";
import { Link } from "react-router-dom";

// Визначаємо тип для answers
type AnswersType = Record<string, string | string[]>;

// Для помилок
type ErrorsType = Record<string, string>;

function FormPage() {
  const { id: formId } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetFormByIdQuery({
    id: formId!,
  } as GetFormByIdQueryVariables);

  const [answers, setAnswers] = useState<AnswersType>({});
  const [errors, setErrors] = useState<ErrorsType>({});

  const [submitResponse] = useSubmitResponseMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Одразу чистимо помилку для цього питання
    setErrors((prev) => ({
      ...prev,
      [questionId]: "",
    }));
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const form = data?.form;
  if (!form) return <p>Form not found</p>;

  const questions = (form.questions ?? []).filter(
    (q): q is NonNullable<typeof q> => q != null,
  );

  const validate = (): boolean => {
    const newErrors: ErrorsType = {};

    questions.forEach((q) => {
      const answer = answers[q.id!];

      if (q.type === "TEXT") {
        if (!answer || (answer as string).trim() === "") {
          newErrors[q.id!] = "This field is required";
        } else if ((answer as string).length > 1500) {
          newErrors[q.id!] = "Max 1500 characters allowed";
        }
      }

      if (q.type === "DATE") {
        if (!answer || (answer as string).trim() === "") {
          newErrors[q.id!] = "This field is required";
        }
      }

      if (q.type === "MULTIPLE_CHOICE") {
        if (!answer || (answer as string).trim() === "") {
          newErrors[q.id!] = "Please select an option";
        }
      }

      if (q.type === "CHECKBOX") {
        if (!answer || (answer as string[]).length === 0) {
          newErrors[q.id!] = "Please select at least one option";
        }
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!form?.id) {
      alert("Form ID missing!");
      return;
    }

    if (!validate()) return;

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, value]) => ({
          questionId,
          value: Array.isArray(value) ? value.join(", ") : value,
        }),
      );

      await submitResponse({
        formId: form.id,
        answers: formattedAnswers,
      }).unwrap();

      setIsSubmitted(true);
      setAnswers({});
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  const isFormValid = () => {
    return questions.every((q) => {
      const answer = answers[q.id!];

      if (q.type === "TEXT") return answer && (answer as string).trim() !== "";
      if (q.type === "DATE") return answer && (answer as string).trim() !== "";
      if (q.type === "MULTIPLE_CHOICE")
        return answer && (answer as string).trim() !== "";
      if (q.type === "CHECKBOX")
        return answer && (answer as string[]).length > 0;

      return true;
    });
  };

  return (
    <div className={clsx(s.container, "container")}>
      <div className={s.formInfo}>
        <h1>{form.title ?? "Untitled Form"}</h1>
        <p>{form.description ?? ""}</p>
        <div>
          <Link to="/">
            <button className="btn-back">← Back</button>
          </Link>
        </div>
        <hr className="line" />
      </div>
      <div className={s.questions}>
        {questions.map((q, index) => {
          const safeId = q.id ?? `question-${index}`;

          return (
            <div key={safeId} className={s.question}>
              <p>
                <strong>{q.title ?? "Untitled Question"}</strong>
              </p>

              {/* TEXT */}
              {q.type === "TEXT" && (
                <>
                  <input
                    type="text"
                    value={(answers[safeId] as string) ?? ""}
                    maxLength={1500}
                    onChange={(e) => handleChange(safeId, e.target.value)}
                  />
                  {errors[safeId] && (
                    <p style={{ color: "red" }}>{errors[safeId]}</p>
                  )}
                </>
              )}

              {/* DATE */}
              {q.type === "DATE" && (
                <>
                  <input
                    type="date"
                    value={(answers[safeId] as string) ?? ""}
                    onChange={(e) => handleChange(safeId, e.target.value)}
                  />
                  {errors[safeId] && (
                    <p style={{ color: "red" }}>{errors[safeId]}</p>
                  )}
                </>
              )}

              {/* MULTIPLE_CHOICE */}
              {q.type === "MULTIPLE_CHOICE" &&
                (q.options ?? [])
                  .filter((opt): opt is string => opt != null)
                  .map((opt, idx) => (
                    <label
                      key={`${safeId}-${idx}`}
                      style={{ display: "block" }}
                    >
                      <input
                        type="radio"
                        name={safeId}
                        value={opt}
                        checked={answers[safeId] === opt}
                        onChange={() => handleChange(safeId, opt)}
                      />
                      {opt}
                    </label>
                  ))}
              {q.type === "MULTIPLE_CHOICE" && errors[safeId] && (
                <p style={{ color: "red" }}>{errors[safeId]}</p>
              )}

              {/* CHECKBOX */}
              {q.type === "CHECKBOX" &&
                (q.options ?? [])
                  .filter((opt): opt is string => opt != null)
                  .map((opt, idx) => {
                    const selected = (answers[safeId] as string[]) ?? [];

                    return (
                      <label
                        key={`${safeId}-${idx}`}
                        style={{ display: "block" }}
                      >
                        <input
                          type="checkbox"
                          value={opt}
                          checked={selected.includes(opt)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleChange(safeId, [...selected, opt]);
                            } else {
                              handleChange(
                                safeId,
                                selected.filter((o) => o !== opt),
                              );
                            }
                          }}
                        />
                        {opt}
                      </label>
                    );
                  })}
              {q.type === "CHECKBOX" && errors[safeId] && (
                <p style={{ color: "red" }}>{errors[safeId]}</p>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!isFormValid()}
        className={s.submit}
        style={{
          opacity: !isFormValid() ? 0.8 : 1,
          cursor: !isFormValid() ? "not-allowed" : "pointer",
        }}
      >
        Submit
      </button>

      {isSubmitted && (
        <div className={s.modalOverlay}>
          <div className={s.modalContent}>
            <p>Form submitted successfully!</p>
            <Link to="/">
              <button onClick={() => setIsSubmitted(false)}>OK</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormPage;
