import React from "react";

export default function Title({children,className}) {
  return (
    <h1 className={  `text-[26px] font-bold text-accent ${className}`}>
      {children}
    </h1>
  );
}
