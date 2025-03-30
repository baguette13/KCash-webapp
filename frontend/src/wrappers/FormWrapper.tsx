import { FC, ReactNode } from "react";

interface FormWrapperProps {
  children: ReactNode;
}

const FormWrapper: FC<FormWrapperProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-main-gray ">
        {children}
    </div>
  );
};

export default FormWrapper;
