import { FC } from "react";
import FormWrapper from "../wrappers/FormWrapper";
import LoginForm from "../components/authorization/main-components/LoginForm";

const Login: FC = () => {
  return (
    <FormWrapper>
      <LoginForm/>
    </FormWrapper>
  );
};

export default Login;
