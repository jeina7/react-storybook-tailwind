import React from "react";

export const SampleBox = ({ children }) => {
  return (
    <div className="flex text-red-400 border-2 w-24 justify-center">
      {children}
    </div>
  );
};
