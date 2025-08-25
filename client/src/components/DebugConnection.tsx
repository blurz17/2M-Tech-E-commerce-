
// client/src/components/DebugConnection.tsx
import { useEffect, useState } from 'react';

const DebugConnection = () => {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'https://2-m.vercel.app';
        const response = await fetch(`${serverUrl}/api/debug`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStatus(`✅ Connected: ${data.message}`);
        } else {
          setStatus(`❌ Failed: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setStatus(`❌ Error: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      fontSize: '12px',
      zIndex: 9999
    }}>
      Server Status: {status}
    </div>
  );
};

export default DebugConnection;
