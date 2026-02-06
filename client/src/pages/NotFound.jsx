import { Link } from "react-router-dom";
import NotFoundImg from "@assets/image/robot.png";

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 absolute inset-0 z-0"
      style={{
        background: "#dcdcdc",
      }}
    >
      <img
        src={NotFoundImg}
        alt="Not Found"
        className="w-60 h-60 object-cover"
      />
      <h1
        className="text-6xl font-bold text-stone-950 mb-4"
        style={{
          fontFamily: "var(--font-heading-lg)",
          animation: "fadeInUp 0.8s ease-out 0.2s both",
        }}
      >
        Página no encontrada
      </h1>

      <p
        className=" text-lg text-black mb-8 max-w-md"
        style={{
          animation: "fadeInUp 0.8s ease-out 0.4s both",
        }}
      >
        Lo sentimos, la página que estás buscando no existe.
      </p>

      <Link
        to="/"
        className="bg-red-800 hover:bg-red-700 px-5 py-3 text-gray-200 rounded-xs shadow-lg"
        style={{
          fontFamily: "var(--font-body)",
          animation: "fadeInUp 0.8s ease-out 0.6s both",
        }}
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
