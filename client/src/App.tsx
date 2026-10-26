import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./components/Layout";
import { FormProvider, useForm } from "./lib/form";
import { AdminProvider } from "./lib/admin";
import StartPage from "./pages/StartPage";
import FormPage from "./pages/FormPage";
import ReviewPage from "./pages/ReviewPage";
import DonePage from "./pages/DonePage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import InstrumentSummary from "./pages/admin/InstrumentSummary";
import Responses from "./pages/admin/Responses";
import ResponseDetail from "./pages/admin/ResponseDetail";
import Settings from "./pages/admin/Settings";

function PublicRoutes() {
  const { def } = useForm();
  return (
    <Routes>
      <Route element={<PublicLayout school={def?.school.schoolName} />}>
        <Route index element={<StartPage />} />
        <Route path="form/:number" element={<FormPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="done" element={<DonePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <AdminProvider>
            <Routes>
              <Route path="login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="instruments/:number" element={<InstrumentSummary />} />
                <Route path="responses" element={<Responses />} />
                <Route path="responses/:id" element={<ResponseDetail />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Routes>
          </AdminProvider>
        }
      />
      <Route
        path="/*"
        element={
          <FormProvider>
            <PublicRoutes />
          </FormProvider>
        }
      />
    </Routes>
  );
}
