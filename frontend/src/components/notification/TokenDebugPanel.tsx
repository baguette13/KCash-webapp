import React, { useState, useEffect } from 'react';
import tokenService from '../../services/tokenService';

interface TokenDebugPanelProps {
  visible: boolean;
}

const TokenDebugPanel: React.FC<TokenDebugPanelProps> = ({ visible }) => {
  const [tokenInfo, setTokenInfo] = useState<any>({});
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (visible) {
        setTokenInfo(tokenService.getTokenInfo());
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [visible]);
  
  if (!visible) return null;
  
  const getStatusColor = () => {
    if (!tokenInfo.valid) return 'bg-red-500';
    if (tokenInfo.willRefreshSoon) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 max-w-md opacity-90 text-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg flex items-center">
          Status Tokena 
          <span className={`ml-2 w-3 h-3 rounded-full ${getStatusColor()}`}></span>
        </h3>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-gray-400 hover:text-white"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>
      
      {tokenInfo.valid ? (
        <div>
          <div className="flex justify-between">
            <span>Wygasa o:</span>
            <span>{tokenInfo.expiryTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Pozostały czas:</span>
            <span>{tokenInfo.timeRemaining}</span>
          </div>
          <div className="flex justify-between">
            <span>Automatyczne odświeżanie:</span>
            <span>{tokenInfo.willRefreshSoon ? 'Wkrótce' : 'Nie potrzebne'}</span>
          </div>
          
          {expanded && (
            <div className="mt-2 border-t border-gray-700 pt-2">
              <h4 className="font-semibold mb-1">Szczegóły tokena:</h4>
              <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto">
                {JSON.stringify(tokenInfo.rawData, null, 2)}
              </pre>
              
              <div className="mt-2 flex space-x-2">
                <button 
                  className="bg-red-600 px-2 py-1 rounded text-xs"
                  onClick={() => {
                    sessionStorage.removeItem('access_token');
                    sessionStorage.setItem('sessionExpired', 'true');
                    sessionStorage.setItem('sessionExpiredSource', 'dialog');
                    window.location.href = '/login';
                  }}
                >
                  Symuluj wygaśnięcie
                </button>
                
                <button 
                  className="bg-blue-600 px-2 py-1 rounded text-xs"
                  onClick={() => {
                    tokenService.refreshToken().then(success => {
                      if (success) {
                        alert('Token został odświeżony!');
                        setTokenInfo(tokenService.getTokenInfo());
                      } else {
                        alert('Nie można odświeżyć tokena!');
                      }
                    });
                  }}
                >
                  Wymuś odświeżenie
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-red-400">
          {tokenInfo.message || "Token jest nieprawidłowy lub wygasł"}
        </div>
      )}
    </div>
  );
};

export default TokenDebugPanel;
