import { FC, useState, useEffect } from "react";
import FormWrapper from "../wrappers/FormWrapper";
import LoginForm from "../components/authorization/main-components/LoginForm";
import SessionExpiredNotification from "../components/notification/SessionExpiredNotification";
import SessionExpiredDialog from "../components/notification/SessionExpiredDialog";

const Login: FC = () => {
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] = useState(false);
  
  useEffect(() => {
    const sessionExpired = sessionStorage.getItem('sessionExpired');
    if (sessionExpired === 'true') {
      const sessionExpiredSource = sessionStorage.getItem('sessionExpiredSource');
      
      if (sessionExpiredSource === 'dialog') {
        setShowSessionExpiredDialog(true);
      } else {
        setShowSessionExpired(true);
      }
      
      sessionStorage.removeItem('sessionExpired');
      sessionStorage.removeItem('sessionExpiredSource');
    }
  }, []);

  return (
    <FormWrapper>
      {showSessionExpired && (
        <SessionExpiredNotification onClose={() => setShowSessionExpired(false)} />
      )}
      {showSessionExpiredDialog && (
        <SessionExpiredDialog onClose={() => setShowSessionExpiredDialog(false)} />
      )}
      <LoginForm/>
    </FormWrapper>
  );
};

export default Login;
