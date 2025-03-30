import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed w-full max-w-screen-md top-4 py-2 z-40 px-2 rounded-full bg-[#234164] ring-1 ring-gray-500/50 backdrop-blur-lg">
      <div className="w-full flex items-center justify-between">
        <div className="text-white">
          <img src="/logo.png" alt="" className="w-[50px]" />
        </div>
        <div className="flex gap-4">

          <button
            className="text-zinc-100 bg-[#008ABB] px-4 py-2 rounded-full"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
