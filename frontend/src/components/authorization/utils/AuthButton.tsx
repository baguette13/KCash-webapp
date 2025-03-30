import { FC } from "react";

interface AuthButtonProps {
  action: string;
  handleClick: () => void;
}

const AuthButton: FC<AuthButtonProps> = ({ action, handleClick }) => {
  return (
    <div
      className="pt-0.5 pb-1 pl-7 pr-7 border-2 border-main-text mt-2 font-bold mb-2 rounded-md 
                        cursor-pointer transition-all transform hover:-translate-y-1 hover:ease-in-out duration-700 hover:bg-[#008ABB]"
      onClick={handleClick}
    >
      {action}
    </div>
  );
};

export default AuthButton;
