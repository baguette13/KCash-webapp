import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import mainService from "../services/service";
import { UserDetails } from "../interfaces/interfaces";

const PrivateRoute = () => {
  const token = sessionStorage.getItem("access_token");
  const [isStaff, setIsStaff] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await mainService.getUserData();
        const userData: UserDetails = response.data;
        setIsStaff(!!userData.is_staff);
        
        sessionStorage.setItem("is_staff", userData.is_staff ? "true" : "false");
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const staffStatus = sessionStorage.getItem("is_staff");
    if (staffStatus !== null) {
      setIsStaff(staffStatus === "true");
      setLoading(false);
    } else if (token) {
      checkUserRole();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isStaff && location.pathname === "/main") {
    return <Navigate to="/logistics" replace />;
  }
  
  if (!isStaff && location.pathname === "/logistics") {
    return <Navigate to="/main" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
