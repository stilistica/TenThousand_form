import s from "./ResponsesPage.module.scss";
import { useParams } from "react-router-dom";
import {
  useGetResponsesQuery,
  useGetFormByIdQuery,
} from "../features/forms/formsApi";
import type { GetResponsesQuery } from "../generated/graphql";
import clsx from "clsx";
import { Link } from "react-router-dom";

type ResponseType = NonNullable<
  NonNullable<GetResponsesQuery["responses"]>[number]
>;

type AnswerType = NonNullable<ResponseType["answers"]>[number];

function ResponsesPage() {
  const { id: formId } = useParams<{ id: string }>();

  const { data: formData } = useGetFormByIdQuery({ id: formId! });
  const { data, isLoading, error } = useGetResponsesQuery({ formId: formId! });

  if (isLoading) return <p className="text">Loading...</p>;
  if (error) return <p className="text">Error loading responses</p>;

  const form = formData?.form;

  const questions =
    form?.questions?.filter((q): q is NonNullable<typeof q> => q != null) || [];

  const responses =
    data?.responses?.filter((r): r is NonNullable<typeof r> => r != null) || [];

  const getAnswerValue = (response: ResponseType, questionId: string) => {
    const ans = response.answers?.find(
      (a): a is AnswerType => a != null && a.questionId === questionId,
    );

    return ans?.value ?? "-";
  };

  return (
    <div className={clsx(s.container, "container")}>
      <div className={s.info}>
        <h1>Responses</h1>

        <Link to="/">
          <button className="btn-back">← Back</button>
        </Link>
        <hr className="line"/>
      </div>

      {responses.length === 0 && <p className="text">No responses yet</p>}

      {responses.length > 0 && (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>#</th>
                {questions.map((q) => (
                  <th key={q.id} title={q.title ?? undefined}>
                    {q.title ?? "Untitled"}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {responses.map((response, idx) => (
                <tr key={response.id ?? idx}>
                  {" "}
                  <td>{idx + 1}</td>
                  {questions.map((q) => (
                    <td key={q.id} title={getAnswerValue(response, q.id!)}>
                      {getAnswerValue(response, q.id!)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResponsesPage;
