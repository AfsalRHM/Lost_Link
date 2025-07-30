import React from 'react';

import { LucideIcon } from 'lucide-react';

interface LoginInputProps {
  type: 'email' | 'password' | 'text';
  icon: LucideIcon;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginInput: React.FC<LoginInputProps> = ({
  type,
  icon: Icon,
  placeholder,
  name,
  value,
  onChange
}) => {
  return (
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5 group-focus-within:text-blue-600 transition-colors duration-200" />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/60 backdrop-blur-sm"
      />
    </div>
  );
};

export default LoginInput;