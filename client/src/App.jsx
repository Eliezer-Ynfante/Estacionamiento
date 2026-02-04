import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "@routes/Navigation";
import Footer from "@components/Footer";
import CookieNotice from "@components/CookieNotice";
import { AuthProvider } from "@context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <div className="max-w-full flex flex-col bg-white">
        {/* Notificación de Cookies */}
        <CookieNotice />
        
        {/* Header/Navigation - Fijo arriba con scroll suave */}
        <div className="w-full h-full sticky top-0 z-50">
          <Navbar />
        </div>
        {/* Contenido principal - con padding-top para que no quede debajo del nav */}
        <div className="w-full">
          <Outlet />
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
