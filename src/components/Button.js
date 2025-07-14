import React from 'react';

export function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold transition-shadow';
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-base-white',
    danger:  'bg-accent-red hover:bg-accent-red/90 text-base-white',
    outline: 'border border-primary-500 text-primary-500 bg-base-white hover:bg-primary-500 hover:text-base-white',
    disabled: 'bg-neutral-800/30 text-base-white/50 cursor-not-allowed',
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={variant === 'disabled' || props.disabled}
      {...props}
    />
  );
} 