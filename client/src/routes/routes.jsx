import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/home";
import NotFound from "../pages/NotFound";
import Nosotros from "../pages/nosotros/nosotros";
import Contact from "../pages/contact/contact";
import Reservar from "../pages/reservar/reservar";
import Tarifas from "../pages/tarifas/tarifas";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "reservar", element: <Reservar /> },
      { path: "nosotros", element: <Nosotros />},
      { path: "contacto", element: <Contact/>},
      { path: "tarifas", element: <Tarifas/>}
     
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;