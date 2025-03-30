import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { Icon } from "../Icon";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  primaryIcon?: IconDefinition;
  secondaryIcon?: IconDefinition;
  iconClass: string;
  inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  cleanInputIcon: IconDefinition;
  cleanInputEvent: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  inputText: string;
  placeholder: string;
}

export const Input: React.FC<InputProps> = ({
  iconClass,
  primaryIcon,
  secondaryIcon,
  inputChange,
  loading,
  cleanInputIcon,
  cleanInputEvent,
  inputText,
  value,
  placeholder,
}) => {
  return primaryIcon ? (
    <div className="search-input d-flex align-items-center p-2">
      <Icon
        symbol={primaryIcon}
        style={
          primaryIcon ? `search-input__${iconClass}--primary p-2` : iconClass
        }
      />
      <input
        className="search-input__input w-100"
        onChange={inputChange}
        value={value}
        placeholder={placeholder}
      />
      {inputText && (
        <Icon
          symbol={cleanInputIcon}
          style="search-input__clear-icon"
          onClick={cleanInputEvent}
        />
      )}
      {loading && <span className="search-input__loader"></span>}
      {secondaryIcon && (
        <Icon
          symbol={secondaryIcon}
          style={
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
