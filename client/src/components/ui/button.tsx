"use client";

import classNames from "classnames";

type ButtonProp = {
  text?: string;
  color: "Primary" | "Secondary" | "Dark" | "Transparent";
  /**
   * Left Icon component from react-icons
   */
  leftIcon?: React.ReactNode;
  /**
   * Right Icon component from react-icons
   */
  rightIcon?: React.ReactNode;
  horizontalPadding?: String;
  extraClassnames?: String;
  onClick: () => void;
};

export default function Button({
  horizontalPadding = "px-4",
  ...props
}: ButtonProp) {
  return (
    <button
      className={classNames(
        `${props.extraClassnames} ${horizontalPadding} flex items-center gap-2 whitespace-nowrap rounded-md py-2 font-sans-serif text-base font-medium transition-all hover:scale-105 sm:text-xl`,
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
