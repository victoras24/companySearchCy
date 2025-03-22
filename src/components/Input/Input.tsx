import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { Icon } from "../Icon";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  primaryIcon?: IconDefinition;
  secondaryIcon?: IconDefinition;
  iconClass: string;
}

export const Input: React.FC<InputProps> = ({
  iconClass,
  primaryIcon,
  secondaryIcon,
}) => {
  return primaryIcon ? (
    <div className="search-input d-flex align-items-center p-2">
      <Icon
        symbol={primaryIcon}
        className={
          primaryIcon ? `search-input__${iconClass}--primary p-2` : iconClass
        }
      />
      <input className="search-input__input w-100" />
      {secondaryIcon && (
        <Icon
          symbol={secondaryIcon}
          className={
            secondaryIcon
              ? `search-input__${iconClass}--secondary p-2`
              : iconClass
          }
        />
      )}
    </div>
  ) : (
    <input className="search-input__input" />
  );
};
