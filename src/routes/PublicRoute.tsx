import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const timeTokenExp = localStorage.getItem("timeTokenExp");

  if (timeTokenExp && Number(timeTokenExp) * 1000 > Date.now()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
