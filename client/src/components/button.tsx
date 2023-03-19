"use client";

import classNames from "classnames";

type ButtonProp = {
  text?: String;
  color: "Primary" | "Secondary" | "Dark" | "Transparent";
  /**
   * Left Icon component from react-icons
   */
  leftIcon?: React.ReactNode;
  /**
   * Right Icon component from react-icons
   */
  rightIcon?: React.ReactNode;
  extraClassnames?: String;
  onClick: () => void;
};

export default function Button(props: ButtonProp) {
  return (
    <button
      className={classNames(
        "flex items-center gap-2 rounded-md px-3 py-2 font-sans-serif font-semibold ring-neutral-black transition-all hover:ring-2",
        {
          "bg-primary text-white": props.color === "Primary",
          "bg-neutral-black": props.color === "Dark",
          "bg-secondary-dark": props.color === "Secondary",
          "bg-transparent text-primary": props.color === "Transparent",
        }
      )}
      onClick={props.onClick}
    >
      {props.leftIcon}
      {props.text && <p>{props.text}</p>}
      {props.rightIcon}
    </button>
  );
}
