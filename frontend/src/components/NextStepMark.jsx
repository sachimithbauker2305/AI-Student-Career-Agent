import React from 'react';

export default function NextStepMark({ className = "w-6 h-6" }) {
  return (
    <img
      src="/nextstep-logo.png"
      alt="NextStep logo"
      className={`${className} object-contain`}
    />
  );
}
