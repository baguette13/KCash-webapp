import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
      onClick={onClose}
    >
      <div
        className="bg-[#234164] rounded-lg p-4 w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
            <button
            onClick={onClose}
            className="top-4 right-4 text-white hover:text-gray-300" 
            >
            ✕
            </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
