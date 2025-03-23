import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { Icon } from "../Icon/index";

type Color = "primary" | "secondary";

type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.HTMLAttributes<HTMLInputElement> {
  icon?: IconDefinition;
  content: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  color: Color;
  size: Size;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  content,
  icon,
  onClick,
  color,
  size,
  className = `btn btn--${color} btn--${size}`,
}) => {
  return icon ? (
    <button onClick={onClick} className={className}>
      <Icon symbol={icon} style="btn__icon" />
      {content}
    </button>
  ) : (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
};
