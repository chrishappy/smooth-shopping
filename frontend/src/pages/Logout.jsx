import { Navigate } from "react-router-dom";
import { logoutCurrentUser } from "../helpers/loginHelper";

const LogoutPage = () => {

  logoutCurrentUser();

  return <Navigate to="/" />;
}

export default LogoutPage;