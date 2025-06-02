import { FC, useEffect } from "react";

interface LoadingIndicatorProps {
  show: boolean;
}

const injectStyles = () => {
  const styleId = 'loading-indicator-styles';
  
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(350%); }
      }
      .animate-pulse-linear {
        animation: loading 1.5s infinite ease-in-out;
      }
    `;
    document.head.appendChild(style);
  }
};

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ show }) => {
  useEffect(() => {
    injectStyles();
    return () => {
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-[#234164] h-1">
      <div 
        className="h-full bg-[#4DA9D9] animate-pulse-linear" 
        style={{ width: '30%' }}
      ></div>
    </div>
  );
};

export default LoadingIndicator;
