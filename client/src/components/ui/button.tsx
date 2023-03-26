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
  hasTransition?: Boolean;
  onClick: () => void;
};

export default function Button({
  horizontalPadding = "px-4",
  hasTransition = true,
  ...props
}: ButtonProp) {
  return (
    <button
      className={classNames(
        `${props.extraClassnames} ${horizontalPadding} flex items-center gap-2 whitespace-nowrap rounded-md py-2 font-serif text-base font-medium  sm:text-xl`,
        {
          "bg-primary text-white": props.color === "Primary",
          "bg-neutral-black": props.color === "Dark",
          "bg-secondary-dark": props.color === "Secondary",
          "bg-transparent text-primary": props.color === "Transparent",
          "transition-all hover:scale-105": hasTransition,
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
