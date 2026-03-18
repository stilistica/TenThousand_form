import { useGetFormsQuery } from "./features/forms/formsApi";
import { Link } from "react-router-dom";

function App() {
  const { data, isLoading, error } = useGetFormsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading forms</div>;
  }

  const forms =
    data?.forms?.filter((f): f is NonNullable<typeof f> => f != null) || [];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Forms</h1>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/forms/new">
          <button>Create New Form</button>
        </Link>
      </div>

      {forms.length === 0 && <p>No forms available</p>}

      {forms.map((form) => {
        if (!form.id) return null;

        return (
          <div
            key={form.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{form.title ?? "Untitled"}</h3>
            <p>{form.description ?? ""}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <Link to={`/forms/${form.id}/fill`}>
                <button>View Form</button>
              </Link>

              <button disabled>View Responses</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;