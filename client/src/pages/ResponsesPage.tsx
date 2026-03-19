import s from "./ResponsesPage.module.scss";
import { useParams } from "react-router-dom";
import {
  useGetResponsesQuery,
  useGetFormByIdQuery,
} from "../features/forms/formsApi";

function ResponsesPage() {
  const { id: formId } = useParams<{ id: string }>();

  const { data: formData } = useGetFormByIdQuery({ id: formId! });
  const { data, isLoading, error } = useGetResponsesQuery({ formId: formId! });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading responses</div>;

  const form = formData?.form;

  const questions =
    form?.questions?.filter((q): q is NonNullable<typeof q> => q != null) || [];

  const responses =
    data?.responses?.filter((r): r is NonNullable<typeof r> => r != null) || [];

  const getQuestionTitle = (questionId: string) => {
    if (questionId.startsWith("question-")) {
      const idx = Number(questionId.split("-")[1]);
      return questions[idx]?.title ?? "Unknown question";
    }

    return (
      questions.find((q) => q.id === questionId)?.title ?? "Unknown question"
    );
  };

  return (
    <div className={s.container}>
      <h1>Responses</h1>

      {responses.length === 0 && <p>No responses yet</p>}

      {responses.map((response, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid gray",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          <h3>Response #{idx + 1}</h3>

          {response.answers?.map((ans, i) => {
            if (!ans) return null;

            return (
              <div key={i}>
                <strong>{getQuestionTitle(ans.questionId ?? "")}</strong>{" "}
                <p>{ans.value ?? ""}</p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default ResponsesPage;
