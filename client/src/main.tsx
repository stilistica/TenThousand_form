import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import FormPage from "./pages/FormPage";
import FormBuilder from "./pages/FormBuilder";
import ResponsesPage from "./pages/ResponsesPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/forms/:id/fill" element={<FormPage />} />
          <Route path="/forms/new" element={<FormBuilder />} />
          <Route path="/forms/:id/responses" element={<ResponsesPage />} />
        </Routes>
      </BrowserRouter>{" "}
    </Provider>
  </StrictMode>,
);
