import { useParams } from "react-router-dom";
import { useGetFormByIdQuery } from "../features/forms/formsApi";

function FormPage() {
  const { id: formId } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetFormByIdQuery({ id: formId! });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  const form = data?.form;
  if (!form) {
    return <div>Form not found</div>;
  }

  const questions = form.questions?.filter(
    (q): q is NonNullable<typeof q> => q != null
  ) || [];

  return (
    <div>
      <h1>{form.title ?? "Untitled Form"}</h1>
      <p>{form.description ?? ""}</p>
      <ul>
        {questions.map((q) => (
          <li key={q.id}>
            {q.title ?? "Untitled Question"} ({q.type ?? "TEXT"})
            {q.options && q.options.length > 0 && (
              <ul>
                {q.options.filter(Boolean).map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FormPage;