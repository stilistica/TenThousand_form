import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  useGetFormByIdQuery,
  useSubmitResponseMutation,
} from "../features/forms/formsApi";
import type { GetFormByIdQueryVariables } from "../generated/graphql";

// Визначаємо тип для answers
type AnswersType = Record<
  string,
  string | string[] // для text/date -> string, для checkbox -> string[]
>;

function FormPage() {
  const { id: formId } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetFormByIdQuery({
    id: formId!,
  } as GetFormByIdQueryVariables);

  const [answers, setAnswers] = useState<AnswersType>({});

  const [submitResponse] =
    useSubmitResponseMutation();

  const handleChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  const form = data?.form;
  if (!form) return <div>Form not found</div>;

  // Типізація питань через codegen
  const questions = (form.questions ?? []).filter(
    (q): q is NonNullable<typeof q> => q != null,
  );

  const handleSubmit = async () => {
    if (!formId) return;

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, value]) => ({
          questionId,
          value: Array.isArray(value) ? value.join(", ") : value,
        }),
      );

      await submitResponse({
        formId,
        answers: formattedAnswers,
      }).unwrap();

      alert("Form submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <div>
      <h1>{form.title ?? "Untitled Form"}</h1>
      <p>{form.description ?? ""}</p>

      {questions.map((q, index) => {
        const safeId = q.id ?? `question-${index}`;

        return (
          <div
            key={safeId}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>{q.title ?? "Untitled Question"}</strong>
            </p>

            {/* TEXT */}
            {q.type === "TEXT" && (
              <input
                type="text"
                value={(answers[safeId] as string) ?? ""}
                onChange={(e) => handleChange(safeId, e.target.value)}
              />
            )}

            {/* DATE */}
            {q.type === "DATE" && (
              <input
                type="date"
                value={(answers[safeId] as string) ?? ""}
                onChange={(e) => handleChange(safeId, e.target.value)}
              />
            )}

            {/* MULTIPLE_CHOICE */}
            {q.type === "MULTIPLE_CHOICE" &&
              (q.options ?? [])
                .filter((opt): opt is string => opt != null)
                .map((opt, idx) => (
                  <label key={`${safeId}-${idx}`} style={{ display: "block" }}>
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
          </div>
        );
      })}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default FormPage;
