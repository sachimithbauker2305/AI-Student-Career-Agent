import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#e86f51] hover:bg-[#d85d40] text-white shadow-lg shadow-[#e86f51]/25 focus:ring-[#e86f51]',
    secondary: 'bg-[#fffdf8] hover:bg-white text-[#18211f] border border-[#d8d0c1] shadow-sm focus:ring-[#e86f51]',
    outline: 'border-2 border-[#e86f51] text-[#c8543a] hover:bg-[#fff1eb] focus:ring-[#e86f51]',
    ghost: 'text-[#53615c] hover:bg-[#e7e1d5] hover:text-[#18211f] focus:ring-[#a6b5a7]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  );
}
