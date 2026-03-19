import { useGetFormsQuery } from "./features/forms/formsApi";
import { Link } from "react-router-dom";
import s from "./pages/HomePage.module.scss";
import "./App.css";
import clsx from "clsx";

function App() {
  const { data, isLoading, error } = useGetFormsQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading forms</p>;
  }

  const forms =
    data?.forms?.filter((f): f is NonNullable<typeof f> => f != null) || [];

  return (
    <div className={clsx(s.container, "container")}>
      <div className={s.info}>
        <h1>Forms</h1>

        <div>
          <Link to="/forms/new">
            <button className="neon-button">Create New Form</button>
          </Link>
        </div>
      </div>

      {forms.length === 0 && <p>No forms available</p>}

      {forms.map((form) => {
        if (!form.id) return null;

        return (
          <div key={form.id} className={s.formItem}>
            <div className={s.formInfo}>
              <h3>{form.title ?? "Untitled"}</h3>
              <p>{form.description ?? ""}</p>
            </div>

            <div className={s.formBtns}>
              <Link to={`/forms/${form.id}/fill`}>
                <button>View Form</button>
              </Link>
              <Link to={`/forms/${form.id}/responses`}>
                <button>View Responses</button>
              </Link>{" "}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
