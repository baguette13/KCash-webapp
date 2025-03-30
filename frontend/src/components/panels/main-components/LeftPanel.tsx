import { FC, useEffect, useState } from "react";
import mainService from "../../../services/service";
import LogoPart from "../utils/LogoPart";
import Cart from "../utils/Cart";
import { UserDetails } from "../../../interfaces/interfaces";
import { PanelsProps } from "../../../pages/MainPage";

export const baseUser: UserDetails = {
  email: "",
  first_name: "",
  id: 0,
  last_name: "",
  username: "",
};

const LeftPanel: FC<PanelsProps> = ({ userDetails, setUserDetails }) => {
  

  useEffect(() => {
    mainService.getUserData().then((data) => {
      setUserDetails(data);
    });

  }, []);

  return (
    <div className="h-full flex flex-col w-[600px] max-h-screen mr-4 bg-[#234164] ring-1 ring-inset ring-gray-500/40 p-3.5">
      <div className="flex flex-col h-full p-3.5 space-y-3 bg-[#234164]">
        <LogoPart
          firstName={userDetails.first_name}
          lastName={userDetails.last_name}
          email={userDetails.email}
        />
        <hr />
        <Cart />
      </div>
    </div>
  );
};

export default LeftPanel;
