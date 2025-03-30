import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock, FaUser } from "react-icons/fa";
import AuthHeader from "../utils/AuthHeader";
import AuthInput from "../utils/AuthInput";
import AuthButton from "../utils/AuthButton";
import AuthResponse from "../utils/AuthResponse";

interface Response {
  text: string;
  color: string;
}

const LoginForm: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [response, setResponse] = useState<Response>({ text: "", color: "" });
  const [responseIsVisible, setResponseIsVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const updateResponse = (text: string, color: string) => {
    setResponse({ text, color });
    setResponseIsVisible(true);
    setTimeout(() => setResponseIsVisible(false), 3000);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      updateResponse("Please fill all fields!", "bg-red-300");
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:8000/api/auth/token/",
        {
          username: username.trim(),
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      sessionStorage.setItem("access_token", result.data.access);
      sessionStorage.setItem("userId", result.data.id);
      navigate("/main");
    } catch (error) {
      updateResponse("Bad credentials!", "bg-red-300");
    }
  };

  return (
    <form className="rounded-lg w-72 h-96 bg-[#234164] text-white shadow-[6px_6px_20px_3px_rgba(0,0,0,0.7)] p-5 flex flex-col justify-center items-center font-exo">
      <AuthHeader text="Sign in" />
      <AuthInput
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        icon={<FaUser />}
      />
      <AuthInput
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        icon={<FaLock />}
      />

      {responseIsVisible && (
        <AuthResponse
          text={response.text}
          color={response.color}
          isVisible={responseIsVisible}
        />
      )}

      <AuthButton action="LOGIN" handleClick={handleLogin} />

    </form>
  );
};

export default LoginForm;
