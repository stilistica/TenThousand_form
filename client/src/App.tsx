import { useGetFormsQuery } from "./features/forms/formsApi";
import { Link } from "react-router-dom";

function App() {
  const { data, isLoading, error } = useGetFormsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  // захищаємо від null
  const forms = data?.forms?.filter((f): f is NonNullable<typeof f> => f != null) || [];

  return (
    <div>
      <h1>Forms</h1>
      {forms.length === 0 && <p>No forms available</p>}
      {forms.map((form) => (
        <div key={form.id}>
          <h3>{form.title ?? "Untitled"}</h3>
          <p>{form.description ?? ""}</p>
          {form.id && <Link to={`/forms/${form.id}/fill`}>Open Form</Link>}
        </div>
      ))}
    </div>
  );
}

export default App;
