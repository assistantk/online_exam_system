
import React from 'react';
import { UserInfo } from '../types';

interface HeaderProps {
  userInfo: UserInfo;
}

const Header: React.FC<HeaderProps> = ({ userInfo }) => {
  return (
    <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="border p-1">
           <img src="https://picsum.photos/id/0/60/60" alt="System Icon" className="w-12 h-12 grayscale" />
        </div>
        <div>
          <p className="text-sm font-medium">System Name : <span className="text-orange-600 font-bold">{userInfo.systemId}</span></p>
          <p className="text-xs text-orange-600 font-semibold">[Contact Invigilator if the Name and Photograph displayed on the screen is not yours]</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 border-l pl-4">
        <div className="text-right">
          <p className="text-sm font-medium">Candidate Name : <span className="text-orange-600 font-bold">{userInfo.name}</span></p>
          <p className="text-sm font-medium">Subject Name : <span className="text-orange-600 font-bold">{userInfo.subject}</span></p>
        </div>
        <div className="border p-1 bg-gray-100">
          <img src="https://picsum.photos/id/64/60/60" alt="Candidate" className="w-12 h-12 object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Header;
