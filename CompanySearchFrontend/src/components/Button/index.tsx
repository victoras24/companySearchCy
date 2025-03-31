import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { Icon } from "../Icon/index";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariant> {
  icon?: IconDefinition;
  content: string;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  icon,
  variant,
  size,
  content,
  ...props
}) => {
  return icon ? (
    <button
      className={clsx(buttonVariant({ variant, size, className }))}
      {...props}
    >
      <Icon symbol={icon} style="btn__icon" />
      {content}
    </button>
  ) : (
    <button
      className={clsx(buttonVariant({ variant, size, className }))}
      {...props}
    >
      {content}
    </button>
  );
};

const buttonVariant = cva("rounded border-0", {
  variants: {
    variant: {
      primary: "bg-primary ",
      secondary: "bg-secondary",
      icon: "bg-transparent",
    },
    size: {
      sm: "py-1 px-2 fs-6",
      md: "py-2 px-3 fs-5",
      lg: "py-3 px-4 fs-5",
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
});
