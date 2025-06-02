import Marketplace from "../components/marketplace/Marketplace";
import LeftPanel from "../components/panels/main-components/LeftPanel";
import TokenDebugPanel from "../components/notification/TokenDebugPanel";
import { useState, useEffect } from "react";
import { baseUser } from "../components/panels/main-components/LeftPanel";
import { UserDetails } from "../interfaces/interfaces";

export interface PanelsProps {
  userDetails: UserDetails;
  setUserDetails: (userDetails: UserDetails) => void;
}

const MainPage = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>(baseUser);
  const [showDebug, setShowDebug] = useState(false);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setShowDebug(urlParams.get('debug') === 'true');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <>
      <div className="w-[100dvw] h-screen p-2 flex max-h-screen flex-row overflow-x-hidden">
        <LeftPanel userDetails={userDetails} setUserDetails={setUserDetails} />
        <Marketplace userDetails={userDetails} setUserDetails={setUserDetails} />
      </div>
      <TokenDebugPanel visible={showDebug} />
    </>
  );
};

export default MainPage;
