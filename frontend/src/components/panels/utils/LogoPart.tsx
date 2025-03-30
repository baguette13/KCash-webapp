import TestProfilePicture from "../../../photos/download.png";
import React from 'react'; 

interface LogoPartProps {
  firstName: string;
  lastName: string;
  email: string;
}

const LogoPart: React.FC<LogoPartProps> = ({ firstName, lastName, email }) => {
  console.log(firstName)
  return (
    <div className="flex items-center space-x-4">
      <img
        src={TestProfilePicture}
        alt="Test Profile"
        className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
      />
      <p className="text-xl text-white font-semibold">
        {(firstName && lastName) ? `${firstName} ${lastName}` : email}
      </p>
    </div>
  );
};

export default LogoPart;
