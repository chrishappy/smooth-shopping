import { Navigate } from "react-router-dom";
import { logoutCurrentUserPrep } from "../helpers/loginHelper";

const LogoutPage = () => {

  logoutCurrentUserPrep();

  return <Navigate to="/" />;
}

export default LogoutPage;