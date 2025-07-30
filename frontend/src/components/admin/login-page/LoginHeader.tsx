import React from 'react';

import { Shield } from 'lucide-react';

const LoginHeader: React.FC = () => {
  return (
    <div className="text-center space-y-1 pb-6 md:pb-8">
      <div className="flex justify-center mb-4">
        <div className="p-2 sm:p-3 bg-blue-600 rounded-xl shadow-lg">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Admin Portal
      </h1>
      <p className="text-gray-500 text-xs sm:text-sm mt-2">
        Secure access to your dashboard
      </p>
    </div>
  );
};

export default LoginHeader;