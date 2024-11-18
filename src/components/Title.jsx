import React from "react";

export function Title({ children, className }) {
  return (
    <h1 className={`text-[26px] font-bold text-accent ${className}`}>
      {children}
    </h1>
  );
}

export function Description({ children, className }) {
  return (
    <p className={`text-sm lg:text-lg text-accent opacity-60 ${className}`}>
      {children}
    </p>
  );
}
