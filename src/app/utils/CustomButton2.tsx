import React from "react";

const CustomButton2 = ({ text }: { text: string }) => {
  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 rounded-lg bg-bz-electric px-7 py-3.5 font-display font-bold text-white transition-colors hover:bg-bz-current"
    >
      <span>{text}</span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 21 21"
        fill="none"
        role="img"
        aria-hidden="true"
      >
        <path
          d="M8.5 15.5L12.5 11L8.5 6.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default CustomButton2;
