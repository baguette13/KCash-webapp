import Marketplace from "../components/marketplace/Marketplace";
import LeftPanel from "../components/panels/main-components/LeftPanel";
import { useState } from "react";
import { baseUser } from "../components/panels/main-components/LeftPanel";
import { UserDetails } from "../interfaces/interfaces";

export interface PanelsProps {
  userDetails: UserDetails;
  setUserDetails: (userDetails: UserDetails) => void;
}

const MainPage = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>(baseUser);
  return (
    <div className="w-[100dvw] h-screen p-2 flex max-h-screen flex-row overflow-x-hidden">
      <LeftPanel userDetails={userDetails} setUserDetails={setUserDetails} />
      <Marketplace userDetails={userDetails} setUserDetails={setUserDetails} />
    </div>
  );
};

export default MainPage;
