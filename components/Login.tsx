
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('27.58.154.12');
  const [password, setPassword] = useState('**********');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin("Demo Candidate");
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-[#0b2b4f] bg-opacity-90 relative overflow-hidden">
      {/* Background Watermark Pattern simulation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex flex-wrap justify-around items-center text-4xl font-bold text-white uppercase rotate-[-30deg]">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="m-8">SAMPLE TEXT</span>
        ))}
      </div>

      <div className="bg-white rounded-sm shadow-2xl w-full max-w-sm z-10 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Login (Demo)</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#eeeeee] border border-gray-300 p-2 text-gray-700 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#eeeeee] border border-gray-300 p-2 text-gray-700 outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-[#337ab7] hover:bg-blue-700 text-white font-bold py-2 px-4 transition-colors"
            >
              LOGIN
            </button>
          </div>
          
          <p className="text-orange-600 text-center text-xs font-bold uppercase cursor-pointer hover:underline">
            Click Login To proceed
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
