import { Navigate, Outlet, useLocation } from "react-router";
import { checkUserUuidAsync, isLoggedIn } from "../helpers/login";

const RequireAuth = () => {
  let location = useLocation();

  if (!isLoggedIn()) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Check if the User's uuid exists. If not, create it.
  checkUserUuidAsync();

  return <Outlet />;
}

export default RequireAuth;