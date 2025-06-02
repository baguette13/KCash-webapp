import React, { FC, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

interface SessionExpiredDialogProps {
  onClose?: () => void;
}

const SessionExpiredDialog: FC<SessionExpiredDialogProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
    navigate('/login');
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center mb-4 text-red-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Session Expired
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Your session has expired for security reasons. Please log in again to continue.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleClose}
            className="bg-[#234164] hover:bg-[#1a304d] text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredDialog;
