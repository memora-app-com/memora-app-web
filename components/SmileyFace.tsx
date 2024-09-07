import React from "react";

const SmileyFace = (props: { className?: string; size?: number }) => {
  return (
    <div className={props.className}>
      <svg
        width={props.size || 155}
        height={props.size || 155}
        viewBox="0 0 155 137"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_28_1107)">
          <path
            d="M99.13 41.22C110.513 41.22 119.74 31.9926 119.74 20.61C119.74 9.22741 110.513 0 99.13 0C87.7474 0 78.52 9.22741 78.52 20.61C78.52 31.9926 87.7474 41.22 99.13 41.22Z"
            fill="black"
          />
          <path
            d="M20.2 76.26C31.3562 76.26 40.4 67.2161 40.4 56.06C40.4 44.9038 31.3562 35.86 20.2 35.86C9.04385 35.86 0 44.9038 0 56.06C0 67.2161 9.04385 76.26 20.2 76.26Z"
            fill="black"
          />
          <path
            d="M1.18005 106.61L13.3601 94.86C27.6701 108.48 52.7301 109.05 86.2901 94.35C119.85 79.65 136.06 61 136.11 41.09L153 40.11C159.93 76.43 141.09 110.57 101.07 128.1C61.0501 145.63 23.1901 136.34 1.18005 106.62V106.61Z"
            fill="black"
          />
        </g>
        <defs>
          <clipPath id="clip0_28_1107">
            <rect width="154.4" height="136.92" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default SmileyFace;
