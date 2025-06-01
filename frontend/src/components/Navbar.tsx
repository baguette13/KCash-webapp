import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isStaff, setIsStaff] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    const staffStatus = sessionStorage.getItem("is_staff");
    setIsLoggedIn(!!token);
    setIsStaff(staffStatus === "true");
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("is_staff");
    navigate("/login");
  };

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 w-full max-w-screen-md top-4 py-2 z-40 px-2 rounded-full bg-[#234164] ring-1 ring-gray-500/50 backdrop-blur-lg">
      <div className="w-full flex items-center justify-between">
        <div className="text-white flex items-center">
          <img src="/logo.png" alt="KCash Logo" className="w-[50px]" />
          {isStaff && <span className="ml-2 text-white font-semibold">Logistics Portal</span>}
        </div>
        <div className="flex gap-4">
          {!isLoggedIn ? (
            <button
              className="text-zinc-100 bg-[#008ABB] px-4 py-2 rounded-full"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          ) : (
            <>
              {isStaff ? (
                <button
                  className="text-zinc-100 bg-[#008ABB] px-4 py-2 rounded-full"
                  onClick={() => navigate("/logistics")}
                >
                  Dashboard
                </button>
              ) : (
                <button
                  className="text-zinc-100 bg-[#008ABB] px-4 py-2 rounded-full"
                  onClick={() => navigate("/main")}
                >
                  Products
                </button>
              )}
              <button
                className="text-zinc-100 bg-red-600 px-4 py-2 rounded-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;