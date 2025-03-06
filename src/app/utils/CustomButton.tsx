import Image from "next/image";
import React from "react";

const CustomButton = ({ text }: { text: string }) => {
  return (
    <>
      <a
        href="/Quote"
        className="btn w-inline-block btn-border-anim stroke-gr custom-a bg-[#F6F0F0] scale-75 md:scale-100"
      >
        <h1 className="md:font-semibold text-black">{text}</h1>
        <div className="arrow-20 w-embed">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 21 21"
            fill="none"
            role="img"
            color="black"
          >
            <path
              d="M8.5 15.5L12.5 11L8.5 6.5"
              stroke="currentcolor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <Image
          src="https://cdn.prod.website-files.com/672799259500d2477d1eafa5/672799259500d2477d1eb09a_btg-bg.svg"
          loading="lazy"
          width="195"
          height="56"
          alt=""
          className="btn-bg"
        />
        <Image
          src="https://cdn.prod.website-files.com/672799259500d2477d1eafa5/672799259500d2477d1eb099_btn-bg-hover.svg"
          alt=""
          width="193"
          height="62"
          className="btn-bg-hover"
        />
        <div className="animating-block"></div>
        <div className="btn-hack"></div>
      </a>
    </>
  );
};

export default CustomButton;
