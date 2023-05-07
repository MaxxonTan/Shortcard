"use client";

import classNames from "classnames";
import { HTMLInputTypeAttribute } from "react";

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
  horizontalPadding?: string;
  extraClassnames?: string;
  hasTransition?: boolean;
  tooltip?: string;
  type?: HTMLInputTypeAttribute;
  onClick: () => void;
};

export default function Button({
  horizontalPadding = "px-4",
  hasTransition = true,
  type = "button",
  ...props
}: ButtonProp) {
  return (
    <button
      className={classNames(
        `${props.extraClassnames} ${horizontalPadding} flex items-center justify-center gap-2 whitespace-nowrap rounded-md py-2 font-serif text-base font-medium  sm:text-lg`,
        {
          "bg-primary text-white": props.color === "Primary",
          "bg-neutral-black": props.color === "Dark",
          "bg-secondary-dark text-neutral-black": props.color === "Secondary",
          "bg-transparent text-primary": props.color === "Transparent",
          "transition-all hover:scale-105": hasTransition,
        }
      )}
      onClick={props.onClick}
      title={props.tooltip}
      aria-label={props.tooltip}
    >
      {props.leftIcon}
      {props.text && <p className="text-center">{props.text}</p>}
      {props.rightIcon}
    </button>
  );
}
