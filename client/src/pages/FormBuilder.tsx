import s from "./FormBuilder.module.scss";
import { useState } from "react";
import { useCreateFormMutation } from "../features/forms/formsApi";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";

type QuestionType = "TEXT" | "MULTIPLE_CHOICE" | "CHECKBOX" | "DATE";

interface QuestionForm {
  id: string;
  title: string;
  type: QuestionType;
  options?: string[];
}

export default function FormBuilder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const navigate = useNavigate();
  const [createForm, { isLoading }] = useCreateFormMutation();

  const addQuestion = (type: QuestionType) => {
    setQuestions([
      ...questions,
      {
        id: uuid(),
        title: "",
        type,
        options: type === "TEXT" || type === "DATE" ? [] : [""],
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestionTitle = (id: string, title: string) => {
    if (title.length > 1200) return; // обмеження 1200 символів
    setQuestions(questions.map((q) => (q.id === id ? { ...q, title } : q)));
  };

  const updateOption = (qId: string, idx: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId || !q.options) return q;
        const newOptions = [...q.options];
        newOptions[idx] = value;
        return { ...q, options: newOptions };
      }),
    );
  };

  const addOption = (qId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, options: [...(q.options || []), ""] } : q,
      ),
    );
  };

  const removeOption = (qId: string, idx: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId || !q.options) return q;
        const newOptions = q.options.filter((_, i) => i !== idx);
        return { ...q, options: newOptions };
      }),
    );
  };

  const isFormValid = () => {
    if (!title.trim() || !description.trim()) return false;
    if (questions.length === 0) return false;
    for (const q of questions) {
      if (!q.title.trim()) return false;
      if (q.title.length > 1200) return false;
      if (
        (q.type === "MULTIPLE_CHOICE" || q.type === "CHECKBOX") &&
        (!q.options || q.options.length === 0)
      ) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    try {
      await createForm({
        title,
        description,
        questions: questions.map((q) => ({
          title: q.title,
          type: q.type,
          options: q.options?.filter(Boolean) || [],
        })),
      }).unwrap();

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={clsx(s.container, "container")}>
      <div className={s.info}>
        <h1>Create New Form</h1>
        <div>
          <Link to="/">
            <button className="btn-back">← Back</button>
          </Link>
        </div>
        <hr className="line" />
      </div>
      <div className={s.formInputs}>
        <input
          placeholder="Form Title*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description*"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <hr />
      <div className={s.conatinerQuestions}>
        <h2>Questions</h2>
        <div className={s.questions}>
          {questions.map((q, i) => (
            <div key={q.id} className={s.question}>
              <input
                placeholder={`Question #${i + 1}*`}
                value={q.title}
                onChange={(e) => updateQuestionTitle(q.id, e.target.value)}
              />
              <select
                value={q.type}
                onChange={(e) =>
                  setQuestions(
                    questions.map((qq) =>
                      qq.id === q.id
                        ? { ...qq, type: e.target.value as QuestionType }
                        : qq,
                    ),
                  )
                }
              >
                <option value="TEXT">Text</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="CHECKBOX">Checkbox</option>
                <option value="DATE">Date</option>
              </select>
              <button
                onClick={() => removeQuestion(q.id)}
                className={s.removeBtn}
              >
                ✕
              </button>

              {(q.type === "MULTIPLE_CHOICE" || q.type === "CHECKBOX") && (
                <div className={s.options}>
                  <h4>Options</h4>
                  {q.options?.map((opt, idx) => (
                    <div key={idx} className={s.optionRow}>
                      <input
                        placeholder="Variant option*"
                        value={opt}
                        onChange={(e) =>
                          updateOption(q.id, idx, e.target.value)
                        }
                      />
                      <button onClick={() => removeOption(q.id, idx)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    className={s.optionAdd}
                    onClick={() => addOption(q.id)}
                  >
                    Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className={s.addBtn} onClick={() => addQuestion("TEXT")}>
          Add New Question
        </button>
      </div>
      <button
        onClick={handleSubmit}
        className={clsx(s.submit, "neon-button")}
        disabled={isLoading || !isFormValid()}
      >
        {isLoading ? "Saving..." : "Save Form"}
      </button>
    </div>
  );
}
