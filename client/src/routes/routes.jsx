import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Home from "@pages/Home";
import NotFound from "@pages/NotFound";
import About from "@pages/About";
import Contact from "@pages/Contact";
import Booking from "@pages/Booking";
import Rate from "@pages/Rate";
import LoginView from "@pages/auth/LoginView";
import RegisterView from "@pages/auth/RegisterView";
import DashboardView from "@pages/admin/Dashboard";
import  ProtectedRoute  from "./ProtectedRoute";
import { ErrorBoundary } from "@components/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home />, errorElement: <ErrorBoundary /> },
      { 
        path: "reservar", 
        element: (
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary /> 
      },
      { path: "login", element: <LoginView />, errorElement: <ErrorBoundary /> },
      { path: "register", element: <RegisterView />, errorElement: <ErrorBoundary /> },
      { 
        path: "dashboard", 
        element: (
          <ProtectedRoute>
            <DashboardView />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
      },
      { path: "nosotros", element: <About />, errorElement: <ErrorBoundary /> },
      { path: "contacto", element: <Contact />, errorElement: <ErrorBoundary /> },
      { path: "tarifas", element: <Rate />, errorElement: <ErrorBoundary /> }
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;