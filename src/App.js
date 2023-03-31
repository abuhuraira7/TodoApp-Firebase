import "./App.scss";
import "bootstrap/dist/js/bootstrap.bundle";
import Routes from "./pages/Routes";
import AuthContextProvider from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>

      <ToastContainer />
    </>
  );
}